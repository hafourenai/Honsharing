import type { Metadata } from "next"
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500"],
})

export const metadata: Metadata = {
  title: "Honey — Teman Curhat",
  description: "2am di kamar yang gelap, tapi ada satu lilin menyala.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${playfair.variable} ${jakarta.variable} bg-honey-bg-outer text-honey-text-primary h-screen w-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
