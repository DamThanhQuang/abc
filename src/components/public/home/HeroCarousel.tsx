"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export type HeroSlide = {
  readonly src: string;
  readonly alt: string;
  /** Focal point của ảnh, mặc định lệch phải để không bị chữ che mất chủ thể. */
  readonly objectPositionClassName?: string;
};

type HeroCarouselProps = {
  readonly slides: readonly HeroSlide[];
  /** Thời gian dừng ở mỗi ảnh (ms). */
  readonly intervalMs?: number;
};

const DEFAULT_INTERVAL_MS = 2000;
const DEFAULT_OBJECT_POSITION = "object-[68%_center] lg:object-center";

function PreviousIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="m14.5 5-7 7 7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="m9.5 5 7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroCarousel({
  slides,
  intervalMs = DEFAULT_INTERVAL_MS,
}: HeroCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const slideCount = slides.length;

  const goToSlide = useCallback(
    (nextIndex: number) => {
      setSelectedIndex((nextIndex + slideCount) % slideCount);
    },
    [slideCount],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  // Timeout gắn với selectedIndex nên đồng hồ tự khởi động lại mỗi lần
  // người dùng bấm nút, tránh việc ảnh nhảy ngay sau thao tác thủ công.
  useEffect(() => {
    if (slideCount < 2 || isPaused || prefersReducedMotion) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setSelectedIndex((currentIndex) => (currentIndex + 1) % slideCount);
    }, intervalMs);

    return () => clearTimeout(timeoutId);
  }, [selectedIndex, slideCount, isPaused, prefersReducedMotion, intervalMs]);

  if (slideCount === 0) {
    return null;
  }

  return (
    <>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Hình ảnh giải pháp trạm xăng dầu"
        className="absolute inset-0"
      >
        {slides.map((slide, index) => {
          const isSelected = index === selectedIndex;

          return (
            <div
              key={slide.src}
              aria-hidden={!isSelected}
              className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${
                isSelected ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                {...(index === 0
                  ? { preload: true }
                  : { fetchPriority: "low" as const })}
                className={`object-cover ${
                  slide.objectPositionClassName ?? DEFAULT_OBJECT_POSITION
                }`}
              />
            </div>
          );
        })}
      </div>

      {slideCount > 1 ? (
        <div
          className="absolute bottom-6 right-6 z-20 flex items-center gap-2 sm:bottom-8 sm:right-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <button
            type="button"
            onClick={() => goToSlide(selectedIndex - 1)}
            aria-label="Xem ảnh trước"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#06264a]/70 text-white backdrop-blur-md transition-colors hover:bg-[#06264a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06264a] sm:h-11 sm:w-11"
          >
            <PreviousIcon />
          </button>

          <div className="flex items-center gap-1.5 px-1">
            {slides.map((slide, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Xem ảnh ${index + 1} / ${slideCount}`}
                  aria-current={isSelected}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06264a] ${
                    isSelected
                      ? "w-6 bg-green-400"
                      : "w-2 bg-white/45 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goToSlide(selectedIndex + 1)}
            aria-label="Xem ảnh tiếp theo"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-[#06264a]/70 text-white backdrop-blur-md transition-colors hover:bg-[#06264a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06264a] sm:h-11 sm:w-11"
          >
            <NextIcon />
          </button>
        </div>
      ) : null}
    </>
  );
}
