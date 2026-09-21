import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

describe("Secret Exposure Prevention", () => {
  it(".env is listed in .gitignore", () => {
    const gitignore = readFileSync(join(process.cwd(), ".gitignore"), "utf-8");
    expect(gitignore).toContain(".env");
  });

  it(".env.local is listed in .gitignore", () => {
    const gitignore = readFileSync(join(process.cwd(), ".gitignore"), "utf-8");
    expect(gitignore).toContain(".env.local");
  });

  it(".env.production is listed in .gitignore", () => {
    const gitignore = readFileSync(join(process.cwd(), ".gitignore"), "utf-8");
    expect(gitignore).toContain(".env.production");
  });

  it("no NEXT_PUBLIC_ variable contains secret-sounding names in .env.example", () => {
    const envExample = readFileSync(join(process.cwd(), ".env.example"), "utf-8");
    const publicVars = envExample.match(/^NEXT_PUBLIC_\w+/gm) ?? [];
    const secretPatterns = /SECRET|PASSWORD|KEY|TOKEN|CREDENTIAL/i;
    for (const v of publicVars) {
      expect(v, `${v} looks like a secret exposed via NEXT_PUBLIC_`).not.toMatch(secretPatterns);
    }
  });

  it("R2 credentials are not prefixed with NEXT_PUBLIC_", () => {
    const envExample = readFileSync(join(process.cwd(), ".env.example"), "utf-8");
    expect(envExample).not.toMatch(/NEXT_PUBLIC_R2_/);
  });

  it("AUTH_SECRET is not prefixed with NEXT_PUBLIC_", () => {
    const envExample = readFileSync(join(process.cwd(), ".env.example"), "utf-8");
    expect(envExample).not.toMatch(/NEXT_PUBLIC_AUTH_SECRET/);
  });

  it("DATABASE_URL is not prefixed with NEXT_PUBLIC_", () => {
    const envExample = readFileSync(join(process.cwd(), ".env.example"), "utf-8");
    expect(envExample).not.toMatch(/NEXT_PUBLIC_DATABASE/);
  });

  it("source code does not contain hardcoded API keys", () => {
    const srcDir = join(process.cwd(), "src");
    const patterns = [
      /sk[-_](?:live|test|proj)[-_][a-zA-Z0-9]{20,}/,
      /AKIA[A-Z0-9]{16}/,
      /ghp_[a-zA-Z0-9]{36}/,
    ];

    const files = sourceFiles(srcDir);

    for (const file of files) {
      if (file.includes(".test.")) continue;
      const content = readFileSync(file, "utf-8");
      for (const pattern of patterns) {
        expect(content, `Potential secret in ${file}`).not.toMatch(pattern);
      }
    }
  });
});
