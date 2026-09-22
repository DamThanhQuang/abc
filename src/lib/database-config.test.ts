import { afterEach, describe, expect, it, vi } from "vitest";
import { databaseConnectionConfig } from "./database-config.mjs";

afterEach(() => vi.unstubAllEnvs());

describe("database TLS configuration", () => {
  it("preserves the connection URL when no custom CA is supplied", () => {
    vi.stubEnv("DATABASE_SSL_CA", "");
    const url = "postgresql://user:password@localhost:5432/postgres";
    expect(databaseConnectionConfig(url)).toEqual({ connectionString: url });
  });

  it("keeps the CA and certificate verification despite SSL query parameters", () => {
    vi.stubEnv("DATABASE_SSL_CA", "-----BEGIN CERTIFICATE-----\\ntest\\n-----END CERTIFICATE-----");
    const result = databaseConnectionConfig("postgresql://user:password@db.example.com:6543/postgres?sslmode=verify-full&sslrootcert=old.crt&pgbouncer=true");
    expect(result.ssl).toEqual({ ca: "-----BEGIN CERTIFICATE-----\ntest\n-----END CERTIFICATE-----", rejectUnauthorized: true });
    const url = new URL(result.connectionString!);
    expect(url.searchParams.has("sslmode")).toBe(false);
    expect(url.searchParams.has("sslrootcert")).toBe(false);
    expect(url.searchParams.get("pgbouncer")).toBe("true");
    expect(url.hostname).toBe("db.example.com");
  });

  it("fails on an invalid CA instead of disabling certificate verification", () => {
    vi.stubEnv("DATABASE_SSL_CA", "not a certificate");
    expect(() => databaseConnectionConfig("postgresql://localhost/postgres")).toThrow("PEM");
  });
});
