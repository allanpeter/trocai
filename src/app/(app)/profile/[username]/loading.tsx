export default function ProfileLoading() {
  return (
    <div className="animate-pulse max-w-2xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="size-20 rounded-full bg-cream-200 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-6 w-40 bg-cream-200 rounded-lg" />
          <div className="h-4 w-28 bg-cream-200 rounded" />
          <div className="h-4 w-56 bg-cream-200 rounded" />
        </div>
      </div>
      <div className="flex gap-6 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-1">
            <div className="h-6 w-10 bg-cream-200 rounded" />
            <div className="h-3 w-16 bg-cream-200 rounded" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-5 space-y-3">
        <div className="h-5 w-32 bg-cream-200 rounded" />
        <div className="h-3 w-full bg-cream-200 rounded-full" />
        <div className="flex gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-4 w-20 bg-cream-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
