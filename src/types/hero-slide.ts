import type { HeroSlideFocus } from "@/lib/validations";

export type HeroSlide = {
  id: string;
  image: string;
  imageAlt: string;
  blurDataUrl: string | null;
  focus: HeroSlideFocus;
  sortOrder: number;
  published: boolean;
};
