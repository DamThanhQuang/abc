export default function NewsDetailLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-surface-hero py-8 lg:py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">
          <div className="h-4 w-48 rounded bg-white/20 animate-pulse mb-4" />
          <div className="h-8 w-96 max-w-full rounded bg-white/20 animate-pulse" />
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Article skeleton */}
          <div className="lg:col-span-8">
            {/* Meta */}
            <div className="mb-5 lg:mb-6 flex items-center gap-3 border-b border-border-ui pb-5 lg:pb-6">
              <div className="h-5 w-20 rounded-pill bg-surface-card animate-pulse" />
              <div className="h-4 w-28 rounded bg-surface-card animate-pulse" />
              <div className="h-4 w-20 rounded bg-surface-card animate-pulse" />
            </div>

            {/* Hero image */}
            <div className="mb-6 lg:mb-8 aspect-[16/9] rounded-card bg-surface-card animate-pulse" />

            {/* Lead text */}
            <div className="mb-5 lg:mb-6 flex flex-col gap-2">
              <div className="h-5 w-full rounded bg-surface-card animate-pulse" />
              <div className="h-5 w-4/5 rounded bg-surface-card animate-pulse" />
            </div>

            {/* Body text */}
            <div className="flex flex-col gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-4 rounded bg-surface-card animate-pulse"
                  style={{ width: `${75 + Math.round(Math.sin(i) * 20)}%` }}
                />
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside className="lg:col-span-4">
            <div className="h-5 w-36 rounded bg-surface-card animate-pulse mb-5" />
            <div className="flex flex-col gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-card bg-white border border-border-ui shadow-card overflow-hidden">
                  <div className="aspect-[16/9] bg-surface-card animate-pulse" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="h-3 w-16 rounded bg-surface-card animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-surface-card animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA box skeleton */}
            <div className="mt-6 lg:mt-8 rounded-card bg-surface-card p-5 lg:p-6">
              <div className="h-5 w-40 rounded bg-white/50 animate-pulse mb-2" />
              <div className="h-4 w-full rounded bg-white/50 animate-pulse mb-4" />
              <div className="h-10 rounded-btn bg-white/50 animate-pulse" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
