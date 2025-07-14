import { Pool } from "pg";
import { config } from "../config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export const DB: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
