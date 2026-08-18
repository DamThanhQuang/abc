export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-16">
      {/* Hero skeleton */}
      <div className="mb-8 h-[120px] rounded-card bg-surface-card animate-pulse" />

      {/* Filter bar skeleton */}
      <div className="mb-6 flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-btn bg-surface-card animate-pulse" />
        ))}
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
            <div className="aspect-[4/3] bg-surface-card animate-pulse" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-3 w-16 bg-surface-card animate-pulse rounded" />
              <div className="h-5 w-3/4 bg-surface-card animate-pulse rounded" />
              <div className="h-3 w-full bg-surface-card animate-pulse rounded" />
              <div className="h-3 w-2/3 bg-surface-card animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
