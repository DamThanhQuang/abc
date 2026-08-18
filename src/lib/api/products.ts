import { db } from "@/lib/db";
import type { Product } from "@/types/product";

export const PRODUCTS_PER_PAGE = 3;

export type SortOption = "newest" | "oldest" | "name-az" | "name-za";

export type ProductQuery = {
  categorySlug?: string;
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
    where.categorySlug = query.categorySlug;
  }

  if (query.search?.trim()) {
    const q = query.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  return where;
}

const productInclude = {
  technicalSpecs: { orderBy: { order: "asc" as const } },
} as const;

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const products = await db.product.findMany({
    where: buildWhere(query),
    orderBy: buildOrderBy(query.sort),
    include: productInclude,
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await db.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  return product as unknown as Product | null;
}
