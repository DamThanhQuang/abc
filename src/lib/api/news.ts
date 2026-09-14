import { db } from "@/lib/db";
import type { NewsArticle } from "@/types/news";

export const NEWS_PER_PAGE = 4;

export async function getNewsArticles(): Promise<NewsArticle[]> {
  const articles = await db.newsArticle.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return articles as unknown as NewsArticle[];
}

export async function getNewsArticlesByPage(
  page: number,
): Promise<{ articles: NewsArticle[]; total: number; totalPages: number }> {
  const where = { published: true };

  const [articles, total] = await Promise.all([
    db.newsArticle.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * NEWS_PER_PAGE,
      take: NEWS_PER_PAGE,
    }),
    db.newsArticle.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / NEWS_PER_PAGE));

  return {
    articles: articles as unknown as NewsArticle[],
    total,
    totalPages,
  };
}

// findFirst rather than findUnique: `published` is not part of a unique index,
// so it cannot be combined with the slug in a findUnique filter.
export async function getNewsArticleBySlug(slug: string): Promise<NewsArticle | null> {
  const article = await db.newsArticle.findFirst({
    where: { slug, published: true },
  });
  return article as unknown as NewsArticle | null;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
// Deliberately unfiltered: the admin list has to show drafts. Never call this
// from a public route.
export async function listArticlesForAdmin(): Promise<NewsArticle[]> {
  const articles = await db.newsArticle.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return articles as unknown as NewsArticle[];
}
