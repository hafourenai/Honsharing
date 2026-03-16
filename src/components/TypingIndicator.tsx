export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
        🍯
      </div>
      <div className="px-4 py-3 bg-white/95 rounded-3xl rounded-bl-lg shadow-sm border border-amber-100">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{ animation: `dotBounce 1.2s ease infinite ${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
