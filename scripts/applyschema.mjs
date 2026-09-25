import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const sql = neon(process.env.DATABASE_URL);
const ddl = readFileSync(new URL("../drizzle/0000_busy_magus.sql", import.meta.url), "utf8");
const statements = ddl
  .split("--> statement-breakpoint")
  .map((s) => s.trim())
  .filter(Boolean);

for (const stmt of statements) {
  const label = stmt.split("\n")[0].slice(0, 60);
  try {
    await sql.query(stmt);
    console.log("OK:", label);
  } catch (e) {
    console.error("FAIL:", label, "->", e.message);
    process.exitCode = 1;
  }
}
console.log("done");
