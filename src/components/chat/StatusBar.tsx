"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Battery, Wifi, Signal } from "lucide-react"

export default function StatusBar() {
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex w-full items-center justify-between px-6 py-3 text-[13px] font-medium text-honey-text-primary z-50">
      <div className="flex w-[54px] justify-center text-center">
        {time ? format(time, "HH:mm") : "--:--"}
      </div>
      <div className="flex items-center gap-2">
        <Signal className="h-4 w-4" />
        <Wifi className="h-4 w-4" />
        <Battery className="h-5 w-5" />
      </div>
    </div>
  )
}
