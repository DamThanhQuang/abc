import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const configPath = join(process.cwd(), "next.config.ts");
const configContent = readFileSync(configPath, "utf-8");

describe("Security Headers Configuration", () => {
  it("configures Strict-Transport-Security", () => {
    expect(configContent).toContain("Strict-Transport-Security");
    expect(configContent).toContain("max-age=31536000");
    expect(configContent).toContain("includeSubDomains");
  });

  it("configures X-Content-Type-Options", () => {
    expect(configContent).toContain("X-Content-Type-Options");
    expect(configContent).toContain("nosniff");
  });

  it("configures X-Frame-Options to DENY", () => {
    expect(configContent).toContain("X-Frame-Options");
    expect(configContent).toContain("DENY");
  });

  it("configures Referrer-Policy", () => {
    expect(configContent).toContain("Referrer-Policy");
    expect(configContent).toContain("strict-origin-when-cross-origin");
  });

  it("configures Permissions-Policy", () => {
    expect(configContent).toContain("Permissions-Policy");
    expect(configContent).toContain("camera=()");
    expect(configContent).toContain("microphone=()");
  });

  it("configures Content-Security-Policy", () => {
    expect(configContent).toContain("Content-Security-Policy");
    expect(configContent).toContain("default-src 'self'");
    expect(configContent).toContain("frame-ancestors 'none'");
    expect(configContent).toContain("base-uri 'self'");
    expect(configContent).toContain("form-action 'self'");
  });

  it("CSP does not include unsafe-eval", () => {
    expect(configContent).not.toContain("unsafe-eval");
  });
});
