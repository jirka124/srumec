import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// read from ENV
const {
  PGHOST = "chats-postgres",
  PGPORT = 5432,
  PGUSER = "root",
  PGPASSWORD = "root",
  PGDATABASE = "chats",
} = process.env;

// postgres-js connection
const queryClient = postgres({
  host: PGHOST,
  port: PGPORT,
  username: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
});

export const db = drizzle(queryClient);
