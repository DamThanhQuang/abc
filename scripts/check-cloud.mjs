// Read-only checks. Never print credentials, connection strings or customer data.
import "dotenv/config";
import { Client } from "pg";
import { databaseConnectionConfig } from "../src/lib/database-config.mjs";
import { S3Client, HeadBucketCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const tables = ["Admin", "Category", "Product", "TechnicalSpec", "NewsArticle", "ContactRequest"];

async function checkDatabase(name) {
  if (!process.env[name]) return console.log(`${name}: not configured`);
  const url = new URL(process.env[name]);
  if (process.argv.includes("--verify-tls")) url.searchParams.set("sslmode", "verify-full");
  const client = new Client({
    ...databaseConnectionConfig(url.toString()),
    connectionTimeoutMillis: 10000,
    statement_timeout: 10000,
  });
  try {
    await client.connect();
    await client.query("BEGIN READ ONLY");
    // pg_stat_ssl reports the pooler -> database leg, not our socket to Supavisor.
    const encrypted = client.connection.stream.encrypted === true;
    console.log(`${name}: connected; client TLS=${encrypted}; certificate verified=${client.connection.stream.authorized === true}`);
    const { rows: security } = await client.query(
      "SELECT c.relname AS table_name, c.relrowsecurity AS rls FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname = ANY($1::text[]) ORDER BY c.relname",
      [tables],
    );
    console.log(`${name}: tables/RLS ${JSON.stringify(security)}`);
    if (security.length !== tables.length || security.some((table) => !table.rls)) process.exitCode = 1;
    const { rows: roles } = await client.query("SELECT rolsuper, rolbypassrls FROM pg_roles WHERE rolname=current_user");
    console.log(`${name}: database role privileges ${JSON.stringify(roles[0])}`);
    const { rows: migrationTable } = await client.query("SELECT to_regclass('public._prisma_migrations') IS NOT NULL AS present");
    if (migrationTable[0].present) {
      const { rows } = await client.query('SELECT migration_name, finished_at IS NOT NULL AS finished, rolled_back_at IS NOT NULL AS rolled_back FROM "_prisma_migrations" ORDER BY started_at');
      console.log(`${name}: migrations ${JSON.stringify(rows)}`);
    } else console.log(`${name}: WARNING no Prisma migration history`);
    if (name === "DATABASE_URL") {
      const { rows: policies } = await client.query("SELECT tablename, policyname, roles, cmd, qual, with_check FROM pg_policies WHERE schemaname='public' AND tablename = ANY($1::text[]) ORDER BY tablename, policyname", [tables]);
      console.log(`RLS policies: ${JSON.stringify(policies)}`);
      const { rows } = await client.query('SELECT image AS url FROM "Product" UNION ALL SELECT unnest(images) FROM "Product" UNION ALL SELECT image FROM "Category" WHERE image IS NOT NULL UNION ALL SELECT image FROM "NewsArticle"');
      const origins = {};
      for (const { url } of rows) {
        let origin;
        try { origin = new URL(url).origin; } catch { origin = "relative-or-invalid"; }
        origins[origin] = (origins[origin] ?? 0) + 1;
      }
      console.log(`Stored image origins (counts only): ${JSON.stringify(origins)}`);
      const { rows: admins } = await client.query('SELECT count(*)::int AS count FROM "Admin"');
      console.log(`Admin accounts: ${admins[0].count}`);
    }
  } catch (error) {
    console.error(`${name}: FAILED (${error.code ?? error.name}); details suppressed to protect credentials`);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

async function checkR2() {
  const required = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_URL"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.log(`R2: missing ${missing.join(", ")}`);
    process.exitCode = 1;
    return;
  }
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
    maxAttempts: 1,
    requestHandler: { connectionTimeout: 10000, requestTimeout: 15000 },
  });
  try {
    const Bucket = process.env.R2_BUCKET_NAME;
    await client.send(new HeadBucketCommand({ Bucket }));
    const listing = await client.send(new ListObjectsV2Command({ Bucket, Prefix: "uploads/", MaxKeys: 1 }));
    console.log(`R2: bucket accessible; sample object found=${Boolean(listing.Contents?.length)}`);
    const key = listing.Contents?.[0]?.Key;
    if (key) {
      const url = `${process.env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`;
      const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15000) });
      console.log(`R2 public image: HTTP ${response.status}; type=${response.headers.get("content-type")}; cache=${response.headers.get("cache-control")}`);
      if (!response.ok) process.exitCode = 1;
    }
    console.log("R2: PUT/DELETE permissions and dashboard settings were not tested (read-only audit).");
  } catch (error) {
    console.error(`R2: FAILED (${error.code ?? error.name}; HTTP ${error.$metadata?.httpStatusCode ?? "unknown"})`);
    process.exitCode = 1;
  } finally {
    client.destroy();
  }
}

await Promise.all([checkDatabase("DATABASE_URL"), checkDatabase("DIRECT_URL"), checkR2()]);
