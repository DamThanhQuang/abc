import {
  BANNER_UPLOAD,
  IMAGE_UPLOAD,
  bannerDimensionError,
  bannerStoredWidth,
  formatFileSize,
} from "@/lib/image-upload-config";

type OptimizedImage = {
  file: File;
  originalSize: number;
  optimizedSize: number;
};

function canvasToWebp(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Trình duyệt không thể nén ảnh này."));
      },
      "image/webp",
      quality,
    );
  });
}

export async function optimizeImageForUpload(file: File): Promise<OptimizedImage> {
  if (file.size > IMAGE_UPLOAD.maxSourceBytes) {
    throw new Error("Ảnh gốc vượt quá 25 MB.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    if (file.size <= IMAGE_UPLOAD.maxReceivedBytes) {
      return { file, originalSize: file.size, optimizedSize: file.size };
    }
    throw new Error("Trình duyệt không đọc được ảnh để thu nhỏ.");
  }

  try {
    if (bitmap.width * bitmap.height > IMAGE_UPLOAD.maxInputPixels) {
      throw new Error("Ảnh có độ phân giải quá lớn, tối đa khoảng 40 megapixel.");
    }

    const scale = Math.min(
      1,
      IMAGE_UPLOAD.maxDimension / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);

    let blob = await canvasToWebp(canvas, IMAGE_UPLOAD.webpQuality / 100);
    if (blob.size > IMAGE_UPLOAD.maxReceivedBytes) {
      blob = await canvasToWebp(canvas, 0.68);
    }

    // Release the canvas backing store before throwing or returning so that
    // the GPU/CPU memory is freed immediately instead of waiting for GC.
    // This matters when the caller processes several large images in a loop.
    canvas.width = 0;
    canvas.height = 0;

    if (blob.size > IMAGE_UPLOAD.maxReceivedBytes) {
      throw new Error("Không thể nén ảnh xuống dưới 3 MB. Hãy chọn ảnh khác.");
    }

    // Keep an already-small WebP when recompression would make it larger.
    if (file.type === "image/webp" && file.size <= blob.size) {
      return { file, originalSize: file.size, optimizedSize: file.size };
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "product-image";
    const optimizedFile = new File([blob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });

    return {
      file: optimizedFile,
      originalSize: file.size,
      optimizedSize: optimizedFile.size,
    };
  } finally {
    bitmap.close();
  }
}

/**
 * Chuẩn bị ảnh banner trước khi upload: chặn ảnh nhỏ hơn khung banner (sẽ bị
 * phóng to và mờ), ảnh dọc hoặc quá dài; thu nhỏ theo bannerStoredWidth và nén
 * WebP chất lượng cao.
 */
export async function optimizeBannerForUpload(file: File): Promise<OptimizedImage> {
  if (file.size > BANNER_UPLOAD.maxSourceBytes) {
    throw new Error(`Ảnh gốc vượt quá ${formatFileSize(BANNER_UPLOAD.maxSourceBytes)}.`);
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Trình duyệt không đọc được ảnh này. Hãy dùng JPEG, PNG hoặc WebP.");
  }

  try {
    const dimensionError = bannerDimensionError(bitmap.width, bitmap.height);
    if (dimensionError) throw new Error(dimensionError);
    if (bitmap.width * bitmap.height > BANNER_UPLOAD.maxInputPixels) {
      throw new Error("Ảnh có độ phân giải quá lớn, tối đa khoảng 50 megapixel.");
    }

    const width = bannerStoredWidth(bitmap.width, bitmap.height);
    const height = Math.round(bitmap.height * (width / bitmap.width));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, width, height);

    let blob = await canvasToWebp(canvas, BANNER_UPLOAD.clientWebpQuality / 100);
    // Chỉ lùi về đúng chất lượng server sẽ lưu, không thấp hơn.
    if (blob.size > BANNER_UPLOAD.maxReceivedBytes) {
      blob = await canvasToWebp(canvas, BANNER_UPLOAD.webpQuality / 100);
    }

    canvas.width = 0;
    canvas.height = 0;

    if (blob.size > BANNER_UPLOAD.maxReceivedBytes) {
      throw new Error(
        "Ảnh quá nhiều chi tiết nên không nén được xuống dưới "
          + `${formatFileSize(BANNER_UPLOAD.maxReceivedBytes)} mà vẫn giữ độ nét. Hãy chọn ảnh khác.`,
      );
    }

    const baseName = file.name.replace(/\.[^.]+$/, "") || "banner";
    const optimizedFile = new File([blob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });

    return {
      file: optimizedFile,
      originalSize: file.size,
      optimizedSize: optimizedFile.size,
    };
  } finally {
    bitmap.close();
  }
}
