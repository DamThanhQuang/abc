"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-border-ui bg-white p-8 sm:p-12 text-center shadow-card">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-card">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke="#0f4c81" strokeWidth="1.8" />
            <path d="M8 14l4 4 8-8" stroke="#0f4c81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mb-2 font-heading font-semibold text-[20px] lg:text-[22px] text-content-heading">
          Gửi thành công!
        </h3>
        <p className="font-sans text-[14px] lg:text-[15px] text-content-body">
          Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng 1–2 ngày làm việc.
        </p>
      </div>
    );
  }

  const inputClass = `
    h-11 w-full rounded-btn border border-border-ui bg-white px-4
    font-sans text-[14px] text-content-body
    placeholder:text-content-muted
    focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
    transition-colors
  `;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-5" noValidate>

      {/* Name + Company — stack on mobile, side-by-side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="font-sans text-[13px] font-medium text-content-heading">
            Họ và tên <span className="text-destructive">*</span>
          </label>
          <input id="name" name="name" type="text" required placeholder="Nguyễn Văn A" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="font-sans text-[13px] font-medium text-content-heading">
            Công ty
          </label>
          <input id="company" name="company" type="text" placeholder="Tên công ty" className={inputClass} />
        </div>
      </div>

      {/* Email + Phone — stack on mobile, side-by-side on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-sans text-[13px] font-medium text-content-heading">
            Email <span className="text-destructive">*</span>
          </label>
          <input id="email" name="email" type="email" required placeholder="email@company.com" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="font-sans text-[13px] font-medium text-content-heading">
            Số điện thoại
          </label>
          <input id="phone" name="phone" type="tel" placeholder="+84 000 000 000" className={inputClass} />
        </div>
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="font-sans text-[13px] font-medium text-content-heading">
          Chủ đề <span className="text-destructive">*</span>
        </label>
        <select
          id="subject" name="subject" required defaultValue=""
          className="h-11 rounded-btn border border-border-ui bg-white px-4 font-sans text-[14px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors appearance-none cursor-pointer"
        >
          <option value="" disabled>Chọn chủ đề...</option>
          <option value="san-pham">Tư vấn sản phẩm</option>
          <option value="bao-gia">Yêu cầu báo giá</option>
          <option value="ky-thuat">Hỗ trợ kỹ thuật</option>
          <option value="hop-tac">Hợp tác kinh doanh</option>
          <option value="khac">Khác</option>
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="font-sans text-[13px] font-medium text-content-heading">
          Nội dung <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message" name="message" required rows={5}
          placeholder="Mô tả nhu cầu hoặc câu hỏi của bạn..."
          className="resize-none rounded-btn border border-border-ui bg-white px-4 py-3 font-sans text-[14px] text-content-body placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-btn bg-brand px-6 font-sans text-[14px] font-medium tracking-[0.05em] text-white shadow-btn hover:bg-brand/90 transition-colors"
      >
        Gửi yêu cầu
      </button>
    </form>
  );
}
