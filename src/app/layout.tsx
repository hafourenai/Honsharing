import type { Metadata } from "next"
import { Outfit, Playfair_Display } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Honey | Teman Curhat",
  description: "2am di kamar yang gelap, tapi ada satu lilin menyala.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${outfit.variable} ${playfair.variable} bg-honey-bg text-honey-text-primary antialiased font-outfit h-screen w-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  )
}
