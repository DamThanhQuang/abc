"use client";

import { useActionState } from "react";
import { submitContact } from "@/lib/actions/contacts";

type FormState = { success?: boolean; error?: string } | undefined;

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: FormState, formData: FormData) => {
      const result = await submitContact({
        name: formData.get("name") as string,
        company: (formData.get("company") as string) || undefined,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      });
      return result;
    },
    undefined,
  );

  if (state?.success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-border-ui bg-white p-8 sm:p-12 text-center shadow-card">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-card">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke="#0f4c81" strokeWidth="1.8" />
            <path d="M8 14l4 4 8-8" stroke="#0f4c81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mb-2 font-heading font-semibold text-[20px] lg:text-[22px] text-content-heading">
          Gui thanh cong!
        </h3>
        <p className="font-sans text-[14px] lg:text-[15px] text-content-body">
          Chung toi da nhan duoc yeu cau cua ban va se phan hoi trong vong 1-2 ngay lam viec.
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
    <form action={formAction} className="flex flex-col gap-4 lg:gap-5">
      {state?.error && (
        <p className="font-sans text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-btn px-3 py-2">
          {state.error}
        </p>
      )}

      {/* Name + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="font-sans text-[13px] font-medium text-content-heading">
            Ho va ten <span className="text-destructive">*</span>
          </label>
          <input id="name" name="name" type="text" required placeholder="Nguyen Van A" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="font-sans text-[13px] font-medium text-content-heading">
            Cong ty
          </label>
          <input id="company" name="company" type="text" placeholder="Ten cong ty" className={inputClass} />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-sans text-[13px] font-medium text-content-heading">
            Email <span className="text-destructive">*</span>
          </label>
          <input id="email" name="email" type="email" required placeholder="email@company.com" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="font-sans text-[13px] font-medium text-content-heading">
            So dien thoai
          </label>
          <input id="phone" name="phone" type="tel" placeholder="+84 000 000 000" className={inputClass} />
        </div>
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="font-sans text-[13px] font-medium text-content-heading">
          Chu de <span className="text-destructive">*</span>
        </label>
        <select
          id="subject" name="subject" required defaultValue=""
          className="h-11 rounded-btn border border-border-ui bg-white px-4 font-sans text-[14px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors appearance-none cursor-pointer"
        >
          <option value="" disabled>Chon chu de...</option>
          <option value="Tu van san pham">Tu van san pham</option>
          <option value="Yeu cau bao gia">Yeu cau bao gia</option>
          <option value="Ho tro ky thuat">Ho tro ky thuat</option>
          <option value="Hop tac kinh doanh">Hop tac kinh doanh</option>
          <option value="Khac">Khac</option>
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="font-sans text-[13px] font-medium text-content-heading">
          Noi dung <span className="text-destructive">*</span>
        </label>
        <textarea
          id="message" name="message" required rows={5}
          placeholder="Mo ta nhu cau hoac cau hoi cua ban..."
          className="resize-none rounded-btn border border-border-ui bg-white px-4 py-3 font-sans text-[14px] text-content-body placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-btn bg-brand px-6 font-sans text-[14px] font-medium tracking-[0.05em] text-white shadow-btn hover:bg-brand/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Dang gui..." : "Gui yeu cau"}
      </button>
    </form>
  );
}
