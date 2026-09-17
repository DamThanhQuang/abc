import { beforeEach, describe, expect, it, vi } from "vitest";

const { authMock, findAdminMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  findAdminMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: authMock }));
vi.mock("@/lib/db", () => ({
  db: {
    admin: { findUnique: findAdminMock },
    product: { update: vi.fn(), delete: vi.fn(), count: vi.fn() },
    category: { update: vi.fn(), delete: vi.fn() },
    newsArticle: { update: vi.fn(), delete: vi.fn() },
    contactRequest: { delete: vi.fn() },
  },
}));

import { updateProduct, deleteProduct } from "@/lib/actions/products";
import { updateCategory, deleteCategory } from "@/lib/actions/categories";
import { updateArticle, deleteArticle } from "@/lib/actions/news";
import { deleteContact } from "@/lib/actions/contacts";

const ADMIN = { id: "clxxxxxxxxxxxxxxxxxxxxxxx", email: "admin@test.com" };

describe("ID validation on mutation actions", () => {
  beforeEach(() => {
    authMock.mockResolvedValue({ user: ADMIN });
    findAdminMock.mockResolvedValue(ADMIN);
  });

  const INVALID_IDS = [
    "not-a-cuid",
    "123",
    "../../../etc/passwd",
    "'; DROP TABLE Product;--",
    "",
    " ",
  ];

  for (const badId of INVALID_IDS) {
    it(`updateProduct rejects invalid ID: "${badId}"`, async () => {
      const result = await updateProduct(badId, { name: "test" });
      expect(result.success).toBe(false);
      expect(result.error).toContain("ID");
    });

    it(`deleteProduct rejects invalid ID: "${badId}"`, async () => {
      const result = await deleteProduct(badId);
      expect(result.success).toBe(false);
      expect(result.error).toContain("ID");
    });

    it(`updateCategory rejects invalid ID: "${badId}"`, async () => {
      const result = await updateCategory(badId, { name: "test" });
      expect(result.success).toBe(false);
      expect(result.error).toContain("ID");
    });

    it(`deleteCategory rejects invalid ID: "${badId}"`, async () => {
      const result = await deleteCategory(badId);
      expect(result.success).toBe(false);
      expect(result.error).toContain("ID");
    });

    it(`updateArticle rejects invalid ID: "${badId}"`, async () => {
      const result = await updateArticle(badId, { title: "test" });
      expect(result.success).toBe(false);
      expect(result.error).toContain("ID");
    });

    it(`deleteArticle rejects invalid ID: "${badId}"`, async () => {
      const result = await deleteArticle(badId);
      expect(result.success).toBe(false);
      expect(result.error).toContain("ID");
    });

    it(`deleteContact rejects invalid ID: "${badId}"`, async () => {
      const result = await deleteContact(badId);
      expect(result.success).toBe(false);
      expect(result.error).toContain("ID");
    });
  }
});
