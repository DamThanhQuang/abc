import { describe, it, expect } from "vitest";
import { parseProductImages, normalizeProductImages } from "./product-images";

describe("parseProductImages", () => {
  it("parses JSON array of 3 image URLs (multi-upload case)", () => {
    const json = JSON.stringify(["/uploads/a.webp", "/uploads/b.webp", "/uploads/c.webp"]);
    const result = parseProductImages(json);
    expect(result).toEqual(["/uploads/a.webp", "/uploads/b.webp", "/uploads/c.webp"]);
  });

  it("deduplicates identical URLs", () => {
    const json = JSON.stringify(["/uploads/a.webp", "/uploads/a.webp", "/uploads/b.webp"]);
    expect(parseProductImages(json)).toEqual(["/uploads/a.webp", "/uploads/b.webp"]);
  });

  it("caps at 10 images", () => {
    const urls = Array.from({ length: 15 }, (_, i) => `/uploads/${i}.webp`);
    expect(parseProductImages(JSON.stringify(urls))).toHaveLength(10);
  });

  it("returns empty array for invalid JSON", () => {
    expect(parseProductImages("not-json")).toEqual([]);
    expect(parseProductImages(null)).toEqual([]);
  });

  it("strips empty strings and whitespace-only entries", () => {
    const json = JSON.stringify(["/uploads/a.webp", "", "  ", "/uploads/b.webp"]);
    expect(parseProductImages(json)).toEqual(["/uploads/a.webp", "/uploads/b.webp"]);
  });
});

describe("normalizeProductImages", () => {
  it("merges images array with fallback, deduplicating", () => {
    const result = normalizeProductImages(["/uploads/a.webp"], "/uploads/a.webp");
    expect(result).toEqual(["/uploads/a.webp"]);
  });

  it("appends fallback when not already present", () => {
    const result = normalizeProductImages(["/uploads/a.webp"], "/uploads/b.webp");
    expect(result).toEqual(["/uploads/a.webp", "/uploads/b.webp"]);
  });

  it("returns empty array for non-array input with no fallback", () => {
    expect(normalizeProductImages(null)).toEqual([]);
    expect(normalizeProductImages("string")).toEqual([]);
  });
});
