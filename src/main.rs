use std::io::{Read, Write};
use serde::{Serialize, Deserialize};
use std::net::{TcpListener, TcpStream};
use postgres::{Client, NoTls, Error};

const DB_URL: Option<&'static str> = option_env!("DATABASE_URL");

const NOT_FOUND: &str = "HTTP/1.1 404 NOT FOUND\r\n\r\n";
const OK_RESPONSE: &str = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n";
const INTERNAL_SERVER_ERROR: &str = "HTTP/1.1 500 INTERNAL SERVER ERROR\r\n\r\n";

#[derive(Serialize, Deserialize)]
struct User
{
    id: Option<u32>,

    name: String,
}

fn main()
{
    if let Err(error) = setup_database()
    {
        println!("Error: {}", error);

        return;
    }

    // start the server
    let listener: TcpListener = TcpListener::bind(format!("0.0.0.0:8080")).unwrap();

    println!("Server started at port 8080.");

    // handle the client
    for stream in listener.incoming()
    {
        match stream
        {
            Ok(stream) => { handle_client(stream); }

            Err(error) => { println!("Error: {}", error); }
        }
    }
}

fn handle_client(mut stream: TcpStream)
{
    let mut buffer = [0; 1024];
    let mut request: String = String::new();

    match stream.read(&mut buffer)
    {
        Ok(size) =>
        {
            request.push_str(String::from_utf8_lossy(&buffer[0..size]).as_ref());

            let (status_line, content) = match &*request
            {
                req if req.starts_with("POST /users") => handle_post_request(req),

                // TODO: GET, PUT, DELETE

                _ => (NOT_FOUND.to_string(), "404 Not Found".to_string()),
            };

            // take the HTTP response and send it over the connection
            stream.write_all(format!("{}{}", status_line, content).as_bytes()).unwrap();
        }

        Err(error) => { println!("Error: {}", error); }
    }
}

fn handle_post_request(request: &str) -> (String, String)
{
    match (get_user_request_body(&request), Client::connect(DB_URL.unwrap_or(""), NoTls))
    {
        (Ok(user), Ok(mut client)) =>
        {
            client.execute("INSERT INTO users (name) VALUES ($1)", &[&user.name]).unwrap();

            (OK_RESPONSE.to_string(), "User created successfully.".to_string())
        }

        _ => (INTERNAL_SERVER_ERROR.to_string(), "Error".to_string()),
    }
}

fn setup_database() -> Result<(), Error>
{
    // connect to the database
    let mut client: Client = Client::connect(DB_URL.unwrap_or(""), NoTls)?;

    // create the table
    client.batch_execute(
        "CREATE TABLE IF NOT EXISTS users
        (
            id SERIAL PRIMARY KEY,

            name TEXT NOT NULL
        );"
    )?;

    Ok(())
}

// deserialize the User struct from the HTTP request body
fn get_user_request_body(request: &str) -> Result<User, serde_json::Error>
{
    serde_json::from_str(request.split("\r\n\r\n").last().unwrap_or_default())
}