import { beforeEach, describe, expect, it, vi } from "vitest";

// Public read paths must never surface unpublished content: knowing a slug was
// enough to read a draft, because the detail lookups filtered on slug alone.
// Administrative read paths must keep seeing drafts.

const { dbMock, calls } = vi.hoisted(() => {
  const calls: Array<{ target: string; args: Record<string, unknown> }> = [];

  const record = (target: string, result: unknown) =>
    vi.fn(async (args?: Record<string, unknown>) => {
      calls.push({ target, args: args ?? {} });
      return result;
    });

  return {
    calls,
    dbMock: {
      product: {
        findUnique: record("product.findUnique", null),
        findFirst: record("product.findFirst", null),
        findMany: record("product.findMany", []),
        count: record("product.count", 0),
      },
      newsArticle: {
        findUnique: record("newsArticle.findUnique", null),
        findFirst: record("newsArticle.findFirst", null),
        findMany: record("newsArticle.findMany", []),
        count: record("newsArticle.count", 0),
      },
    },
  };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));

import {
  getNewsArticleBySlug,
  getNewsArticles,
  getNewsArticlesByPage,
  listArticlesForAdmin,
} from "@/lib/api/news";
import {
  getProductBySlug,
  getProducts,
  getProductsByPage,
  listProductsForAdmin,
} from "@/lib/api/products";

type Where = { published?: unknown } & Record<string, unknown>;

function whereClauses(): Where[] {
  return calls.map(({ args }) => (args.where ?? {}) as Where);
}

beforeEach(() => {
  calls.length = 0;
});

describe("public read paths", () => {
  it("getProductBySlug only matches published products", async () => {
    await getProductBySlug("may-bom-fp500x");

    expect(calls).toHaveLength(1);
    expect(whereClauses()[0]).toMatchObject({ slug: "may-bom-fp500x", published: true });
  });

  it("getNewsArticleBySlug only matches published articles", async () => {
    await getNewsArticleBySlug("tin-noi-bat");

    expect(calls).toHaveLength(1);
    expect(whereClauses()[0]).toMatchObject({ slug: "tin-noi-bat", published: true });
  });

  it("getProducts only lists published products", async () => {
    await getProducts();

    expect(whereClauses().every((where) => where.published === true)).toBe(true);
  });

  it("getProductsByPage filters both the page and the total on published", async () => {
    await getProductsByPage(1);

    expect(calls.length).toBeGreaterThanOrEqual(2);
    expect(whereClauses().every((where) => where.published === true)).toBe(true);
  });

  it("getNewsArticles only lists published articles", async () => {
    await getNewsArticles();

    expect(whereClauses().every((where) => where.published === true)).toBe(true);
  });

  it("getNewsArticlesByPage filters both the page and the total on published", async () => {
    await getNewsArticlesByPage(1);

    expect(calls.length).toBeGreaterThanOrEqual(2);
    expect(whereClauses().every((where) => where.published === true)).toBe(true);
  });

  it("never uses a lookup that matches on slug alone", async () => {
    await getProductBySlug("bat-ky");
    await getNewsArticleBySlug("bat-ky");

    for (const where of whereClauses()) {
      expect(where.published).toBe(true);
    }
  });
});

describe("administrative read paths", () => {
  it("listProductsForAdmin returns drafts as well as published products", async () => {
    await listProductsForAdmin();

    for (const where of whereClauses()) {
      expect(where.published).toBeUndefined();
    }
  });

  it("listArticlesForAdmin returns drafts as well as published articles", async () => {
    await listArticlesForAdmin();

    for (const where of whereClauses()) {
      expect(where.published).toBeUndefined();
    }
  });
});
