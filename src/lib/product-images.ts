export const MAX_PRODUCT_IMAGES = 10;
export const PRODUCT_IMAGE_PLACEHOLDER = "/images/products/placeholder.svg";

export function normalizeProductImages(images: unknown, fallback?: string) {
  const normalized = Array.isArray(images)
    ? images
        .filter((image): image is string => typeof image === "string")
        .map((image) => image.trim())
        .filter(Boolean)
    : [];

  if (fallback?.trim()) normalized.push(fallback.trim());

  return [...new Set(normalized)].slice(0, MAX_PRODUCT_IMAGES);
}

export function parseProductImages(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return [];

  try {
    return normalizeProductImages(JSON.parse(value));
  } catch {
    return [];
  }
}
