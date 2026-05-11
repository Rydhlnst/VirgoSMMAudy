import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }

  return url;
}

export function getDb() {
  if (!dbInstance) {
    const sql = neon(getDatabaseUrl());
    dbInstance = drizzle(sql, { schema });
  }

  return dbInstance;
}
