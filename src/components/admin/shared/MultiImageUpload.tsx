"use client";

import { useEffect, useRef, useState } from "react";
import { optimizeImageForUpload } from "@/lib/client-image-optimization";
import { formatFileSize } from "@/lib/image-upload-config";

type MultiImageUploadProps = {
  name: string;
  defaultValues?: string[];
  label?: string;
  maxImages?: number;
};

type UploadResponse = {
  url?: string;
  error?: string;
  size?: number;
};

function uniqueImages(images: string[], maxImages: number) {
  return [...new Set(images.map((image) => image.trim()).filter(Boolean))].slice(0, maxImages);
}

export function MultiImageUpload({
  name,
  defaultValues = [],
  label = "Ảnh sản phẩm",
  maxImages = 10,
}: MultiImageUploadProps) {
  const [images, setImages] = useState(() => uniqueImages(defaultValues, maxImages));
  const [manualUrl, setManualUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [optimizationSummary, setOptimizationSummary] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;

    function preventEarlySubmit(event: SubmitEvent) {
      if (!uploading) return;
      event.preventDefault();
      setError("Vui lòng chờ tải ảnh hoàn tất trước khi lưu sản phẩm.");
    }

    form.addEventListener("submit", preventEarlySubmit);
    return () => form.removeEventListener("submit", preventEarlySubmit);
  }, [uploading]);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const data = (await response.json()) as UploadResponse;

    if (!response.ok || !data.url) {
      throw new Error(data.error ?? `Không thể tải ảnh ${file.name}`);
    }

    return { url: data.url, size: data.size ?? file.size };
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const availableSlots = maxImages - images.length;
    const selectedFiles = Array.from(event.target.files ?? []).slice(0, availableSlots);
    event.target.value = "";

    if (selectedFiles.length === 0) {
      setError(availableSlots === 0 ? `Chỉ được thêm tối đa ${maxImages} ảnh.` : "");
      return;
    }

    setUploading(true);
    setError("");
    setOptimizationSummary("");

    const uploadedUrls: string[] = [];
    const failures: string[] = [];
    let originalBytes = 0;
    let storedBytes = 0;

    // Process sequentially to avoid decoding several large images in memory
    // and opening many upload requests at the same time.
    for (const [index, file] of selectedFiles.entries()) {
      setProgress(`Đang xử lý ảnh ${index + 1}/${selectedFiles.length}: ${file.name}`);
      try {
        const optimized = await optimizeImageForUpload(file);
        const uploaded = await uploadFile(optimized.file);
        uploadedUrls.push(uploaded.url);
        originalBytes += optimized.originalSize;
        storedBytes += uploaded.size;
      } catch (uploadError) {
        const message = uploadError instanceof Error ? uploadError.message : "Lỗi không xác định";
        failures.push(`${file.name}: ${message}`);
      }
    }

    if (uploadedUrls.length > 0) {
      setImages((current) => uniqueImages([...current, ...uploadedUrls], maxImages));
      const savedBytes = Math.max(0, originalBytes - storedBytes);
      setOptimizationSummary(
        `Đã tải ${uploadedUrls.length} ảnh · ${formatFileSize(originalBytes)} → ${formatFileSize(storedBytes)}`
          + (savedBytes > 0 ? ` · giảm ${formatFileSize(savedBytes)}` : ""),
      );
    }
    setError(failures.join("\n"));
    setProgress("");
    setUploading(false);
  }

  function addManualUrl() {
    const nextUrl = manualUrl.trim();
    if (!nextUrl) return;
    if (images.length >= maxImages) {
      setError(`Chỉ được thêm tối đa ${maxImages} ảnh.`);
      return;
    }

    setImages((current) => uniqueImages([...current, nextUrl], maxImages));
    setManualUrl("");
    setError("");
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  }

  function setAsCover(index: number) {
    setImages((current) => {
      const selected = current[index];
      if (!selected) return current;
      return [selected, ...current.filter((_, imageIndex) => imageIndex !== index)];
    });
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-3" aria-busy={uploading}>
      <div className="flex items-center justify-between gap-3">
        <label className="font-sans text-[12px] font-semibold text-content-heading">{label}</label>
        <span className="font-sans text-[11px] text-content-muted">
          {images.length}/{maxImages} ảnh
        </span>
      </div>

      <input type="hidden" name={name} value={JSON.stringify(images)} />

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="overflow-hidden rounded-[8px] border border-border-ui bg-surface-hero">
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Xem trước ảnh sản phẩm ${index + 1}`} className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-1 font-sans text-[10px] font-semibold text-white shadow-sm">
                    Ảnh đại diện
                  </span>
                )}
              </div>
              <div className="flex border-t border-border-ui bg-white">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setAsCover(index)}
                    className="flex-1 border-r border-border-ui px-2 py-2 font-sans text-[11px] text-brand hover:bg-surface-card"
                  >
                    Đặt làm đại diện
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="px-3 py-2 font-sans text-[11px] text-red-600 hover:bg-red-50"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading || images.length >= maxImages}
        className="w-full rounded-btn border border-border-ui py-2 font-sans text-[13px] text-content-body transition-colors hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? "Đang tải ảnh..." : "Chọn một hoặc nhiều ảnh"}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-2">
        <input
          type="text"
          value={manualUrl}
          onChange={(event) => setManualUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addManualUrl();
            }
          }}
          className="h-10 min-w-0 flex-1 rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          placeholder="Hoặc nhập URL ảnh"
        />
        <button
          type="button"
          onClick={addManualUrl}
          disabled={!manualUrl.trim() || images.length >= maxImages}
          className="rounded-btn border border-brand px-3 font-sans text-[12px] font-medium text-brand hover:bg-surface-card disabled:cursor-not-allowed disabled:opacity-50"
        >
          Thêm
        </button>
      </div>

      <p className="font-sans text-[11px] leading-4 text-content-muted">
        Ảnh đầu tiên là ảnh đại diện. JPEG, PNG, WebP hoặc AVIF tối đa 25 MB; ảnh được thu nhỏ tối đa 1600px và chuyển sang WebP trước khi lưu.
      </p>
      {progress && <p className="font-sans text-[12px] text-brand">{progress}</p>}
      {optimizationSummary && (
        <p className="font-sans text-[12px] text-green-700">{optimizationSummary}</p>
      )}
      {error && <p className="whitespace-pre-line font-sans text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
