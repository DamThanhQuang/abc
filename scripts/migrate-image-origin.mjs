// Default is a read-only dry run. Back up the database before using --apply.
import "dotenv/config";
import { Client } from "pg";
import { databaseConnectionConfig } from "../src/lib/database-config.mjs";
import { parseArgs } from "node:util";

const { values } = parseArgs({ options: {
  from: { type: "string" }, to: { type: "string" }, apply: { type: "boolean", default: false },
} });
function origin(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
    throw new Error("Use HTTPS origins without paths, query strings or credentials.");
  }
  return url.origin;
}
if (!values.from || !values.to) throw new Error("Usage: node scripts/migrate-image-origin.mjs --from https://OLD --to https://NEW [--apply]");
const from = `${origin(values.from)}/`;
const to = `${origin(values.to)}/`;
if (from === to) throw new Error("Source and destination must differ.");
const client = new Client({
  ...databaseConnectionConfig(process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL),
  connectionTimeoutMillis: 10000, statement_timeout: 30000,
});
const models = [
  { table: "Product", fields: ["image", "images", "description"] },
  { table: "Category", fields: ["image", "description"] },
  { table: "NewsArticle", fields: ["image", "content"] },
];
function replace(value) {
  if (Array.isArray(value)) return value.map(replace);
  return typeof value === "string" ? value.replaceAll(from, to) : value;
}
try {
  await client.connect();
  await client.query(values.apply ? "BEGIN" : "BEGIN READ ONLY");
  for (const { table, fields } of models) {
    // Identifiers are constants above, never supplied by the caller.
    const columns = fields.map((field) => `"${field}"`).join(", ");
    const { rows } = await client.query(`SELECT id, ${columns} FROM "${table}"${values.apply ? " FOR UPDATE" : ""}`);
    let changed = 0;
    for (const row of rows) {
      const next = fields.map((field) => replace(row[field]));
      if (fields.every((field, i) => JSON.stringify(row[field]) === JSON.stringify(next[i]))) continue;
      changed++;
      if (values.apply) {
        const assignments = fields.map((field, i) => `"${field}" = $${i + 1}`).join(", ");
        await client.query(`UPDATE "${table}" SET ${assignments}, "updatedAt" = NOW() WHERE id = $${fields.length + 1}`, [...next, row.id]);
      }
    }
    console.log(`${table}: ${changed} row(s) ${values.apply ? "updated" : "would change"}`);
  }
  await client.query(values.apply ? "COMMIT" : "ROLLBACK");
  console.log(values.apply ? "Committed. Redeploy/revalidate the site to refresh cached pages." : "Dry run only: no data changed.");
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  console.error(`Migration failed (${error.code ?? error.name}); transaction rolled back.`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
