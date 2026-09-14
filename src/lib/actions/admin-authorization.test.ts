import { beforeEach, describe, expect, it, vi } from "vitest";

// Regression gate for the finding that every administrative Server Action was
// reachable without a session. Server Actions are public HTTP endpoints; the
// `proxy` matcher only guards navigation to /admin, so it cannot protect them.

const { authMock, dbMock, dbTouches, productCountMock } = vi.hoisted(() => {
  const dbTouches: string[] = [];

  const track = <T,>(label: string, result: T) =>
    vi.fn(async () => {
      dbTouches.push(label);
      return result;
    });

  const written = { id: "generated-id", slug: "generated-slug" };

  // Its own mock because the return type matters: deleteCategory compares the
  // count against 0, and an object would silently coerce to NaN.
  const productCountMock = track("product.count", 0);

  return {
    authMock: vi.fn(),
    dbTouches,
    productCountMock,
    dbMock: {
      // The guard's own lookup is intentionally untracked, so that
      // `dbTouches` only ever reflects the mutation itself.
      admin: {
        findUnique: vi.fn(async () => ({ id: "admin-1", email: "admin@example.com" })),
      },
      product: {
        create: track("product.create", written),
        update: track("product.update", written),
        delete: track("product.delete", written),
        count: productCountMock,
        findUnique: track("product.findUnique", written),
      },
      newsArticle: {
        create: track("newsArticle.create", written),
        update: track("newsArticle.update", written),
        delete: track("newsArticle.delete", written),
      },
      category: {
        create: track("category.create", written),
        update: track("category.update", written),
        delete: track("category.delete", written),
      },
      contactRequest: {
        create: track("contactRequest.create", written),
        update: track("contactRequest.update", written),
        delete: track("contactRequest.delete", written),
      },
    },
  };
});

vi.mock("@/lib/auth", () => ({ auth: authMock }));
vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import * as categoryActions from "@/lib/actions/categories";
import * as contactActions from "@/lib/actions/contacts";
import * as newsActions from "@/lib/actions/news";
import * as productActions from "@/lib/actions/products";

import { createCategory, deleteCategory, updateCategory } from "@/lib/actions/categories";
import { deleteContact, submitContact, updateContactStatus } from "@/lib/actions/contacts";
import { createArticle, deleteArticle, updateArticle } from "@/lib/actions/news";
import { createProduct, deleteProduct, updateProduct } from "@/lib/actions/products";

const A_CUID = "clh3x4k5g0000qwer1234abcd";

// Payloads are deliberately valid: if authorization were missing, these would
// pass schema validation and reach the database. The third element is the write
// each mutation must perform when it is allowed through.
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
    "product.create",
  ],
  ["updateProduct", () => updateProduct(A_CUID, { name: "Ten moi" }), "product.update"],
  ["deleteProduct", () => deleteProduct(A_CUID), "product.delete"],
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
    "newsArticle.create",
  ],
  ["updateArticle", () => updateArticle(A_CUID, { title: "Tieu de moi" }), "newsArticle.update"],
  ["deleteArticle", () => deleteArticle(A_CUID), "newsArticle.delete"],
  [
    "createCategory",
    () => createCategory({ slug: "danh-muc-test", name: "Danh muc test", order: 0 }),
    "category.create",
  ],
  ["updateCategory", () => updateCategory(A_CUID, { name: "Ten moi" }), "category.update"],
  ["deleteCategory", () => deleteCategory(A_CUID), "category.delete"],
  ["updateContactStatus", () => updateContactStatus(A_CUID, "RESOLVED"), "contactRequest.update"],
  ["deleteContact", () => deleteContact(A_CUID), "contactRequest.delete"],
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

  it.each(adminMutations)(
    "%s is allowed through and performs its write",
    async (_name, invoke, expectedWrite) => {
      const result = await invoke();

      expect(result.success).toBe(true);
      expect(dbTouches).toContain(expectedWrite);
    },
  );
});

describe("deleteCategory when the category still holds products", () => {
  beforeEach(() => {
    dbTouches.length = 0;
    authMock.mockReset();
    authMock.mockResolvedValue({ user: { id: "admin-1", email: "admin@example.com" } });
  });

  it("refuses and leaves the category in place", async () => {
    productCountMock.mockResolvedValueOnce(3);

    const result = await deleteCategory(A_CUID);

    expect(result.success).toBe(false);
    expect(dbTouches).not.toContain("category.delete");
  });
});

// The suites above name each action explicitly, which would not notice a new
// ungated action added later. This one discovers exports at runtime, so any
// action added to these modules is covered the moment it exists.
const PUBLIC_BY_DESIGN = new Set(["submitContact"]);

const discoveredActions = (
  [
    ["categories", categoryActions],
    ["contacts", contactActions],
    ["news", newsActions],
    ["products", productActions],
  ] as const
)
  .flatMap(([moduleName, mod]) =>
    Object.entries(mod)
      .filter(([, value]) => typeof value === "function")
      .map(([name, fn]) => [`${moduleName}.${name}`, name, fn] as const),
  )
  .filter(([, name]) => !PUBLIC_BY_DESIGN.has(name));

describe("every exported administrative action, discovered at runtime", () => {
  beforeEach(() => {
    dbTouches.length = 0;
    authMock.mockReset();
    authMock.mockResolvedValue(null);
  });

  it("finds the actions it expects to guard", () => {
    expect(discoveredActions).toHaveLength(adminMutations.length);
  });

  it.each(discoveredActions)("%s refuses an anonymous caller", async (_label, _name, action) => {
    const invoke = action as (...args: unknown[]) => Promise<{ success: boolean }>;

    const result = await invoke(A_CUID, {});

    // The arguments are deliberately bogus, so `success: false` alone would
    // also be satisfied by schema validation. Asserting that the session was
    // consulted is what proves the guard itself ran.
    expect(authMock).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(dbTouches).toEqual([]);
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
