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
            className="order-2 flex gap-2 sm:order-1 sm:flex-col sm:w-[72px] sm:shrink-0"
            aria-label="Các ảnh của sản phẩm"
          >
            {galleryImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Xem ảnh ${index + 1} của ${name}`}
                aria-pressed={selectedIndex === index}
                className={`relative size-[60px] sm:size-[72px] shrink-0 overflow-hidden rounded-[8px] border-2 bg-surface-hero transition-colors ${
                  selectedIndex === index
                    ? "border-brand ring-1 ring-brand/30"
                    : "border-transparent hover:border-border-ui"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover object-center"
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
            className="group relative w-full aspect-[4/5] max-h-[520px] overflow-hidden rounded-card bg-surface-hero cursor-zoom-in"
            aria-label="Phóng to ảnh sản phẩm"
          >
            <Image
              src={selectedImage}
              alt={imageAlt ?? name}
              fill
              className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 520px"
              preload
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-pill bg-black/50 px-3 py-1.5 text-[12px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M4 6h4M6 4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Phóng to
            </span>
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
