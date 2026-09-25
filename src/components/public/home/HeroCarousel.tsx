"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroFocusClassName, type HeroSlideView } from "@/lib/hero-slides";

type HeroCarouselProps = {
  readonly slides: readonly HeroSlideView[];
  /** Thời gian dừng ở mỗi ảnh (ms). */
  readonly intervalMs?: number;
};

const DEFAULT_INTERVAL_MS = 6000;
const FADE_MS = 1200;
// Mức phóng to cuối của hiệu ứng zoom chậm; nhỏ để ảnh không mất nét hay mất
// chủ thể ở mép khung.
const ZOOM_SCALE = 1.08;
// Banner phủ toàn màn hình nên cần chất lượng cao hơn mức 75 mặc định; phải nằm
// trong images.qualities của next.config.ts.
const HERO_IMAGE_QUALITY = 90;

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

function pad(value: number) {
  return String(value).padStart(2, "0");
}

const controlButtonClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06264a] sm:h-11 sm:w-11";

export function HeroCarousel({
  slides,
  intervalMs = DEFAULT_INTERVAL_MS,
}: HeroCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const zoomLayers = useRef<Array<HTMLDivElement | null>>([]);
  const zoomAnimation = useRef<Animation | null>(null);
  const isPausedRef = useRef(isPaused);

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

  // Zoom chậm cho ảnh đang hiện. Ảnh vừa rời đi giữ nguyên độ zoom trong lúc mờ
  // dần (fill: forwards) thay vì giật về cỡ gốc; nó chỉ được đặt lại khi được
  // chọn lần sau.
  useEffect(() => {
    if (prefersReducedMotion) return;
    const layer = zoomLayers.current[selectedIndex];
    if (!layer) return;

    layer.getAnimations().forEach((animation) => animation.cancel());
    const animation = layer.animate(
      [{ transform: "scale(1)" }, { transform: `scale(${ZOOM_SCALE})` }],
      { duration: intervalMs + FADE_MS, easing: "linear", fill: "forwards" },
    );
    if (isPausedRef.current) animation.pause();
    zoomAnimation.current = animation;
  }, [selectedIndex, intervalMs, prefersReducedMotion]);

  useEffect(() => {
    isPausedRef.current = isPaused;
    const animation = zoomAnimation.current;
    if (!animation) return;
    if (isPaused) animation.pause();
    else if (animation.playState === "paused") animation.play();
  }, [isPaused]);

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
              key={index}
              aria-hidden={!isSelected}
              style={{ transitionDuration: `${FADE_MS}ms` }}
              className={`absolute inset-0 overflow-hidden transition-opacity ease-in-out motion-reduce:transition-none ${
                isSelected ? "opacity-100" : "opacity-0"
              }`}
            >
              <div
                ref={(element) => {
                  zoomLayers.current[index] = element;
                }}
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  quality={HERO_IMAGE_QUALITY}
                  {...(slide.blurDataUrl
                    ? { placeholder: "blur" as const, blurDataURL: slide.blurDataUrl }
                    : {})}
                  {...(index === 0
                    ? { preload: true }
                    : { fetchPriority: "low" as const })}
                  className={`object-cover ${heroFocusClassName(slide.focus)}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {slideCount > 1 ? (
        <div
          // Chừa chỗ cho cụm nút liên hệ nổi (fixed, right-6) để không đè lên nhau
          // khi đáy banner trùng đáy màn hình.
          className="absolute bottom-6 right-6 z-20 flex items-center gap-3 sm:bottom-8 sm:right-28 sm:gap-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <p aria-hidden="true" className="flex items-baseline gap-1 font-semibold tabular-nums text-white">
            <span className="text-lg sm:text-xl">{pad(selectedIndex + 1)}</span>
            <span className="text-sm text-white/50">/ {pad(slideCount)}</span>
          </p>

          <div className="flex items-center">
            {slides.map((_, index) => {
              const isSelected = index === selectedIndex;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToSlide(index)}
                  aria-label={`Xem ảnh ${index + 1} / ${slideCount}`}
                  aria-current={isSelected}
                  className="group flex h-8 w-7 items-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 rounded-sm sm:w-12"
                >
                  <span className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/30 transition-colors group-hover:bg-white/55">
                    {isSelected ? (
                      // Mount lại mỗi lần đổi ảnh nên thanh luôn chạy từ đầu; hết
                      // thanh thì sang ảnh kế tiếp.
                      <span
                        className="hero-progress-fill absolute inset-0 rounded-full bg-green-400"
                        style={{
                          animationDuration: `${intervalMs}ms`,
                          animationPlayState: isPaused ? "paused" : "running",
                        }}
                        onAnimationEnd={() => goToSlide(index + 1)}
                      />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToSlide(selectedIndex - 1)}
              aria-label="Xem ảnh trước"
              className={controlButtonClass}
            >
              <PreviousIcon />
            </button>
            <button
              type="button"
              onClick={() => goToSlide(selectedIndex + 1)}
              aria-label="Xem ảnh tiếp theo"
              className={controlButtonClass}
            >
              <NextIcon />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
