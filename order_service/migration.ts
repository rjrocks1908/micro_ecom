import { Pool } from "pg";
import { config } from "./src/config";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";

async function runMigration() {
  try {
    console.log("migration start...");
    const pool = new Pool({
      connectionString: config.DATABASE_URL,
    });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("migration success");
    pool.end();
  } catch (err) {
    console.error("migration error", err);
  }
}
runMigration();
