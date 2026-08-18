import { db } from "@/lib/db";
import type { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const categories = await db.category.findMany({
    orderBy: { order: "asc" },
  });
  return categories as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await db.category.findUnique({ where: { slug } });
  return category as Category | null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const category = await db.category.findUnique({ where: { id } });
  return category as Category | null;
}
