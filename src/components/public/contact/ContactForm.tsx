"use client";

import { useState, useTransition } from "react";
import { submitContact } from "@/lib/actions/contacts";

const SUBJECTS = [
  "Tư vấn sản phẩm",
  "Báo giá",
  "Hỗ trợ kỹ thuật",
  "Hợp tác",
  "Khác",
] as const;

const labelClass = "font-sans text-[13px] font-semibold text-content-heading";
const fieldClass =
  "w-full rounded-btn border border-border-ui bg-white px-3.5 font-sans text-[14px] text-content-heading placeholder:text-content-muted/70 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:bg-surface-card";

function optionalText(value: FormDataEntryValue | null): string | undefined {
  const text = typeof value === "string" ? value.trim() : "";
  return text === "" ? undefined : text;
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ContactForm({ productName = "" }: { productName?: string }) {
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setError("");

    startTransition(async () => {
      const result = await submitContact({
        name: String(formData.get("name") ?? "").trim(),
        phone: optionalText(formData.get("phone")),
        email: String(formData.get("email") ?? "").trim(),
        company: optionalText(formData.get("company")),
        subject: String(formData.get("subject") ?? ""),
        message: String(formData.get("message") ?? "").trim(),
      });

      if (result.success) {
        form.reset();
        setSubmitted(true);
      } else {
        setError(result.error ?? "Không thể gửi yêu cầu. Vui lòng thử lại.");
      }
    });
  }

  if (submitted) {
    return (
      <div role="status" className="flex h-full flex-col items-center justify-center py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckIcon />
        </span>
        <h3 className="mt-4 font-heading text-[20px] font-semibold text-content-heading">
          Đã gửi thông tin
        </h3>
        <p className="mt-2 max-w-sm font-sans text-[14px] leading-6 text-content-body">
          Cảm ơn bạn. Chúng tôi sẽ liên hệ lại trong giờ hành chính gần nhất.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 font-sans text-[14px] font-medium text-brand-dark hover:underline"
        >
          Gửi yêu cầu khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className={labelClass}>
            Họ và tên <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            disabled={pending}
            className={`${fieldClass} h-11`}
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-phone" className={labelClass}>Số điện thoại</label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            maxLength={20}
            autoComplete="tel"
            disabled={pending}
            className={`${fieldClass} h-11`}
            placeholder="0912 345 678"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className={labelClass}>
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={pending}
            className={`${fieldClass} h-11`}
            placeholder="ban@congty.vn"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-company" className={labelClass}>Công ty / Cửa hàng</label>
          <input
            id="contact-company"
            name="company"
            type="text"
            maxLength={200}
            autoComplete="organization"
            disabled={pending}
            className={`${fieldClass} h-11`}
            placeholder="Tên đơn vị (nếu có)"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className={labelClass}>
          Nhu cầu <span className="text-red-600">*</span>
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          disabled={pending}
          defaultValue={productName ? "Báo giá" : ""}
          className={`${fieldClass} h-11`}
        >
          <option value="" disabled>Chọn nhu cầu</option>
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className={labelClass}>
          Nội dung <span className="text-red-600">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          disabled={pending}
          defaultValue={productName ? `Tôi quan tâm đến sản phẩm: ${productName}.` : undefined}
          className={`${fieldClass} resize-y py-3 leading-6`}
          placeholder="Mô tả ngắn nhu cầu, số lượng hoặc địa điểm trạm..."
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-btn border border-red-200 bg-red-50 px-3.5 py-2.5 font-sans text-[13px] text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-btn bg-brand px-6 py-3.5 font-sans text-[14px] font-semibold text-white shadow-btn transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : null}
        {pending ? "Đang gửi..." : "Gửi thông tin"}
      </button>
      <p className="font-sans text-[12px] leading-5 text-content-muted">
        Thông tin chỉ dùng để liên hệ tư vấn, không chia sẻ cho bên thứ ba.
      </p>
    </form>
  );
}
