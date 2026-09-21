"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type ProductCarouselImage = {
  readonly src: string;
  readonly alt: string;
  readonly title: string;
  readonly description: string;
};

type ProductImageCarouselProps = {
  readonly images: readonly ProductCarouselImage[];
  readonly title: string;
};

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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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

  const selectImage = useCallback(
    (nextIndex: number) => {
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
    },
    [imageCount],
  );

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
    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
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
      <div role="group" aria-label={title} className="w-full">
        <div className="overflow-hidden rounded-card border border-border-ui/50 bg-white shadow-card">
          <div className="grid lg:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.75fr)]">
            <div className="relative bg-slate-100 lg:min-h-[500px]">
              <button
                type="button"
                onClick={openLightbox}
                aria-label={`Mở toàn màn hình ảnh ${selectedImage.title}`}
                className="relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand lg:h-full lg:min-h-[500px] lg:aspect-auto"
              >
                {previousImage ? (
                  <Image
                    key={previousImage.src}
                    src={previousImage.src}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) calc(100vw - 32px), 70vw"
                    className="object-cover opacity-100"
                  />
                ) : null}
                <Image
                  key={selectedImage.src}
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  sizes="(max-width: 1024px) calc(100vw - 32px), 70vw"
                  className={`object-cover transition-opacity duration-300 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/35 to-transparent"
                />
              </button>

              {imageCount > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => selectImage(selectedIndex - 1)}
                    aria-label="Xem ảnh trước"
                    className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-brand-dark/70 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-5 sm:h-11 sm:w-11"
                  >
                    <PreviousIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => selectImage(selectedIndex + 1)}
                    aria-label="Xem ảnh tiếp theo"
                    className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-brand-dark/70 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5 sm:h-11 sm:w-11"
                  >
                    <NextIcon />
                  </button>
                </>
              ) : null}

              <p
                aria-live="polite"
                className="absolute bottom-4 right-4 rounded-pill bg-brand-dark/80 px-3 py-1 font-sans text-[12px] font-medium tabular-nums text-white backdrop-blur-md sm:bottom-5 sm:right-5"
              >
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(imageCount).padStart(2, "0")}
              </p>
            </div>

            <div className="flex flex-col p-5 sm:p-7 lg:p-8">
              <div aria-live="polite">
                <p className="font-sans text-[12px] font-medium uppercase leading-5 tracking-[0.14em] text-brand">
                  {title}
                </p>
                <h3 className="mt-3 font-heading text-[22px] font-semibold leading-8 tracking-[-0.01em] text-content-heading lg:text-[26px] lg:leading-9">
                  {selectedImage.title}
                </h3>
                <p className="mt-3 font-sans text-[14px] leading-6 text-content-body">
                  {selectedImage.description}
                </p>
              </div>

              {imageCount > 1 ? (
                <div className="mt-7 border-t border-border-ui/50 pt-5 lg:mt-auto">
                  <p className="mb-3 font-sans text-[12px] font-medium uppercase leading-5 tracking-[0.1em] text-content-muted">
                    Chọn hình ảnh
                  </p>
                  <div
                    className="grid grid-cols-3 gap-2 lg:grid-cols-1"
                    aria-label={`Chọn ảnh của ${title}`}
                  >
                    {images.map((image, index) => {
                      const isSelected = selectedIndex === index;

                      return (
                        <button
                          key={image.src}
                          type="button"
                          onClick={() => selectImage(index)}
                          aria-label={`Xem ${image.title}`}
                          aria-pressed={isSelected}
                          className={`group overflow-hidden rounded-[10px] border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:grid lg:grid-cols-[88px_1fr] lg:items-center ${
                            isSelected
                              ? "border-brand bg-surface-card"
                              : "border-border-ui/60 bg-white hover:border-brand/50 hover:bg-surface-card/60"
                          }`}
                        >
                          <span className="relative block aspect-[16/9] overflow-hidden bg-slate-100 lg:aspect-auto lg:h-[54px]">
                            <Image
                              src={image.src}
                              alt=""
                              fill
                              sizes="(max-width: 1024px) 30vw, 88px"
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          </span>
                          <span className="hidden min-w-0 px-3 font-sans text-[12px] font-medium leading-4 text-content-heading lg:block">
                            {image.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
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

            <div className="mt-3 text-center text-white">
              <p className="font-heading text-[15px] font-medium">
                {selectedImage.title}
              </p>
              <p aria-live="polite" className="mt-1 font-sans text-[13px] tabular-nums text-white/65">
                {selectedIndex + 1} / {imageCount}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
