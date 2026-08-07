"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/shared/LogoMark";

export default function DangNhapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    setLoading(true);
    setError("");

    // Demo: accept any non-empty credentials
    setTimeout(() => {
      if (email && password) {
        router.push("/admin");
      } else {
        setError("Vui lòng nhập đầy đủ thông tin.");
        setLoading(false);
      }
    }, 600);
  }

  const inputClass = "h-11 w-full rounded-btn border border-border-ui bg-white px-4 font-sans text-[14px] text-content-body placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-brand mb-4">
            <LogoMark size={28} />
          </div>
          <h1 className="font-heading font-bold text-[22px] text-content-heading">
            FuelPrecision Admin
          </h1>
          <p className="mt-1 font-sans text-[14px] text-content-muted">
            Đăng nhập để quản lý hệ thống
          </p>
        </div>

        {/* Form */}
        <div className="rounded-card bg-white p-8 shadow-card border border-border-ui">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-sans text-[13px] font-medium text-content-heading">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@fuelprecision.vn"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-sans text-[13px] font-medium text-content-heading">
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

            {error && (
              <p className="font-sans text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-btn px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-btn bg-brand font-sans text-[14px] font-medium text-white shadow-btn hover:bg-brand/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-5 text-center font-sans text-[12px] text-content-muted">
            Demo: nhập bất kỳ email + mật khẩu để đăng nhập
          </p>
        </div>

        <p className="mt-6 text-center font-sans text-[12px] text-content-muted">
          © {new Date().getFullYear()} FuelPrecision Industrial
        </p>
      </div>
    </div>
  );
}
