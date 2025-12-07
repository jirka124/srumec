import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// read from ENV
const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  EVENTS_APP_USER,
  EVENTS_APP_PASSWORD,
} = process.env;

// postgres-js connection
const queryClient = postgres({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: EVENTS_APP_USER,
  password: EVENTS_APP_PASSWORD,
  database: POSTGRES_DB,
});

export const db = drizzle(queryClient);
