import type { Metadata } from "next"
import "./globals.css"
import { Inter, Space_Grotesk, Rajdhani } from "next/font/google"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" })
const rajdhani = Rajdhani({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-game" })

export const metadata: Metadata = {
  title: "Berserk App",
  description: "Forge your will. Conquer your limits.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${space.variable} ${rajdhani.variable}`}>
      <body className="bg-void text-steel antialiased">
        {children}
      </body>
    </html>
  )
}
