import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const validEnv = {
  ...process.env,
  VERCEL_ENV: "production",
  AUTH_SECRET: "a".repeat(48),
  AUTH_URL: "https://astc.com.vn",
  DATABASE_URL: "postgresql://user:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=verify-full",
  NEXT_PUBLIC_APP_URL: "https://astc.com.vn",
  R2_ACCOUNT_ID: "test-account",
  R2_ACCESS_KEY_ID: "test-key",
  R2_SECRET_ACCESS_KEY: "test-secret",
  R2_BUCKET_NAME: "test-bucket",
  R2_PUBLIC_URL: "https://images.astc.com.vn",
  UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "test-token",
  RESEND_API_KEY: "",
};

function validate(overrides: Record<string, string> = {}) {
  return spawnSync(process.execPath, ["scripts/validate-production-env.mjs"], {
    env: { ...validEnv, ...overrides }, encoding: "utf8",
  });
}

describe("production environment gate", () => {
  it("accepts the canonical site and encrypted services", () => {
    expect(validate().status).toBe(0);
  });

  it.each([
    ["NEXT_PUBLIC_APP_URL", "https://astc.com.vn/wrong-path"],
    ["AUTH_URL", "http://localhost:3000"],
    ["DATABASE_URL", "postgresql://user:password@example.com:6543/postgres"],
    ["DATABASE_URL", "postgresql://user:password@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=verify-full"],
    ["R2_PUBLIC_URL", "https://pub-example.r2.dev"],
    ["R2_PUBLIC_URL", "https://account.r2.cloudflarestorage.com"],
    ["R2_PUBLIC_URL", "https://images.astc.com.vn/?token=example"],
    ["UPSTASH_REDIS_REST_URL", "http://test.upstash.io"],
    ["UPSTASH_REDIS_REST_TOKEN", ""],
  ])("rejects an invalid %s setting (%s)", (key, value) => {
    const result = validate({ [key]: value });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain(key);
    expect(result.stderr).not.toContain("user:password");
  });

  it("allows Vercel to infer the auth URL", () => {
    expect(validate({ AUTH_URL: "" }).status).toBe(0);
  });
});
