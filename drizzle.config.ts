import { defineConfig } from "drizzle-kit";

const command = process.argv.join(" ");
const requiresDatabasePath = /\b(studio|migrate|push|pull)\b/.test(command);
const dbPath = process.env.SONIVA_DB_PATH?.trim();

if (requiresDatabasePath && !dbPath) {
  throw new Error(
    "SONIVA_DB_PATH is required for drizzle-kit studio/migrate/push/pull because Soniva uses a runtime SQLite file outside the repository. Set SONIVA_DB_PATH to the soniva.sqlite path shown by the app before running this command."
  );
}

const dbUrl = dbPath
  ? (dbPath.startsWith("file:") ? dbPath : `file:${dbPath.replace(/\\/g, "/")}`)
  : undefined;

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/drizzle/schema.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
  ...(dbUrl ? { dbCredentials: { url: dbUrl } } : {})
});
