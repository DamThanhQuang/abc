import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts --demo",
  },
  datasource: {
    // Runtime: on Supabase, point DATABASE_URL at the Supavisor transaction
    // pooler (port 6543). For local dev the direct postgres URL is fine.
    //
    // Migrations: Prisma reads DIRECT_URL automatically when it exists.
    // Set it to the direct Supabase connection (port 5432) so DDL and
    // advisory locks work. Not needed for local development.
    url: process.env["DATABASE_URL"],
  },
});
