import { describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests within the limit", async () => {
    const key = `test-allow-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const result = await checkRateLimit(key, 5, 60_000);
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks requests exceeding the limit", async () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      await checkRateLimit(key, 3, 60_000);
    }
    const result = await checkRateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.retryAfterMs).toBeGreaterThan(0);
      expect(result.retryAfterMs).toBeLessThanOrEqual(60_000);
    }
  });

  it("uses separate windows for different keys", async () => {
    const keyA = `test-sep-a-${Date.now()}`;
    const keyB = `test-sep-b-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      await checkRateLimit(keyA, 3, 60_000);
    }
    const resultA = await checkRateLimit(keyA, 3, 60_000);
    const resultB = await checkRateLimit(keyB, 3, 60_000);
    expect(resultA.allowed).toBe(false);
    expect(resultB.allowed).toBe(true);
  });
});
