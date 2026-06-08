export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-[var(--color-skeleton)]" />
              <div>
                <div className="mb-1 h-2.5 w-16 rounded bg-[var(--color-skeleton)]" />
                <div className="h-4 w-24 rounded bg-[var(--color-skeleton)]" />
              </div>
            </div>
            <div className="h-4 w-4 rounded bg-[var(--color-skeleton)]" />
          </div>
          <div className="mb-4 space-y-2">
            <div className="h-3 w-full rounded bg-[var(--color-skeleton)]" />
            <div className="h-3 w-2/3 rounded bg-[var(--color-skeleton)]" />
          </div>
          <div className="flex gap-3">
            <div className="h-4 w-16 rounded bg-[var(--color-skeleton)]" />
            <div className="h-4 w-12 rounded bg-[var(--color-skeleton)]" />
            <div className="h-4 w-10 rounded bg-[var(--color-skeleton)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
