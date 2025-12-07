import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// read from ENV
const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  CHATS_APP_USER,
  CHATS_APP_PASSWORD,
} = process.env;

// postgres-js connection
const queryClient = postgres({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: CHATS_APP_USER,
  password: CHATS_APP_PASSWORD,
  database: POSTGRES_DB,
});

export const db = drizzle(queryClient);
