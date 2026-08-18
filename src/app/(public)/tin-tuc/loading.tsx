export default function NewsLoading() {
  return (
    <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-16">
      {/* Hero skeleton */}
      <div className="mb-8 h-[120px] rounded-card bg-surface-card animate-pulse" />

      {/* News grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
            <div className="aspect-[16/9] bg-surface-card animate-pulse" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-3 w-20 bg-surface-card animate-pulse rounded" />
              <div className="h-5 w-4/5 bg-surface-card animate-pulse rounded" />
              <div className="h-3 w-full bg-surface-card animate-pulse rounded" />
              <div className="h-3 w-1/2 bg-surface-card animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
