import { ProjectCarousel } from "@/components/public/home/ProjectCarousel";
import type { Project } from "@/types/project";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    // id="solutions" là đích của nút "Khám phá giải pháp" ở hero; đừng đổi.
    <section
      id="solutions"
      aria-labelledby="projects-heading"
      className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-12 lg:py-20"
    >
      <div className="mb-8 lg:mb-12">
        <h2
          id="projects-heading"
          className="
            font-heading font-semibold
            text-[24px] sm:text-[28px] lg:text-[32px]
            leading-[32px] sm:leading-[36px] lg:leading-[40px]
            tracking-[-0.01em] text-content-heading
          "
        >
          Dự Án Tiêu Biểu
        </h2>
        <p className="mt-2 font-sans text-[14px] lg:text-[16px] leading-6 text-content-muted">
          Một số hệ thống đã được Ánh Sáng Toàn Cầu khảo sát, lắp đặt và bàn giao.
        </p>
      </div>

      {projects.length > 0 ? (
        <ProjectCarousel projects={projects} />
      ) : (
        <p className="font-sans text-[14px] leading-6 text-content-muted">
          Dự án tiêu biểu đang được cập nhật.
        </p>
      )}
    </section>
  );
}
