import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@/db/schema";

neonConfig.webSocketConstructor = ws;

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;
let poolInstance: Pool | null = null;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }

  return url;
}

export function getDb() {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString: getDatabaseUrl(),
    });
  }

  if (!dbInstance) {
    dbInstance = drizzle(poolInstance, { schema });
  }

  return dbInstance;
}
