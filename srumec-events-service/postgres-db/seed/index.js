import { sql, waitForDatabase } from "./db.js";
import seedEvents from "./01-events.js";
import seedComments from "./02-comments.js";

async function main() {
  if (process.env.SEED_ENABLED !== "true") {
    console.log("Seed is disabled");
    process.exit(0);
  }

  console.log("---- WAITING FOR DATABASE ----");

  await waitForDatabase();

  console.log("---- DATABASE READY ----");
  // ---------------------------
  // CHECK IF ALREADY SEEDED
  // ---------------------------
  const serviceName = "events-service"; // nebo events-service podle projektu

  const already = await sql`
    SELECT 1 FROM seeding_log WHERE service = ${serviceName}
  `;

  if (already.length > 0) {
    console.log(`✔ Seed already executed for ${serviceName}, skipping.`);
    process.exit(0);
  }

  console.log(`→ Seeding ${serviceName}...`);

  try {
    await seedEvents(sql);
    await seedComments(sql);
  } catch (err) {
    console.error("SEED FAILED:", err);
  }

  // ---------------------------
  // REGISTER THAT SEED WAS EXECUTED
  // ---------------------------
  await sql`
      INSERT INTO seeding_log (service)
      VALUES (${serviceName})
      ON CONFLICT (service) DO NOTHING
    `;

  console.log(`✔ Seed completed for ${serviceName}`);
  process.exit(0);
}

main();
