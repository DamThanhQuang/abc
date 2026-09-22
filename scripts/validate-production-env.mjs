const isVercelProduction = process.env.VERCEL_ENV === "production";

if (!isVercelProduction) {
  console.log("Production environment validation skipped (VERCEL_ENV is not production).");
  process.exit(0);
}

const required = [
  "AUTH_SECRET",
  "DATABASE_URL",
  "NEXT_PUBLIC_APP_URL",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

const errors = required
  .filter((name) => !process.env[name]?.trim())
  .map((name) => `Missing required environment variable: ${name}`);

function parseUrl(name) {
  const value = process.env[name]?.trim();
  if (!value) return undefined;

  try {
    return new URL(value);
  } catch {
    errors.push(`${name} must be a valid URL.`);
    return undefined;
  }
}

const siteUrl = parseUrl("NEXT_PUBLIC_APP_URL");
if (siteUrl && (siteUrl.href !== "https://astc.com.vn/" || siteUrl.username || siteUrl.password)) {
  errors.push("NEXT_PUBLIC_APP_URL must be exactly https://astc.com.vn in production.");
}

const databaseUrl = parseUrl("DATABASE_URL");
if (databaseUrl) {
  if (!["postgres:", "postgresql:"].includes(databaseUrl.protocol)) {
    errors.push("DATABASE_URL must be a PostgreSQL URL.");
  }
  if (["localhost", "127.0.0.1", "[::1]"].includes(databaseUrl.hostname)) {
    errors.push("DATABASE_URL must not point to a local database in production.");
  }
  if (!["require", "verify-ca", "verify-full"].includes(databaseUrl.searchParams.get("sslmode"))) {
    errors.push("DATABASE_URL must require TLS; use sslmode=verify-full for Supabase.");
  }
  if (databaseUrl.hostname.endsWith(".pooler.supabase.com") && databaseUrl.port !== "6543") {
    errors.push("DATABASE_URL must use the Supabase transaction pooler on port 6543.");
  }
}

const authUrl = parseUrl("AUTH_URL");
if (authUrl && authUrl.href !== "https://astc.com.vn/") {
  errors.push("AUTH_URL must be https://astc.com.vn in production, or be omitted for Vercel auto-detection.");
}

const redisUrl = parseUrl("UPSTASH_REDIS_REST_URL");
if (redisUrl && (redisUrl.protocol !== "https:" || redisUrl.username || redisUrl.password)) {
  errors.push("UPSTASH_REDIS_REST_URL must be an HTTPS URL without embedded credentials.");
}

const r2PublicUrl = parseUrl("R2_PUBLIC_URL");
if (r2PublicUrl) {
  if (r2PublicUrl.protocol !== "https:") {
    errors.push("R2_PUBLIC_URL must use HTTPS in production.");
  }
  if (r2PublicUrl.hostname.endsWith(".r2.dev")) {
    errors.push("R2_PUBLIC_URL must use the R2 custom domain, not the development r2.dev URL.");
  }
  if (r2PublicUrl.pathname !== "/" || r2PublicUrl.search || r2PublicUrl.hash || r2PublicUrl.username || r2PublicUrl.password) {
    errors.push("R2_PUBLIC_URL must be a custom-domain origin without a path, query or credentials.");
  }
  if (r2PublicUrl.hostname.endsWith(".r2.cloudflarestorage.com")) {
    errors.push("R2_PUBLIC_URL must be the public custom domain, not the S3 API endpoint.");
  }
}

if ((process.env.AUTH_SECRET?.trim().length ?? 0) < 32) {
  errors.push("AUTH_SECRET must contain at least 32 characters.");
}

if (process.env.RESEND_API_KEY) {
  for (const name of ["ADMIN_EMAIL", "EMAIL_FROM"]) {
    if (!process.env[name]?.trim()) {
      errors.push(`${name} is required when RESEND_API_KEY is configured.`);
    }
  }
}

if (errors.length > 0) {
  console.error("Vercel production environment validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Vercel production environment validation passed.");
