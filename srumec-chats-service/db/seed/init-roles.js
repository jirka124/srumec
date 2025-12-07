import postgres from "postgres";

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,

  CHATS_OWNER_USER,
  CHATS_OWNER_PASSWORD,
  CHATS_APP_USER,
  CHATS_APP_PASSWORD,
} = process.env;

const sql = postgres({
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
});

async function exec(sqlText) {
  await sql.unsafe(sqlText);
}

function createRoleIfNotExists(role, password, params = "") {
  return `
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${role}') THEN
        CREATE ROLE ${role}
          LOGIN
          PASSWORD '${password}'
          ${params};
    END IF;
END
$$;
`;
}

export async function initRoles() {
  console.log("🔐 Initializing Postgres roles (postgres module)…");

  await exec(
    createRoleIfNotExists(CHATS_OWNER_USER, CHATS_OWNER_PASSWORD, "CREATEDB")
  );

  await exec(
    createRoleIfNotExists(
      CHATS_APP_USER,
      CHATS_APP_PASSWORD,
      "NOSUPERUSER NOCREATEDB NOCREATEROLE"
    )
  );

  await exec(`
GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO ${CHATS_APP_USER};
GRANT USAGE ON SCHEMA public TO ${CHATS_APP_USER};

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${CHATS_APP_USER};

GRANT SELECT, INSERT, UPDATE, DELETE
  ON ALL TABLES IN SCHEMA public TO ${CHATS_APP_USER};
`);

  console.log("✅ Roles initialized successfully.");
}
