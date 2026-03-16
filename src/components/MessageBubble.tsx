import { Message } from "@/types"

interface Props {
  message: Message
  isNew?: boolean
}

export default function MessageBubble({ message, isNew }: Props) {
  const isUser = message.role === "user"

  return (
    <div
      className={`flex items-end gap-2 mb-4 ${isUser ? "justify-end" : "justify-start"}`}
      style={isNew ? { animation: "fadeSlideIn 0.3s ease forwards" } : {}}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-sm flex-shrink-0 mb-1 shadow-sm">
          🍯
        </div>
      )}
      <div
        className={`px-4 py-3 text-sm leading-relaxed max-w-[75%] ${
          isUser
            ? "bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-3xl rounded-br-lg shadow-md"
            : "bg-white/95 text-slate-700 rounded-3xl rounded-bl-lg shadow-sm border border-amber-100"
        }`}
      >
        {message.content}
      </div>
    </div>
  )
}
