export default function DateDivider({ date }: { date: string }) {
  return (
    <div className="my-6 flex w-full items-center justify-center">
      <div className="rounded-full bg-[#13102099] px-3 py-1 text-[10px] uppercase tracking-wider text-honey-text-ghost">
        {date}
      </div>
    </div>
  )
}
