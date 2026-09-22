import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { databaseConnectionConfig } from "../src/lib/database-config.mjs";

const adapter = new PrismaPg(databaseConnectionConfig(process.env.DATABASE_URL));
const db = new PrismaClient({ adapter });

async function seedAdmin(): Promise<void> {
  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required to seed the admin account.",
    );
  }

  if (password.length < 10) {
    throw new Error("ADMIN_SEED_PASSWORD must be at least 10 characters.");
  }

  const existingAdminCount = await db.admin.count();
  if (existingAdminCount > 0) {
    console.log(`Admin table already has ${existingAdminCount} row(s); skipping seed.`);
    return;
  }

  await db.admin.create({
    data: {
      email,
      password: await hash(password, 12),
      name: "Admin",
    },
  });

  console.log(`Admin account created for ${email}.`);
}

seedAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
