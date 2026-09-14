export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  imageAlt?: string;
  category: string;
  publishedAt: string; // ISO date "YYYY-MM-DD"
  readingTime?: number; // minutes
  published: boolean;
};
