"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export default function PhoneShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center p-0 md:bg-black/60 md:p-4 lg:p-0 backdrop-blur-sm overflow-hidden">
      <div 
        className={cn(
          "relative flex h-full w-full overflow-hidden bg-honey-bg-outer shadow-2xl",
          // Mobile 
          "max-w-[380px] sm:max-w-full sm:rounded-none",
          // Tablet 
          "md:h-full md:w-full md:max-w-full md:rounded-[24px] md:border md:border-[#2a2040]",
          "lg:h-screen lg:w-screen lg:rounded-none lg:border-none",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

