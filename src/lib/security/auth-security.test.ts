import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("Authentication Security", () => {
  const authSource = readFileSync(join(process.cwd(), "src/lib/auth.ts"), "utf-8");
  const authGuardSource = readFileSync(join(process.cwd(), "src/lib/auth-guard.ts"), "utf-8");
  const proxySource = readFileSync(join(process.cwd(), "src/proxy.ts"), "utf-8");

  it("uses bcrypt for password comparison", () => {
    expect(authSource).toContain("compare");
    expect(authSource).toContain("bcryptjs");
  });

  it("uses JWT strategy", () => {
    expect(authSource).toContain('strategy: "jwt"');
  });

  it("session max age is 8 hours or less", () => {
    const match = authSource.match(/SESSION_MAX_AGE_SECONDS\s*=\s*(.+?);/);
    expect(match).not.toBeNull();
  });

  it("validates credentials with Zod schema", () => {
    expect(authSource).toContain("loginSchema.safeParse");
  });

  it("password minimum length is at least 10", () => {
    expect(authSource).toContain(".min(10)");
    expect(authSource).not.toMatch(/password.*\.min\([1-9]\)/);
  });

  it("auth guard verifies admin still exists in database", () => {
    expect(authGuardSource).toContain("db.admin.findUnique");
  });

  it("auth guard uses a single generic error message for all failure modes", () => {
    const errorStrings = authGuardSource.match(/error:\s*["'`]([^"'`]+)["'`]/g) ?? [];
    const messages = authGuardSource.match(/DENIED_MESSAGE/g) ?? [];
    expect(messages.length).toBeGreaterThan(0);
    expect(errorStrings).toHaveLength(0);
  });

  it("proxy redirects unauthenticated admin access", () => {
    expect(proxySource).toContain("/admin");
    expect(proxySource).toContain("/dang-nhap");
    expect(proxySource).toContain("isLoggedIn");
  });

  it("login route has rate limiting", () => {
    const authRoute = readFileSync(
      join(process.cwd(), "src/app/api/auth/[...nextauth]/route.ts"),
      "utf-8",
    );
    expect(authRoute).toContain("checkRateLimit");
    expect(authRoute).toContain("429");
  });
});
