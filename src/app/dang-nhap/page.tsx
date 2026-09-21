"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import { LogoMark } from "@/components/shared/LogoMark";

const inputClass =
  "h-11 w-full rounded-btn border border-border-ui bg-white px-4 font-sans text-[14px] text-content-body placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";

export default function DangNhapPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      const result = await login(formData);
      return result ?? undefined;
    },
    undefined,
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <LogoMark className="mb-4 h-36 w-auto rounded-[10px]" />
          <h1 className="font-heading font-bold text-[22px] text-content-heading">
            Quản trị hệ thống
          </h1>
          <p className="mt-1 font-sans text-[14px] text-content-muted">
            Đăng nhập để quản lý hệ thống
          </p>
        </div>

        {/* Form */}
        <div className="rounded-card bg-white p-8 shadow-card border border-border-ui">
          <form action={formAction} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-sans text-[13px] font-medium text-content-heading"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@astc.com.vn"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-sans text-[13px] font-medium text-content-heading"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {state?.error && (
              <p className="font-sans text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-btn px-3 py-2">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="h-11 w-full rounded-btn bg-brand font-sans text-[14px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pending ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-sans text-[12px] text-content-muted">
          &copy; {new Date().getFullYear()} Ánh Sáng Toàn Cầu
        </p>
      </div>
    </div>
  );
}
