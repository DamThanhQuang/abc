import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Build the href for a given page number */
  getPageHref: (page: number) => string;
};

/** Builds a compact page list: [1] [2] ... [n] with max 5 visible page buttons */
function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, "…", total];
  if (current >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

/** Arrow icon — prev (flip) or next */
function ChevronIcon({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="7"
      height="11"
      viewBox="0 0 7 11"
      fill="none"
      aria-hidden="true"
      className={dir === "prev" ? "rotate-180" : ""}
    >
      <path
        d="M1 1l5 4.5L1 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Pagination({ currentPage, totalPages, getPageHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {/* Prev */}
      {hasPrev ? (
        <Link
          href={getPageHref(currentPage - 1)}
          aria-label="Trang trước"
          className="
            flex h-10 w-8 items-center justify-center rounded-[6px]
            text-content-body hover:bg-surface-card transition-colors
          "
        >
          <ChevronIcon dir="prev" />
        </Link>
      ) : (
        <span className="flex h-10 w-8 items-center justify-center text-content-muted opacity-40" aria-disabled="true">
          <ChevronIcon dir="prev" />
        </span>
      )}

      {/* Page buttons */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`dots-${i}`}
            className="flex h-10 w-6 items-center justify-center font-sans text-[14px] text-content-muted"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={getPageHref(p)}
            aria-label={`Trang ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-[6px]",
              "font-sans text-[14px] leading-4 transition-colors",
              p === currentPage
                ? "bg-brand text-white"
                : "text-content-body hover:bg-surface-card",
            )}
          >
            {p}
          </Link>
        ),
      )}

      {/* Next */}
      {hasNext ? (
        <Link
          href={getPageHref(currentPage + 1)}
          aria-label="Trang tiếp"
          className="
            flex h-10 w-8 items-center justify-center rounded-[6px]
            text-content-body hover:bg-surface-card transition-colors
          "
        >
          <ChevronIcon dir="next" />
        </Link>
      ) : (
        <span className="flex h-10 w-8 items-center justify-center text-content-muted opacity-40" aria-disabled="true">
          <ChevronIcon dir="next" />
        </span>
      )}
    </nav>
  );
}
