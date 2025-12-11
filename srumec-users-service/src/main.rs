use std::str;
use uuid::Uuid;
use regex::Regex;
use serde::{Serialize, Deserialize};

use tokio::net::{TcpListener, TcpStream};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio_postgres::{NoTls};

const NOT_FOUND: &str = "HTTP/1.1 404 NOT FOUND\r\n\r\n";
const BAD_REQUEST: &str = "HTTP/1.1 400 BAD REQUEST\r\n\r\n";
const OK_RESPONSE: &str = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n";
const INTERNAL_SERVER_ERROR: &str = "HTTP/1.1 500 INTERNAL SERVER ERROR\r\n\r\n";

#[derive(Serialize, Deserialize)]
struct User
{
    id: Option<Uuid>,

    name: String,
    email: String,
    role: Option<String>,
    banned: Option<bool>,
}

#[tokio::main]
async fn main()
{
    let db_url = option_env!("DATABASE_URL").unwrap_or("postgres://postgres:password@localhost:5432/postgres");

    // setup database
    setup_database(db_url).await.expect("DB setup failed");

    // start the server
    let listener = TcpListener::bind("0.0.0.0:8080").await.expect("Cannot bind port 8080");

    println!("Server started on port 8080");

    // handle the client
    loop
    {
        match listener.accept().await
        {
            Ok((stream, _)) =>
            {
                tokio::spawn(async move
                {
                    if let Err(e) = handle_client(stream, db_url).await
                    {
                        eprintln!("Client error: {:?}", e);
                    }
                });
            }
            Err(e) => eprintln!("Accept error: {:?}", e),
        }
    }
}

async fn handle_client(mut stream: TcpStream, db_url: &str) -> Result<(), Box<dyn std::error::Error>>
{
    let mut buffer = Vec::new();

    // read until headers end (\r\n\r\n)
    loop
    {
        let mut chunk = [0; 512];
        let n = stream.read(&mut chunk).await?;

        if n == 0
        {
            break;
        }

        buffer.extend_from_slice(&chunk[..n]);

        if buffer.windows(4).any(|w| w == b"\r\n\r\n")
        {
            break;
        }
    }

    let request = String::from_utf8_lossy(&buffer);

    let (status, content) = match &request[..]
    {
        req if req.starts_with("GET /users/") => handle_get_request(&req, db_url).await,
        req if req.starts_with("GET /users") => handle_get_all_request(db_url).await,
        req if req.starts_with("POST /users") => handle_post_request(&req, db_url).await,
        req if req.starts_with("PUT /users/") => handle_put_request(&req, db_url).await,
        req if req.starts_with("DELETE /users/") => handle_delete_request(&req, db_url).await,

        _ => (NOT_FOUND.to_string(), "404 Not Found".to_string()),
    };

    let response = format!("{}{}", status, content);

    // take the HTTP response and send it over the connection
    stream.write_all(response.as_bytes()).await?;

    Ok(())
}

async fn setup_database(db_url: &str) -> Result<(), Box<dyn std::error::Error>>
{
    let (client, connection) = tokio_postgres::connect(db_url, NoTls).await?;

    tokio::spawn(async move
    {
        if let Err(e) = connection.await
        {
            eprintln!("DB connection error: {:?}", e);
        }
    });

    // add a module for generating uuids and create the table
    client.batch_execute(
        "CREATE EXTENSION IF NOT EXISTS pgcrypto;

        CREATE TABLE IF NOT EXISTS users
        (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            role TEXT NOT NULL DEFAULT 'user',
            banned BOOLEAN DEFAULT FALSE
        );"
    ).await?;

    Ok(())
}

// get a user with the matching id
async fn handle_get_request(req: &str, db_url: &str) -> (String, String)
{
    let id = match Uuid::parse_str(get_user_id_from_request(req))
    {
        Ok(uuid) => uuid,
        Err(_) => return (BAD_REQUEST.to_string(), "User not found.".to_string()),
    };

    match tokio_postgres::connect(db_url, NoTls).await
    {
        Ok((client, connection)) =>
        {
            tokio::spawn(async move { connection.await.ok(); });

            match client.query_opt("SELECT id, name, email, role, banned FROM users WHERE id = $1", &[&id]).await
            {
                Ok(Some(row)) =>
                {
                    let user = User { id: Some(row.get(0)), name: row.get(1), email: row.get(2), role: row.get(3), banned: row.get(4) };

                    (OK_RESPONSE.to_string(), serde_json::to_string(&user).unwrap())
                }
                Ok(None) => (NOT_FOUND.to_string(), "User not found.".to_string()),
                Err(_) => (INTERNAL_SERVER_ERROR.to_string(), "DB error.".to_string()),
            }
        }
        Err(_) => (INTERNAL_SERVER_ERROR.to_string(), "DB connection error.".to_string()),
    }
}

// get all users
async fn handle_get_all_request(db_url: &str) -> (String, String)
{
    match tokio_postgres::connect(db_url, NoTls).await
    {
        Ok((client, connection)) =>
        {
            tokio::spawn(async move { connection.await.ok(); });

            match client.query("SELECT id, name, email, role, banned FROM users", &[]).await
            {
                Ok(rows) =>
                {
                    let users: Vec<User> = rows.into_iter().map(|row| User { id: Some(row.get(0)), name: row.get(1), email: row.get(2), role: row.get(3), banned: row.get(4) }).collect();

                    (OK_RESPONSE.to_string(), serde_json::to_string(&users).unwrap())
                }
                Err(_) => (INTERNAL_SERVER_ERROR.to_string(), "DB query error.".to_string()),
            }
        }
        Err(_) => (INTERNAL_SERVER_ERROR.to_string(), "DB connection error.".to_string()),
    }
}

// add a user
async fn handle_post_request(req: &str, db_url: &str) -> (String, String)
{
    let body = req.split("\r\n\r\n").nth(1).unwrap_or_default();

    let user: User = match serde_json::from_str(body)
    {
        Ok(u) => u,
        Err(_) => return (BAD_REQUEST.to_string(), "Invalid JSON.".to_string()),
    };

    let email_regex = Regex::new(r"^[^\s@.]+(\.[^\s@.]+)*@[^\s@.]+(\.[^\s@.]+)+$").unwrap();

    // validate the email
    if !email_regex.is_match(&user.email)
    {
        return (BAD_REQUEST.to_string(), "Invalid email format.".to_string());
    }

    match tokio_postgres::connect(db_url, NoTls).await
    {
        Ok((client, connection)) =>
        {
            tokio::spawn(async move { connection.await.ok(); });

            let exists = client.query_one("SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", &[&user.email]).await.unwrap();

            // check if the email already exists
            if exists.get::<_, bool>(0)
            {
                return (BAD_REQUEST.to_string(), "Email already exists.".to_string());
            }

            if let Err(_) = client.execute("INSERT INTO users (name, email) VALUES ($1, $2)", &[&user.name, &user.email]).await
            {
                return (INTERNAL_SERVER_ERROR.to_string(), "DB insert error.".to_string());
            }

            (OK_RESPONSE.to_string(), "User created successfully.".to_string())
        }
        Err(_) => (INTERNAL_SERVER_ERROR.to_string(), "DB connection error.".to_string()),
    }
}

// update a user with the matching id
async fn handle_put_request(req: &str, db_url: &str) -> (String, String)
{
    let id = match Uuid::parse_str(get_user_id_from_request(req))
    {
        Ok(uuid) => uuid,
        Err(_) => return (BAD_REQUEST.to_string(), "Invalid UUID.".to_string()),
    };

    let body = req.split("\r\n\r\n").nth(1).unwrap_or_default();

    let user: User = match serde_json::from_str(body)
    {
        Ok(u) => u,
        Err(_) => return (BAD_REQUEST.to_string(), "Invalid JSON.".to_string()),
    };

    match tokio_postgres::connect(db_url, NoTls).await
    {
        Ok((client, connection)) =>
        {
            tokio::spawn(async move { connection.await.ok(); });

            if let Err(_) = client.execute("UPDATE users SET name=$1, email=$2, role=$3, banned=$4 WHERE id=$5", &[&user.name, &user.email, &user.role, &user.banned, &id]).await
            {
                return (INTERNAL_SERVER_ERROR.to_string(), "DB update error.".to_string());
            }

            (OK_RESPONSE.to_string(), "User updated successfully".to_string())
        }
        Err(_) => (INTERNAL_SERVER_ERROR.to_string(), "DB connection error.".to_string()),
    }
}

// delete a user with the matching id
async fn handle_delete_request(req: &str, db_url: &str) -> (String, String)
{
    let id = match Uuid::parse_str(get_user_id_from_request(req))
    {
        Ok(uuid) => uuid,
        Err(_) => return (BAD_REQUEST.to_string(), "Invalid UUID.".to_string()),
    };

    match tokio_postgres::connect(db_url, NoTls).await
    {
        Ok((client, connection)) =>
        {
            tokio::spawn(async move { connection.await.ok(); });

            match client.execute("DELETE FROM users WHERE id=$1", &[&id]).await
            {
                // no rows were affected
                Ok(0) => (NOT_FOUND.to_string(), "User not found.".to_string()),

                Ok(_) => (OK_RESPONSE.to_string(), "User deleted successfully.".to_string()),
                Err(_) => (INTERNAL_SERVER_ERROR.to_string(), "DB delete error.".to_string()),
            }
        }
        Err(_) => (INTERNAL_SERVER_ERROR.to_string(), "DB connection error.".to_string()),
    }
}

// extract the user ID segment from a request path like "/users/<id>"
fn get_user_id_from_request(req: &str) -> &str
{
    req.split('/').nth(2).map(|s| s.split_whitespace().next().unwrap_or_default()).unwrap_or_default()
}