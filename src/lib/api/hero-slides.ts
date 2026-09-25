import { db } from "@/lib/db";
import { FALLBACK_HERO_SLIDES, type HeroSlideView } from "@/lib/hero-slides";
import type { HeroSlide } from "@/types/hero-slide";

const SLIDE_ORDER = [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }];

export async function getHeroSlides(): Promise<readonly HeroSlideView[]> {
  const slides = await db.heroSlide.findMany({
    where: { published: true },
    orderBy: SLIDE_ORDER,
  });
  if (slides.length === 0) return FALLBACK_HERO_SLIDES;

  return slides.map((slide) => ({
    src: slide.image,
    alt: slide.imageAlt,
    blurDataUrl: slide.blurDataUrl,
    focus: slide.focus as HeroSlide["focus"],
  }));
}

export async function getHeroSlideById(id: string): Promise<HeroSlide | null> {
  const slide = await db.heroSlide.findUnique({ where: { id } });
  return slide as HeroSlide | null;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
// Cố ý không lọc published: trang quản trị phải thấy cả slide đang ẩn. Không gọi
// hàm này từ route công khai.
export async function listHeroSlidesForAdmin(): Promise<HeroSlide[]> {
  const slides = await db.heroSlide.findMany({ orderBy: SLIDE_ORDER });
  return slides as HeroSlide[];
}
