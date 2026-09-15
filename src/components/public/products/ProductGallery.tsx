"use client";

import Image from "next/image";
import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  name: string;
  imageAlt?: string;
};

export function ProductGallery({ images, name, imageAlt }: ProductGalleryProps) {
  const galleryImages = [...new Set(images.filter(Boolean))];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = galleryImages[selectedIndex] ?? "/images/products/placeholder.svg";

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-card bg-surface-hero">
        <Image
          src={selectedImage}
          alt={imageAlt ?? name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 580px"
          preload
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6" aria-label="Các ảnh của sản phẩm">
          {galleryImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Xem ảnh ${index + 1} của ${name}`}
              aria-pressed={selectedIndex === index}
              className={`relative aspect-square overflow-hidden rounded-[8px] border-2 bg-surface-hero transition-colors ${
                selectedIndex === index ? "border-brand" : "border-transparent hover:border-border-ui"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
