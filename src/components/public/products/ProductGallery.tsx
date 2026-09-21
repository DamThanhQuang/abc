"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageLightbox } from "./ImageLightbox";

type ProductGalleryProps = {
  images: string[];
  name: string;
  imageAlt?: string;
};

export function ProductGallery({ images, name, imageAlt }: ProductGalleryProps) {
  const galleryImages = [...new Set(images.filter(Boolean))];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const selectedImage = galleryImages[selectedIndex] ?? "/images/products/placeholder.svg";
  const hasMultipleImages = galleryImages.length > 1;

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {hasMultipleImages && (
          <div
            className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:w-[72px] sm:shrink-0 sm:flex-col sm:overflow-visible sm:pb-0"
            aria-label="Các ảnh của sản phẩm"
          >
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Xem ảnh ${index + 1} của ${name}`}
                aria-pressed={selectedIndex === index}
                className={`relative size-[60px] shrink-0 overflow-hidden rounded-[8px] border-2 bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:size-[72px] ${
                  selectedIndex === index
                    ? "border-brand ring-1 ring-brand/30"
                    : "border-transparent hover:border-border-ui"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-contain object-center p-1"
                  sizes="72px"
                />
              </button>
            ))}
          </div>
        )}

        <div className="order-1 sm:order-2 flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-card border border-border-ui/50 bg-white shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand lg:max-h-[560px]"
            aria-label="Phóng to ảnh sản phẩm"
          >
            <Image
              src={selectedImage}
              alt={imageAlt ?? name}
              fill
              className="object-contain object-center p-3 transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.02] sm:p-5"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 520px"
              preload
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-pill bg-black/55 px-3 py-1.5 text-[12px] text-white opacity-100 backdrop-blur-sm transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Phóng to
            </span>
            {hasMultipleImages ? (
              <span
                aria-live="polite"
                className="absolute bottom-3 left-3 rounded-pill bg-black/55 px-3 py-1.5 font-sans text-[12px] tabular-nums text-white backdrop-blur-sm"
              >
                {selectedIndex + 1} / {galleryImages.length}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={galleryImages}
          initialIndex={selectedIndex}
          alt={imageAlt ?? name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
