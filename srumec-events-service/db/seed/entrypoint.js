import { waitForDatabase } from "./db.js";
import { initRoles } from "./init-roles.js";
import { execSync } from "child_process";
import { runSeed } from "./index.js";

async function main() {
  try {
    console.log("========================================");
    console.log("🚀  Waiting for DB to go up...");
    console.log("========================================");

    await waitForDatabase();

    console.log("========================================");
    console.log("🚀  Running DB Users Initialization...");
    console.log("========================================");

    await initRoles();

    console.log("========================================");
    console.log("🚀  Running DRIZZLE migrations...");
    console.log("========================================");

    execSync("npx drizzle-kit migrate --config=drizzle.config.mts", {
      stdio: "inherit",
    });

    console.log("========================================");
    console.log("🌱  Running SEEDER...");
    console.log("========================================");

    await runSeed();

    console.log("========================================");
    console.log("✔ Seeder completed successfully");
    console.log("========================================");
  } catch (err) {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  }
}

main();
