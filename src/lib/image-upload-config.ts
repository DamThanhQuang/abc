export const IMAGE_UPLOAD = {
  maxSourceBytes: 25 * 1024 * 1024,
  maxReceivedBytes: 3 * 1024 * 1024,
  maxStoredBytes: 1.5 * 1024 * 1024,
  maxDimension: 1600,
  webpQuality: 82,
  maxInputPixels: 40_000_000,
} as const;

// Banner phủ toàn chiều ngang màn hình nên cần độ phân giải và chất lượng cao
// hơn ảnh sản phẩm. Không có bậc hạ chất lượng: ảnh quá nặng thì báo lỗi thay vì
// âm thầm làm mờ.
export const BANNER_UPLOAD = {
  maxSourceBytes: 40 * 1024 * 1024,
  // Vẫn dưới giới hạn 4,5 MB mỗi request của Vercel sau khi cộng phần multipart.
  maxReceivedBytes: 4 * 1024 * 1024,
  maxStoredBytes: 4 * 1024 * 1024,
  minWidth: 1920,
  minHeight: 1080,
  maxWidth: 2560,
  // Khung banner trên máy tính khoảng 2,1:1; ảnh dài hơn 3:1 bị cắt gần hết.
  maxAspectRatio: 3,
  // Trình duyệt nén ở mức cao hơn server một chút để lần nén thứ hai trên server
  // không làm lộ vệt nén.
  clientWebpQuality: 95,
  webpQuality: 90,
  maxInputPixels: 50_000_000,
  blurWidth: 24,
} as const;

/** Trả về lý do từ chối ảnh banner, hoặc null nếu ảnh dùng được. */
export function bannerDimensionError(width: number, height: number): string | null {
  if (width <= height) {
    return `Ảnh ${width}×${height} là ảnh dọc hoặc vuông, sẽ bị cắt mất phần lớn trên màn hình máy tính. `
      + "Hãy dùng ảnh ngang, khuyến nghị tỉ lệ 16:9.";
  }
  if (width / height > BANNER_UPLOAD.maxAspectRatio) {
    return `Ảnh ${width}×${height} quá dài, sẽ bị cắt gần hết hai bên. `
      + `Tỉ lệ ngang/cao tối đa ${BANNER_UPLOAD.maxAspectRatio}:1, khuyến nghị 16:9.`;
  }
  if (width < BANNER_UPLOAD.minWidth || height < BANNER_UPLOAD.minHeight) {
    return `Ảnh ${width}×${height} quá nhỏ, banner sẽ bị mờ. `
      + `Cần tối thiểu ${BANNER_UPLOAD.minWidth}×${BANNER_UPLOAD.minHeight}.`;
  }
  return null;
}

/**
 * Chiều ngang lưu trữ của ảnh banner: thu về tối đa 2560px nhưng không để chiều
 * cao xuống dưới mức tối thiểu, nếu không ảnh dài sẽ bị phóng to và mờ.
 */
export function bannerStoredWidth(width: number, height: number): number {
  const scale = Math.min(
    1,
    Math.max(BANNER_UPLOAD.maxWidth / width, BANNER_UPLOAD.minHeight / height),
  );
  return Math.round(width * scale);
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
