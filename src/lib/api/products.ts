import { db } from "@/lib/db";
import type { Product } from "@/types/product";

export const PRODUCTS_PER_PAGE = 6;

export type SortOption = "newest" | "oldest" | "name-az" | "name-za";

export type ProductQuery = {
  categorySlug?: string;
  categoryId?: string;
  search?: string;
  sort?: string;
};

function buildOrderBy(sort?: string) {
  switch (sort as SortOption) {
    case "oldest":
      return { createdAt: "asc" as const };
    case "name-az":
      return { name: "asc" as const };
    case "name-za":
      return { name: "desc" as const };
    default:
      return { createdAt: "desc" as const };
  }
}

function buildWhere(query: ProductQuery) {
  const where: Record<string, unknown> = { published: true };

  if (query.categorySlug) {
    where.category = { slug: query.categorySlug };
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.search?.trim()) {
    const q = query.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { category: { name: { contains: q, mode: "insensitive" } } },
      { model: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

const productInclude = {
  category: true,
  technicalSpecs: { orderBy: { order: "asc" as const } },
} as const;

// `limit` tồn tại để nơi gọi chỉ cần vài sản phẩm (ví dụ khối nổi bật ở trang
// chủ) không phải kéo toàn bộ bảng về rồi cắt bớt trong bộ nhớ.
export async function getProducts(
  query: ProductQuery = {},
  options: { limit?: number } = {},
): Promise<Product[]> {
  const products = await db.product.findMany({
    where: buildWhere(query),
    orderBy: buildOrderBy(query.sort),
    include: productInclude,
    ...(options.limit === undefined ? {} : { take: options.limit }),
  });
  return products as unknown as Product[];
}

export async function getProductsByPage(
  page: number,
  query: ProductQuery = {},
): Promise<{ products: Product[]; total: number; totalPages: number }> {
  const where = buildWhere(query);

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: buildOrderBy(query.sort),
      include: productInclude,
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));

  return {
    products: products as unknown as Product[],
    total,
    totalPages,
  };
}

// findFirst rather than findUnique: `published` is not part of a unique index,
// so it cannot be combined with the slug in a findUnique filter.
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await db.product.findFirst({
    where: { slug, published: true },
    include: productInclude,
  });
  return product as unknown as Product | null;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4,
): Promise<Product[]> {
  const products = await db.product.findMany({
    where: { published: true, categoryId, id: { not: productId } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: productInclude,
  });
  return products as unknown as Product[];
}

// ─── Admin ────────────────────────────────────────────────────────────────────
// Deliberately unfiltered: the admin list has to show drafts. Never call this
// from a public route.
export async function listProductsForAdmin(): Promise<Product[]> {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: productInclude,
  });
  return products as unknown as Product[];
}
