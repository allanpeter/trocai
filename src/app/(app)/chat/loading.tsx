export default function ChatsListLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-40 bg-cream-200 rounded-lg mb-6" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-3">
            <div className="size-12 rounded-full bg-cream-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-36 bg-cream-200 rounded" />
              <div className="h-3 w-52 bg-cream-200 rounded" />
            </div>
            <div className="h-3 w-12 bg-cream-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
