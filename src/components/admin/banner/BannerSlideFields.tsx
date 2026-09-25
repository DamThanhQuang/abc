"use client";

import { useEffect, useRef, useState } from "react";
import { optimizeBannerForUpload } from "@/lib/client-image-optimization";
import { BANNER_UPLOAD, formatFileSize } from "@/lib/image-upload-config";
import { HERO_FOCUS_OPTIONS, heroFocusOption } from "@/lib/hero-slides";
import type { HeroSlideFocus } from "@/lib/validations";
import type { HeroSlide } from "@/types/hero-slide";

const inputClass = "h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const labelClass = "font-sans text-[12px] font-semibold text-content-heading";

type UploadResponse = {
  url?: string;
  error?: string;
  size?: number;
  width?: number;
  height?: number;
  blurDataUrl?: string;
};

// Cùng lớp phủ với HeroSection để ảnh xem trước giống hệt trên trang chủ.
function HeroOverlay({ mobile }: { mobile?: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,38,74,0.98)_0%,rgba(6,38,74,0.94)_34%,rgba(6,38,74,0.62)_56%,rgba(6,38,74,0.08)_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(3,24,48,0.45)_0%,transparent_45%)]" />
      <div aria-hidden="true" className={`absolute flex flex-col gap-1.5 ${mobile ? "left-3 top-1/3 w-[80%]" : "left-[6%] top-1/3 w-[40%]"}`}>
        <span className="h-2 w-3/4 rounded-full bg-white/80" />
        <span className="h-2 w-1/2 rounded-full bg-green-400/80" />
        <span className="mt-1 h-1.5 w-2/3 rounded-full bg-white/40" />
      </div>
    </>
  );
}

export function BannerSlideFields({ slide }: { slide?: HeroSlide }) {
  const [image, setImage] = useState(slide?.image ?? "");
  const [blurDataUrl, setBlurDataUrl] = useState(slide?.blurDataUrl ?? "");
  const [focus, setFocus] = useState<HeroSlideFocus>(slide?.focus ?? "right");
  const [uploading, setUploading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Chặn lưu khi đang tải ảnh hoặc chưa có ảnh.
  useEffect(() => {
    const form = containerRef.current?.closest("form");
    if (!form) return;

    function guardSubmit(event: SubmitEvent) {
      if (uploading) {
        event.preventDefault();
        setError("Vui lòng chờ tải ảnh hoàn tất trước khi lưu.");
      } else if (!image) {
        event.preventDefault();
        setError("Vui lòng chọn ảnh banner.");
      }
    }

    form.addEventListener("submit", guardSubmit);
    return () => form.removeEventListener("submit", guardSubmit);
  }, [uploading, image]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    setSummary("");

    try {
      const optimized = await optimizeBannerForUpload(file);
      const formData = new FormData();
      formData.append("file", optimized.file);
      formData.append("purpose", "banner");

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await response.json()) as UploadResponse;
      if (!response.ok || !data.url) throw new Error(data.error ?? "Tải lên thất bại");

      setImage(data.url);
      setBlurDataUrl(data.blurDataUrl ?? "");
      setSummary(
        `Đã tải ảnh ${data.width}×${data.height} · `
          + `${formatFileSize(optimized.originalSize)} → ${formatFileSize(data.size ?? optimized.optimizedSize)}`,
      );
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Tải lên thất bại");
    } finally {
      setUploading(false);
    }
  }

  const position = heroFocusOption(focus);

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <input type="hidden" name="image" value={image} />
      <input type="hidden" name="blurDataUrl" value={blurDataUrl} />

      <div className="lg:col-span-8 flex flex-col gap-5">
        <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
          <h2 className="mb-1 font-heading font-semibold text-[15px] text-content-heading">Xem trước</h2>
          <p className="mb-5 font-sans text-[12px] text-content-muted">
            Banner luôn bị cắt theo khung màn hình. Phần bên trái bị chữ che, nên đặt chủ thể ở nửa phải ảnh.
          </p>

          {image ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <figure className="flex-1">
                <div className="relative aspect-[1440/680] overflow-hidden rounded-[8px] bg-[#06264a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position.desktop }} />
                  <HeroOverlay />
                </div>
                <figcaption className="mt-1.5 font-sans text-[12px] text-content-muted">Máy tính</figcaption>
              </figure>
              <figure className="w-[120px] shrink-0">
                <div className="relative aspect-[390/680] overflow-hidden rounded-[8px] bg-[#06264a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position.mobile }} />
                  <HeroOverlay mobile />
                </div>
                <figcaption className="mt-1.5 font-sans text-[12px] text-content-muted">Điện thoại</figcaption>
              </figure>
            </div>
          ) : (
            <div className="flex aspect-[1440/680] items-center justify-center rounded-[8px] border border-dashed border-border-ui bg-surface-card font-sans text-[13px] text-content-muted">
              Chưa có ảnh
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-5">
        <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
          <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Ảnh banner</h2>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-btn border border-border-ui py-2 font-sans text-[13px] text-content-body hover:bg-surface-card transition-colors disabled:opacity-50"
            >
              {uploading ? "Đang xử lý và tải lên..." : image ? "Đổi ảnh" : "Chọn ảnh"}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="font-sans text-[12px] leading-5 text-content-muted">
              Ảnh ngang, tối thiểu {BANNER_UPLOAD.minWidth}×{BANNER_UPLOAD.minHeight}, tỉ lệ
              không quá {BANNER_UPLOAD.maxAspectRatio}:1; khuyến nghị 2560×1440 (16:9). Không cần
              đúng kích thước, ảnh lớn hơn được tự thu nhỏ. Ảnh nhỏ hơn, ảnh dọc hoặc quá dài
              sẽ bị từ chối để banner không bị mờ.
            </p>
            {summary && <p className="font-sans text-[12px] text-green-700">{summary}</p>}
            {error && <p role="alert" className="font-sans text-[12px] text-red-600">{error}</p>}
          </div>

          <div className="mt-5 flex flex-col gap-1.5">
            <label htmlFor="banner-image-alt" className={labelClass}>Mô tả ảnh *</label>
            <input
              id="banner-image-alt"
              type="text"
              name="imageAlt"
              required
              maxLength={300}
              defaultValue={slide?.imageAlt}
              className={inputClass}
              placeholder="VD: Cột bơm xăng dầu tại trạm Long Biên"
            />
          </div>
        </div>

        <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
          <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Hiển thị</h2>
          <fieldset className="flex flex-col gap-2">
            <legend className={`${labelClass} mb-2`}>Vùng giữ lại khi cắt ảnh</legend>
            {HERO_FOCUS_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="focus"
                  value={option.value}
                  checked={focus === option.value}
                  onChange={() => setFocus(option.value)}
                  className="h-4 w-4 accent-brand cursor-pointer"
                />
                <span className="font-sans text-[13px] text-content-body">{option.label}</span>
              </label>
            ))}
          </fieldset>
          <label className="mt-5 flex items-center gap-2.5">
            <input
              type="checkbox"
              name="published"
              defaultChecked={slide?.published ?? true}
              className="h-4 w-4 accent-brand cursor-pointer"
            />
            <span className="font-sans text-[13px] text-content-body">Hiển thị trên trang chủ</span>
          </label>
        </div>
      </div>
    </div>
  );
}
