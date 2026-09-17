"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type ProductCarouselImage = {
  readonly src: string;
  readonly alt: string;
};

type ProductImageCarouselProps = {
  readonly images: readonly ProductCarouselImage[];
  readonly title: string;
};

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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function getWrappedIndex(index: number, count: number) {
  return (index + count) % count;
}

export function ProductImageCarousel({
  images,
  title,
}: ProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const imageCount = images.length;
  const selectedImage = images[selectedIndex];
  const selectedIndexRef = useRef(selectedIndex);

  const selectImage = useCallback((nextIndex: number) => {
    const currentIndex = selectedIndexRef.current;
    const wrappedIndex = getWrappedIndex(nextIndex, imageCount);

    if (wrappedIndex === currentIndex) {
      return;
    }

    selectedIndexRef.current = wrappedIndex;
    setPreviousIndex(currentIndex);
    setSelectedIndex(wrappedIndex);
    setIsTransitioning(true);
    requestAnimationFrame(() => setIsTransitioning(false));

    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setPreviousIndex(null);
    }, 300);
  }, [imageCount]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowLeft" && imageCount > 1) {
        event.preventDefault();
        selectImage(selectedIndexRef.current - 1);
      }

      if (event.key === "ArrowRight" && imageCount > 1) {
        event.preventDefault();
        selectImage(selectedIndexRef.current + 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [imageCount, isLightboxOpen, selectImage]);

  if (imageCount === 0 || !selectedImage) {
    return null;
  }

  const openLightbox = () => {
    previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const previousImage = previousIndex === null ? null : images[previousIndex];

  return (
    <>
      <div role="group" aria-label={title} className="mx-auto max-w-5xl">
          <div className="relative">
            <button
              type="button"
              onClick={openLightbox}
              aria-label={`Mở toàn màn hình ảnh ${selectedIndex + 1} của ${title}`}
              className="relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand"
            >
              {previousImage ? (
                <Image
                  key={previousImage.src}
                  src={previousImage.src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) calc(100vw - 32px), 960px"
                  className="object-contain p-3 opacity-100 sm:p-5"
                />
              ) : null}
              <Image
                key={selectedImage.src}
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="(max-width: 1024px) calc(100vw - 32px), 960px"
                className={`object-contain p-3 transition-opacity duration-300 sm:p-5 ${
                  isTransitioning ? "opacity-0" : "opacity-100"
                }`}
              />
            </button>

            {imageCount > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => selectImage(selectedIndex - 1)}
                  aria-label="Xem ảnh trước"
                  className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-card transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:left-5 sm:h-11 sm:w-11"
                >
                  <PreviousIcon />
                </button>
                <button
                  type="button"
                  onClick={() => selectImage(selectedIndex + 1)}
                  aria-label="Xem ảnh tiếp theo"
                  className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-dark shadow-card transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:right-5 sm:h-11 sm:w-11"
                >
                  <NextIcon />
                </button>
              </>
            ) : null}

            <p
              aria-live="polite"
              className="absolute bottom-3 right-3 rounded-pill bg-content-heading/80 px-3 py-1 font-sans text-[13px] font-medium tabular-nums text-white sm:bottom-5 sm:right-5"
            >
              {selectedIndex + 1} / {imageCount}
            </p>
          </div>

          {imageCount > 1 ? (
            <div
              className="mt-4 flex items-center justify-center gap-2"
              aria-label={`Chọn ảnh của ${title}`}
            >
              {images.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => selectImage(index)}
                  aria-label={`Xem ảnh ${index + 1} của ${title}`}
                  aria-pressed={selectedIndex === index}
                  className={`h-2.5 rounded-full transition-[width,background-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    selectedIndex === index
                      ? "w-6 bg-brand"
                      : "w-2.5 bg-brand/25 hover:bg-brand/50"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>

      {isLightboxOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Thư viện ảnh ${title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4 sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeLightbox();
            }
          }}
        >
          <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              aria-label="Đóng thư viện ảnh"
              className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <CloseIcon />
            </button>

            <div className="relative h-full w-full max-h-[calc(100vh-8rem)]">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                fill
                sizes="100vw"
                loading="eager"
                className="object-contain"
              />
            </div>

            {imageCount > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => selectImage(selectedIndex - 1)}
                  aria-label="Xem ảnh trước"
                  className="absolute left-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-3"
                >
                  <PreviousIcon />
                </button>
                <button
                  type="button"
                  onClick={() => selectImage(selectedIndex + 1)}
                  aria-label="Xem ảnh tiếp theo"
                  className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-3"
                >
                  <NextIcon />
                </button>
              </>
            ) : null}

            <p aria-live="polite" className="mt-3 font-sans text-[14px] tabular-nums text-white">
              {selectedIndex + 1} / {imageCount}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
