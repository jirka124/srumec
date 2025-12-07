import postgres from "postgres";

// read from ENV
const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

export async function waitForDatabase({
  maxRetries = 20,
  initialDelay = 500,
} = {}) {
  let attempt = 1;
  let delay = initialDelay;

  while (attempt <= maxRetries) {
    try {
      console.log(`DB healthcheck: attempt ${attempt}/${maxRetries}`);

      const temp = postgres({
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        username: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
      });

      await temp`SELECT 1`;

      console.log("✔ Database is ready");
      await temp.end();
      return true;
    } catch (err) {
      console.log(`✖ DB not ready: ${err.message}`);
      console.log(`   waiting ${delay}ms before retry…`);
      await new Promise((res) => setTimeout(res, delay));
      delay = Math.min(delay * 1.5, 5000); // exponential backoff
      attempt++;
    }
  }

  console.error("❌ Database failed to become ready in time.");
  process.exit(1);
}

export const sql = postgres({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
});
