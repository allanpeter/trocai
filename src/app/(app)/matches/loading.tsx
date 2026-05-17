export default function MatchesLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-cream-200 rounded-lg mb-6" />
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-9 w-20 bg-cream-200 rounded-full" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4">
            <div className="size-12 rounded-full bg-cream-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-cream-200 rounded" />
              <div className="h-3 w-24 bg-cream-200 rounded" />
            </div>
            <div className="h-9 w-24 bg-cream-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
