-- AddGalleryImages
ALTER TABLE "Product"
ADD COLUMN "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Preserve existing product images as the first gallery image.
UPDATE "Product"
SET "images" = ARRAY["image"]
WHERE "image" <> '';
