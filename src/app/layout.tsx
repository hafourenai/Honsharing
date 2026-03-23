import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Honey — Teman Curhat",
  description: "2am di kamar yang gelap, tapi ada satu lilin menyala.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.variable} bg-honey-bg-outer text-honey-text-primary h-screen w-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
