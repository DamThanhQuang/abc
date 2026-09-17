import { describe, expect, it } from "vitest";
import { contactSchema, productSchema, newsSchema, idSchema } from "@/lib/validations";

describe("Input Validation Security", () => {
  describe("contactSchema", () => {
    it("rejects empty name", () => {
      const result = contactSchema.safeParse({
        name: "",
        email: "test@test.com",
        subject: "Test",
        message: "This is a test message",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = contactSchema.safeParse({
        name: "Test",
        email: "not-an-email",
        subject: "Test",
        message: "This is a test message",
      });
      expect(result.success).toBe(false);
    });

    it("rejects message exceeding max length", () => {
      const result = contactSchema.safeParse({
        name: "Test",
        email: "test@test.com",
        subject: "Test",
        message: "x".repeat(2001),
      });
      expect(result.success).toBe(false);
    });

    it("rejects message below min length", () => {
      const result = contactSchema.safeParse({
        name: "Test",
        email: "test@test.com",
        subject: "Test",
        message: "short",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("productSchema", () => {
    it("rejects slug exceeding max length", () => {
      const result = productSchema.safeParse({
        slug: "a".repeat(101),
        name: "Test",
        categoryId: "test",
        image: "/test.webp",
      });
      expect(result.success).toBe(false);
    });

    it("rejects more than 10 images", () => {
      const result = productSchema.safeParse({
        slug: "test",
        name: "Test",
        categoryId: "test",
        image: "/test.webp",
        images: Array(11).fill("/test.webp"),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("newsSchema", () => {
    it("rejects title exceeding max length", () => {
      const result = newsSchema.safeParse({
        slug: "test",
        title: "a".repeat(301),
        excerpt: "test",
        image: "/test.webp",
        category: "test",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("idSchema", () => {
    it("accepts valid CUID", () => {
      expect(idSchema.safeParse("clxxxxxxxxxxxxxxxxxxxxxxx").success).toBe(true);
    });

    it("rejects empty string", () => {
      expect(idSchema.safeParse("").success).toBe(false);
    });

    it("rejects SQL injection attempt", () => {
      expect(idSchema.safeParse("'; DROP TABLE Product;--").success).toBe(false);
    });

    it("rejects path traversal", () => {
      expect(idSchema.safeParse("../../../etc/passwd").success).toBe(false);
    });

    it("rejects numeric ID", () => {
      expect(idSchema.safeParse("123").success).toBe(false);
    });
  });
});
