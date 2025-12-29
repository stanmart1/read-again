export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-muted rounded-full"></div>
      </div>
      <div className="h-8 bg-muted rounded w-20 mb-2"></div>
      <div className="h-4 bg-muted rounded w-24"></div>
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-64 bg-muted"></div>
      <div className="p-4">
        <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
        <div className="h-2 bg-muted rounded w-full mb-2"></div>
        <div className="h-4 bg-muted rounded w-16 mb-4"></div>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-muted rounded-lg"></div>
          <div className="w-10 h-10 bg-muted rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="bg-muted px-6 py-4 border-b">
        <div className="flex gap-8">
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-4 bg-muted rounded w-32"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-16 bg-muted rounded"></div>
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className="relative pl-16 animate-pulse">
      <div className="absolute left-0 w-12 h-12 bg-muted rounded-full"></div>
      <div className="bg-card rounded-xl shadow-md p-6">
        <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-full"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-card rounded-xl shadow-md overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-muted px-6 py-4 border-b">
          <div className="flex gap-4">
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
        </div>
        {/* Rows */}
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-6 py-4 border-b">
            <div className="flex gap-4">
              <div className="h-4 bg-muted rounded w-32"></div>
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
