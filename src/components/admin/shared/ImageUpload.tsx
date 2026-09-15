"use client";

import { useState, useRef } from "react";

type ImageUploadProps = {
  name: string;
  defaultValue?: string;
  label?: string;
};

export function ImageUpload({ name, defaultValue = "", label = "Anh" }: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Tải lên thất bại");
        return;
      }

      setUrl(data.url);
    } catch {
      setError("Tải lên thất bại");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="font-sans text-[12px] font-semibold text-content-heading">{label}</label>

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={url} />

      {/* Preview */}
      {url && (
        <div className="aspect-video overflow-hidden rounded-[8px] bg-surface-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Preview" className="h-full w-full object-cover" />
        </div>
      )}

      {/* Upload button */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-1 rounded-btn border border-border-ui py-2 font-sans text-[13px] text-content-body hover:bg-surface-card transition-colors disabled:opacity-50"
        >
          {uploading ? "Đang tải lên..." : url ? "Đổi ảnh" : "Chọn ảnh"}
        </button>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="rounded-btn border border-red-200 px-3 py-2 font-sans text-[12px] text-red-600 hover:bg-red-50 transition-colors"
          >
            Xóa
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Manual URL input */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        placeholder="Hoac nhap URL anh truc tiep"
      />

      {error && <p className="font-sans text-[12px] text-red-600">{error}</p>}
    </div>
  );
}
