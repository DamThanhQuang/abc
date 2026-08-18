import { db } from "@/lib/db";
import type { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const products = await db.product.findMany({
    where: { published: true },
    select: { category: true, categorySlug: true },
    distinct: ["categorySlug"],
    orderBy: { category: "asc" },
  });

  return products.map((p, i) => ({
    id: String(i + 1),
    slug: p.categorySlug,
    name: p.category,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}
