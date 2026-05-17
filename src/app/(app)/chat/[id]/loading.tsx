export default function ChatLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-pulse">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-cream-300">
        <div className="size-10 rounded-full bg-cream-200" />
        <div className="space-y-1.5">
          <div className="h-4 w-32 bg-cream-200 rounded" />
          <div className="h-3 w-20 bg-cream-200 rounded" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        {[120, 180, 100, 200, 140, 160].map((w, i) => (
          <div
            key={i}
            className={`h-10 bg-cream-200 rounded-2xl ${i % 2 === 0 ? 'self-start' : 'self-end'}`}
            style={{ width: w }}
          />
        ))}
      </div>
      <div className="mt-4 h-12 bg-cream-200 rounded-2xl" />
    </div>
  )
}
