import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe("R2 Security", () => {
  const r2Source = readFileSync(join(process.cwd(), "src/lib/r2.ts"), "utf-8");
  const envExample = readFileSync(join(process.cwd(), ".env.example"), "utf-8");

  it("R2 credentials are read from environment variables", () => {
    expect(r2Source).toContain("process.env");
    expect(r2Source).toContain("R2_ACCOUNT_ID");
    expect(r2Source).toContain("R2_ACCESS_KEY_ID");
    expect(r2Source).toContain("R2_SECRET_ACCESS_KEY");
  });

  it("R2 credentials are not hardcoded", () => {
    expect(r2Source).not.toMatch(/accessKeyId:\s*["'][^"']+["']/);
    expect(r2Source).not.toMatch(/secretAccessKey:\s*["'][^"']+["']/);
  });

  it("R2 credentials are server-only in .env.example", () => {
    expect(envExample).toContain("R2_ACCOUNT_ID");
    expect(envExample).toContain("R2_ACCESS_KEY_ID");
    expect(envExample).toContain("R2_SECRET_ACCESS_KEY");
    expect(envExample).not.toContain("NEXT_PUBLIC_R2");
  });

  it("upload route requires authentication", () => {
    const uploadRoute = readFileSync(
      join(process.cwd(), "src/app/api/upload/route.ts"),
      "utf-8",
    );
    expect(uploadRoute).toContain("requireAdmin");
  });

  it("upload route validates image content with magic bytes", () => {
    const uploadRoute = readFileSync(
      join(process.cwd(), "src/app/api/upload/route.ts"),
      "utf-8",
    );
    expect(uploadRoute).toContain("detectImageFormat");
  });

  it("upload route has rate limiting", () => {
    const uploadRoute = readFileSync(
      join(process.cwd(), "src/app/api/upload/route.ts"),
      "utf-8",
    );
    expect(uploadRoute).toContain("checkRateLimit");
  });

  it("upload route sets immutable cache headers on R2 objects", () => {
    expect(r2Source).toContain("immutable");
    expect(r2Source).toContain("CacheControl");
  });
});
