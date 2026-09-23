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

export function ProjectCarousel({ projects }: { projects: Project[] }) {
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
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label="Danh sách dự án tiêu biểu"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand lg:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <li
            key={project.id}
            className="shrink-0 snap-start basis-[85%] sm:basis-[calc((100%-1.25rem)/2)] lg:basis-[calc((100%-4.5rem)/4)]"
          >
            <article className="flex h-full flex-col overflow-hidden rounded-card border border-border-ui bg-white shadow-card">
              <div className="relative aspect-[16/10] bg-surface-hero">
                <Image
                  src={project.image}
                  alt={project.imageAlt ?? ""}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                {project.location || project.year ? (
                  <p className="mb-2 font-sans text-[12px] uppercase leading-4 tracking-[0.1em] text-brand">
                    {[project.location, project.year].filter(Boolean).join(" · ")}
                  </p>
                ) : null}

                <h3 className="font-heading text-[17px] font-semibold leading-6 tracking-[-0.01em] text-content-heading line-clamp-2">
                  {project.name}
                </h3>

                {project.summary ? (
                  <p className="mt-2 font-sans text-[13px] leading-5 text-content-body line-clamp-3">
                    {project.summary}
                  </p>
                ) : null}

                {project.scope.length > 0 ? (
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {project.scope.slice(0, 2).map((item) => (
                      <li
                        key={item}
                        className="rounded-pill border border-border-tag bg-surface-tag px-2.5 py-0.5 font-sans text-[11px] leading-4 text-brand-dark"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </ul>

      {hasArrows ? (
        <div className="mt-6 flex items-center justify-end gap-2">
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
    </>
  );
}
