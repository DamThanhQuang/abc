import "dotenv/config";
import { defineConfig } from "prisma/config";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let migrationUrl = process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL;
const ca = process.env.DATABASE_SSL_CA?.trim().replaceAll("\\n", "\n");
if (migrationUrl && ca) {
  if (!ca.includes("-----BEGIN CERTIFICATE-----")) throw new Error("DATABASE_SSL_CA must contain a PEM certificate.");
  // Prisma's migration engine uses a certificate file, unlike the pg adapter.
  // This is a public CA certificate; the database password never goes to disk.
  const certificatePath = join(mkdtempSync(join(tmpdir(), "astc-db-ca-")), "ca.crt");
  writeFileSync(certificatePath, ca);
  const url = new URL(migrationUrl);
  url.searchParams.set("sslmode", "require");
  url.searchParams.set("sslaccept", "strict");
  url.searchParams.set("sslcert", certificatePath.replaceAll("\\", "/"));
  migrationUrl = url.toString();
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a session/direct connection. The application itself
    // continues to use DATABASE_URL (Supavisor transaction pooler on Vercel).
    url: migrationUrl,
  },
});
