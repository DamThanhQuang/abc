import { HeroSection }       from "@/components/public/home/HeroSection";
import { ProductLineup }     from "@/components/public/home/ProductLineup";
import { FeaturedProjects }  from "@/components/public/home/FeaturedProjects";
import { FeaturesGrid }      from "@/components/public/home/FeaturesGrid";
import { getProjects }       from "@/lib/api/projects";

// Trang chủ hiển thị 4 dự án mới nhất mỗi lượt; phần còn lại xem bằng nút mũi
// tên, nên vẫn nạp sẵn vài trang thay vì toàn bộ bảng.
const FEATURED_PROJECT_LIMIT = 12;

export default async function HomePage() {
  const projects = await getProjects({ limit: FEATURED_PROJECT_LIMIT });

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
    </>
  );
}
