
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl === "[SENSITIVE]") {
  throw new Error("DATABASE_URL nuk eshte konfiguruar.");
}

export const sql = neon(databaseUrl);
