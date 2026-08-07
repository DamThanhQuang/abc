"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

type ProductFiltersProps = {
  categories: Category[];
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="#5d5f5f" strokeWidth="1.6" />
      <path d="M13 13l3 3" stroke="#5d5f5f" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <line x1="2" y1="4"  x2="14" y2="4"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4" y1="8"  x2="12" y2="8"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedSlug = searchParams.get("category") ?? "";
  const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function buildParams(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(overrides)) {
      if (val) params.set(key, val);
      else params.delete(key);
    }
    params.delete("page"); // always reset to p.1 on any filter change
    return params.toString();
  }

  function navigate(qs: string) {
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(buildParams({ search: searchValue.trim() || null }));
    setMobileOpen(false);
  }

  function handleSearchClear() {
    setSearchValue("");
    navigate(buildParams({ search: null }));
    setMobileOpen(false);
  }

  function handleCategoryChange(slug: string) {
    navigate(buildParams({ category: slug || null }));
    setMobileOpen(false);
  }

  // ── State labels ──────────────────────────────────────────────────────────

  const activeCategory = selectedSlug
    ? categories.find((c) => c.slug === selectedSlug)?.name
    : null;
  const activeSearch = searchParams.get("search");
  const hasActiveFilter = !!(activeCategory || activeSearch);

  // ── Filter panel (shared between mobile + desktop) ─────────────────────

  function renderPanel() {
    return (
      <>
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="relative mb-5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="
              h-[46px] w-full rounded-btn border border-border-ui
              bg-white pl-[41px] pr-10
              font-sans text-[14px] text-content-body
              placeholder:text-content-muted
              focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
              transition-colors
            "
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleSearchClear}
              aria-label="Xóa tìm kiếm"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-heading transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </form>

        {/* Category radios */}
        <div className="rounded-card border border-border-ui bg-white p-[25px] shadow-card">
          <h3 className="mb-[22px] font-heading font-semibold text-[18px] leading-7 text-content-heading">
            Danh mục
          </h3>
          <ul className="flex flex-col gap-3">
            <li className="flex items-center gap-3">
              <input
                type="radio" id="cat-all" name="category" value=""
                checked={selectedSlug === ""}
                onChange={() => handleCategoryChange("")}
                className="h-4 w-4 accent-brand cursor-pointer"
              />
              <label htmlFor="cat-all" className="font-sans text-[14px] leading-6 text-content-body cursor-pointer hover:text-content-heading transition-colors">
                Tất cả sản phẩm
              </label>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-3">
                <input
                  type="radio" id={`cat-${cat.id}`} name="category" value={cat.slug}
                  checked={selectedSlug === cat.slug}
                  onChange={() => handleCategoryChange(cat.slug)}
                  className="h-4 w-4 accent-brand cursor-pointer"
                />
                <label htmlFor={`cat-${cat.id}`} className="font-sans text-[14px] leading-6 text-content-body cursor-pointer hover:text-content-heading transition-colors">
                  {cat.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Mobile: toggle button + collapsible panel */}
      <div className="lg:hidden mb-4 w-full">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          className="
            inline-flex items-center gap-2
            h-10 px-4 rounded-btn
            border border-border-ui bg-white
            font-sans text-[14px] text-content-body
            hover:bg-surface-card transition-colors
          "
        >
          <FilterIcon />
          Lọc sản phẩm
          {hasActiveFilter && (
            <span className="ml-1 rounded-pill bg-brand text-white text-[11px] px-2 py-0.5">
              {activeSearch ? `"${activeSearch}"` : activeCategory}
            </span>
          )}
        </button>

        {mobileOpen && (
          <div className="mt-3 border border-border-ui rounded-card bg-surface-page p-4">
            {renderPanel()}
          </div>
        )}
      </div>

      {/* Desktop: always-visible sidebar */}
      <aside className="hidden lg:flex w-[270px] shrink-0 flex-col gap-[22px]">
        {renderPanel()}
      </aside>
    </>
  );
}
