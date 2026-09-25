"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/types/project";

function PreviousIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="m14.5 5-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="m9.5 5 7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-border-ui bg-white text-content-heading transition-colors hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

// Cùng khuôn với NewsCard để hai khối trên trang chủ trông đồng nhất.
function ProjectCard({ project }: { project: Project }) {
  const hasFooter = Boolean(project.client) || project.scope.length > 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card">
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-surface-hero">
        <Image
          src={project.image}
          alt={project.imageAlt ?? ""}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        {project.location || project.year ? (
          <div className="mb-3 flex items-center justify-between gap-3">
            {project.location ? (
              <span className="whitespace-nowrap rounded-pill border border-border-tag bg-surface-tag px-[10px] py-[3px] font-sans text-[12px] leading-4 text-brand-dark">
                {project.location}
              </span>
            ) : (
              <span />
            )}
            {project.year ? (
              <span className="whitespace-nowrap font-sans text-[12px] leading-4 text-content-muted">
                Năm {project.year}
              </span>
            ) : null}
          </div>
        ) : null}

        <h3 className="mb-3 line-clamp-2 font-heading text-[18px] font-semibold leading-[26px] tracking-[-0.01em] text-content-heading">
          {project.name}
        </h3>

        <p className="mb-4 line-clamp-2 flex-1 font-sans text-[14px] leading-5 text-content-body">
          {project.summary}
        </p>

        {hasFooter ? (
          <div className="flex items-center justify-between gap-3 border-t border-border-ui pt-4">
            <span className="min-w-0 truncate font-sans text-[13px] leading-4 text-content-body">
              {project.client ? (
                <>
                  <span className="text-content-muted">Chủ đầu tư: </span>
                  {project.client}
                </>
              ) : null}
            </span>
            {project.scope.length > 0 ? (
              <span className="shrink-0 font-sans text-[12px] text-content-muted">
                {project.scope.length} hạng mục
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function ProjectCarousel({
  projects,
  header,
}: {
  projects: Project[];
  /** Tiêu đề khối; nút mũi tên được đặt cùng hàng bên phải, như "Xem tất cả" ở khối tin tức. */
  header: React.ReactNode;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  // Vị trí cuộn là nguồn sự thật duy nhất, nên số thẻ vừa một màn hình đổi theo
  // breakpoint mà không cần đo đạc trong JS.
  const syncArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollBack(track.scrollLeft > 1);
    setCanScrollForward(track.scrollLeft < maxScroll - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncArrows();
    track.addEventListener("scroll", syncArrows, { passive: true });

    const observer = new ResizeObserver(syncArrows);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", syncArrows);
      observer.disconnect();
    };
  }, [syncArrows]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  };

  const hasArrows = canScrollBack || canScrollForward;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
        {header}

        {hasArrows ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={!canScrollBack}
              aria-label="Xem các dự án trước"
              className={arrowClass}
            >
              <PreviousIcon />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={!canScrollForward}
              aria-label="Xem các dự án tiếp theo"
              className={arrowClass}
            >
              <NextIcon />
            </button>
          </div>
        ) : null}
      </div>

      {/* Chừa lề trên/dưới để bóng đổ của thẻ không bị vùng cuộn cắt mất. */}
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Danh sách dự án tiêu biểu"
        className="-my-2 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth py-2 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <li
            key={project.id}
            className="shrink-0 snap-start basis-[85%] sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]"
          >
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </>
  );
}
