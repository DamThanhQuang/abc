import type { Category } from "@/types/category";

export const CATEGORIES: Category[] = [
  { id: "1", slug: "may-bom",                name: "Máy bơm" },
  { id: "2", slug: "dong-ho-do-luu-luong",   name: "Đồng hồ đo lưu lượng" },
  { id: "3", slug: "he-thong-bon-chua",       name: "Hệ thống bồn chứa" },
  { id: "4", slug: "voi-bom-tu-dong",         name: "Vòi bơm tự động" },
];

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
