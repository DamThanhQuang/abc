import { db } from "@/lib/db";
import type { Category } from "@/types/category";

export type CategoryWithProductCount = Category & {
  readonly productCount: number;
};

export async function getCategories(): Promise<Category[]> {
  const categories = await db.category.findMany({
    orderBy: { order: "asc" },
  });
  return categories as Category[];
}

// Đếm theo đúng bộ lọc mà /san-pham dùng (published: true), để con số hiển thị
// khớp với danh sách người dùng thấy sau khi bấm vào danh mục.
export async function getCategoriesWithProductCount(): Promise<
  CategoryWithProductCount[]
> {
  const categories = await db.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { products: { where: { published: true } } } },
    },
  });

  return categories.map(({ _count, ...category }) => ({
    ...(category as Category),
    productCount: _count.products,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const category = await db.category.findUnique({ where: { slug } });
  return category as Category | null;
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const category = await db.category.findUnique({ where: { id } });
  return category as Category | null;
}
