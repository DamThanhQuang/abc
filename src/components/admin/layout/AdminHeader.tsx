type AdminHeaderProps = {
  breadcrumb?: { label: string; href?: string }[];
};

export function AdminHeader({ breadcrumb }: AdminHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border-ui bg-white px-6 gap-4">
      {/* Left: search + breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Search */}
        <div className="relative hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="#94a3b8" strokeWidth="1.6"/>
              <path d="M13 13l3 3" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="h-9 w-56 rounded-btn border border-border-ui bg-surface-page pl-9 pr-4 font-sans text-[13px] text-content-body placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          />
        </div>

        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1.5 text-[13px] font-sans">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5 text-content-muted">
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumb.length - 1 ? "text-content-heading font-medium" : ""}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        )}
      </div>

      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative flex h-9 w-9 items-center justify-center rounded-btn text-content-muted hover:bg-surface-card transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2a6 6 0 0 1 6 6c0 4 2 5 2 5H2s2-1 2-5a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M8.5 17a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Avatar */}
        <button
          type="button"
          aria-label="Tài khoản"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white font-heading font-bold text-[13px] hover:bg-brand/90 transition-colors"
        >
          A
        </button>
      </div>
    </header>
  );
}
