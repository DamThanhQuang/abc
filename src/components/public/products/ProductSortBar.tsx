"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

type ProductSortBarProps = {
  showing: number;
  total: number;
};

const SORT_OPTIONS = [
  { value: "newest",  label: "Mới nhất" },
  { value: "oldest",  label: "Cũ nhất" },
  { value: "name-az", label: "Tên A–Z" },
  { value: "name-za", label: "Tên Z–A" },
];

export function ProductSortBar({ showing, total }: ProductSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "newest";

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value !== "newest") params.set("sort", value);
    else params.delete("sort");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex min-h-[52px] lg:h-[62px] items-center justify-between rounded-t-[8px] border border-border-ui bg-white px-3 lg:px-[13px] gap-3">
      <p className="font-sans text-[13px] lg:text-[14px] leading-5 text-content-muted">
        <span className="hidden sm:inline">Hiển thị </span>
        <span className="font-semibold text-content-heading">{showing}</span>
        <span className="hidden sm:inline"> trong </span>
        <span className="sm:hidden">/</span>
        <span className="font-semibold text-content-heading">{total}</span>
        <span className="hidden sm:inline"> sản phẩm</span>
      </p>

      <div className="relative shrink-0">
        <select
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
          className="
            h-9 rounded-btn border border-border-ui
            bg-white pl-3 pr-8
            font-sans text-[13px] lg:text-[14px] text-content-body
            appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
          "
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
            <path d="M1 1l4 4 4-4" stroke="#5d5f5f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}
