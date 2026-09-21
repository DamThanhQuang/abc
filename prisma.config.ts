import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a session/direct connection. The application itself
    // continues to use DATABASE_URL (Supavisor transaction pooler on Vercel).
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
