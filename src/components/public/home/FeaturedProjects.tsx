import { ProjectCarousel } from "@/components/public/home/ProjectCarousel";
import type { Project } from "@/types/project";

function ProjectsHeader() {
  return (
    <div className="max-w-2xl">
      <p className="font-sans text-[16px] font-semibold uppercase leading-6 tracking-[0.1em] text-brand sm:text-[18px]">
        Công trình đã triển khai
      </p>
      <h2
        id="projects-heading"
        className="mt-3 font-heading text-[24px] font-semibold leading-[32px] tracking-[-0.01em] text-content-heading sm:text-[28px] sm:leading-[36px] lg:text-[32px] lg:leading-[40px]"
      >
        Dự án tiêu biểu
      </h2>
      <p className="mt-4 font-sans text-[15px] leading-6 text-content-body lg:text-[16px]">
        Một số hệ thống đã được Ánh Sáng Toàn Cầu khảo sát, lắp đặt và bàn giao.
      </p>
    </div>
  );
}

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section
      id="solutions"
      aria-labelledby="projects-heading"
      className="mx-auto max-w-content px-4 pb-12 pt-10 sm:px-6 lg:px-16 lg:pb-20 lg:pt-12"
    >
      {projects.length > 0 ? (
        <ProjectCarousel projects={projects} header={<ProjectsHeader />} />
      ) : (
        <>
          <div className="mb-8 lg:mb-12">
            <ProjectsHeader />
          </div>
          <p className="font-sans text-[14px] leading-6 text-content-muted">
            Dự án tiêu biểu đang được cập nhật.
          </p>
        </>
      )}
    </section>
  );
}
