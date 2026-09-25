import { HeroSection }       from "@/components/public/home/HeroSection";
import { ProductLineup }     from "@/components/public/home/ProductLineup";
import { FeaturedProjects }  from "@/components/public/home/FeaturedProjects";
import { FeaturesGrid }      from "@/components/public/home/FeaturesGrid";
import { LatestNews }        from "@/components/public/home/LatestNews";
import { ContactCta }        from "@/components/public/home/ContactCta";
import { getProjects }       from "@/lib/api/projects";
import { getLatestNewsArticles } from "@/lib/api/news";

// Trang chủ hiển thị 4 dự án mới nhất mỗi lượt; phần còn lại xem bằng nút mũi
// tên, nên vẫn nạp sẵn vài trang thay vì toàn bộ bảng.
const FEATURED_PROJECT_LIMIT = 12;
const LATEST_NEWS_LIMIT = 3;

export default async function HomePage() {
  const [projects, latestNews] = await Promise.all([
    getProjects({ limit: FEATURED_PROJECT_LIMIT }),
    getLatestNewsArticles(LATEST_NEWS_LIMIT),
  ]);

  return (
    <>
      {/* 1 — Hero */}
      <HeroSection />

      {/* 2 — Product lineup */}
      <ProductLineup />

      {/* 3 — Featured Projects */}
      <FeaturedProjects projects={projects} />

      {/* 4 — Features bento grid */}
      <FeaturesGrid />

      {/* 5 — Latest news */}
      <LatestNews articles={latestNews} />

      {/* 6 — Contact call to action */}
      <ContactCta />
    </>
  );
}
