export const IMAGE_UPLOAD = {
  maxSourceBytes: 25 * 1024 * 1024,
  maxReceivedBytes: 3 * 1024 * 1024,
  maxStoredBytes: 1.5 * 1024 * 1024,
  maxDimension: 1600,
  webpQuality: 82,
  maxInputPixels: 40_000_000,
} as const;

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
