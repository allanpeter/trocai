export default function AlbumLoading() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 space-y-3">
        <div className="h-8 w-64 bg-cream-200 rounded-lg" />
        <div className="h-4 w-40 bg-cream-200 rounded" />
        <div className="h-3 w-full bg-cream-200 rounded-full" />
      </div>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-9 w-20 bg-cream-200 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-cream-200 rounded-[14px]" />
        ))}
      </div>
    </div>
  )
}
