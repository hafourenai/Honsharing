export default function DateDivider({ date }: { date: string }) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-honey-border rounded-md px-3 py-1">
        <span className="text-[11px] font-medium text-honey-text-muted">{date}</span>
      </div>
    </div>
  )
}
