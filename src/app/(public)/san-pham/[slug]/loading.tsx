export default function ProductDetailLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-surface-hero py-8 lg:py-12">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16">
          <div className="h-4 w-48 rounded bg-white/20 animate-pulse mb-4" />
          <div className="h-8 w-72 rounded bg-white/20 animate-pulse" />
        </div>
      </div>

      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-16 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery skeleton */}
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] rounded-card bg-surface-card animate-pulse" />
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 w-16 rounded-[6px] bg-surface-card animate-pulse" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="lg:col-span-5">
            <div className="rounded-card bg-white p-5 lg:p-7 shadow-card border border-border-ui/40 flex flex-col gap-5">
              <div className="flex gap-3">
                <div className="h-5 w-20 rounded-pill bg-surface-card animate-pulse" />
                <div className="h-5 w-24 rounded bg-surface-card animate-pulse" />
              </div>
              <div className="h-8 w-4/5 rounded bg-surface-card animate-pulse" />
              <div className="h-5 w-1/3 rounded bg-surface-card animate-pulse" />
              <div className="border-t border-border-ui/60 pt-4 flex flex-col gap-2">
                <div className="h-4 w-full rounded bg-surface-card animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-surface-card animate-pulse" />
              </div>
              <div className="border-t border-border-ui/60 pt-4 flex flex-col gap-2">
                <div className="h-5 w-32 rounded bg-surface-card animate-pulse mb-1" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="h-4 w-4 rounded-full bg-surface-card animate-pulse shrink-0" />
                    <div className="h-4 w-3/4 rounded bg-surface-card animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 pt-2 border-t border-border-ui/60">
                <div className="h-[45px] rounded-btn bg-surface-card animate-pulse" />
                <div className="h-[45px] rounded-btn bg-surface-card/60 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
