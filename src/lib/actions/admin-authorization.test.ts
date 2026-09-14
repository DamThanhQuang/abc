import { beforeEach, describe, expect, it, vi } from "vitest";

// Regression gate for the finding that every administrative Server Action was
// reachable without a session. Server Actions are public HTTP endpoints; the
// `proxy` matcher only guards navigation to /admin, so it cannot protect them.

const { authMock, dbMock, dbTouches } = vi.hoisted(() => {
  const dbTouches: string[] = [];
  const track = (label: string) =>
    vi.fn(async () => {
      dbTouches.push(label);
      return { id: "generated-id", slug: "generated-slug" };
    });

  return {
    authMock: vi.fn(),
    dbTouches,
    dbMock: {
      // The guard's own lookup is intentionally untracked, so that
      // `dbTouches` only ever reflects the mutation itself.
      admin: {
        findUnique: vi.fn(async () => ({ id: "admin-1", email: "admin@example.com" })),
      },
      product: {
        create: track("product.create"),
        update: track("product.update"),
        delete: track("product.delete"),
        count: track("product.count"),
        findUnique: track("product.findUnique"),
      },
      newsArticle: {
        create: track("newsArticle.create"),
        update: track("newsArticle.update"),
        delete: track("newsArticle.delete"),
      },
      category: {
        create: track("category.create"),
        update: track("category.update"),
        delete: track("category.delete"),
      },
      contactRequest: {
        create: track("contactRequest.create"),
        update: track("contactRequest.update"),
        delete: track("contactRequest.delete"),
      },
    },
  };
});

vi.mock("@/lib/auth", () => ({ auth: authMock }));
vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { createCategory, deleteCategory, updateCategory } from "@/lib/actions/categories";
import { deleteContact, submitContact, updateContactStatus } from "@/lib/actions/contacts";
import { createArticle, deleteArticle, updateArticle } from "@/lib/actions/news";
import { createProduct, deleteProduct, updateProduct } from "@/lib/actions/products";

const A_CUID = "clh3x4k5g0000qwer1234abcd";

// Payloads are deliberately valid: if authorization were missing, these would
// pass schema validation and reach the database.
const adminMutations = [
  [
    "createProduct",
    () =>
      createProduct({
        slug: "may-bom-test",
        name: "May bom test",
        categoryId: A_CUID,
        image: "/images/products/test.svg",
        features: [],
        published: true,
        technicalSpecs: [],
      }),
  ],
  ["updateProduct", () => updateProduct(A_CUID, { name: "Ten moi" })],
  ["deleteProduct", () => deleteProduct(A_CUID)],
  [
    "createArticle",
    () =>
      createArticle({
        slug: "tin-test",
        title: "Tin test",
        excerpt: "Mo ta ngan cho bai viet test",
        image: "/images/news/test.svg",
        category: "Tin cong ty",
        published: true,
      }),
  ],
  ["updateArticle", () => updateArticle(A_CUID, { title: "Tieu de moi" })],
  ["deleteArticle", () => deleteArticle(A_CUID)],
  [
    "createCategory",
    () => createCategory({ slug: "danh-muc-test", name: "Danh muc test", order: 0 }),
  ],
  ["updateCategory", () => updateCategory(A_CUID, { name: "Ten moi" })],
  ["deleteCategory", () => deleteCategory(A_CUID)],
  ["updateContactStatus", () => updateContactStatus(A_CUID, "RESOLVED")],
  ["deleteContact", () => deleteContact(A_CUID)],
] as const;

describe("administrative mutations without a session", () => {
  beforeEach(() => {
    dbTouches.length = 0;
    authMock.mockReset();
    authMock.mockResolvedValue(null);
  });

  it.each(adminMutations)("%s is refused and never reaches the database", async (_name, invoke) => {
    const result = await invoke();

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(dbTouches).toEqual([]);
  });
});

describe("administrative mutations with a valid admin session", () => {
  beforeEach(() => {
    dbTouches.length = 0;
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: "admin-1", email: "admin@example.com" } });
  });

  it.each(adminMutations)("%s is allowed through to the database", async (_name, invoke) => {
    const result = await invoke();

    expect(result.success).toBe(true);
    expect(dbTouches.length).toBeGreaterThan(0);
  });
});

describe("the public contact form", () => {
  beforeEach(() => {
    dbTouches.length = 0;
    authMock.mockReset();
    authMock.mockResolvedValue(null);
  });

  it("still accepts submissions from anonymous visitors", async () => {
    const result = await submitContact({
      name: "Nguyen Van A",
      email: "khach@example.com",
      subject: "Bao gia",
      message: "Toi muon nhan bao gia cho may bom cong nghiep.",
    });

    expect(result.success).toBe(true);
    expect(dbTouches).toContain("contactRequest.create");
  });
});
