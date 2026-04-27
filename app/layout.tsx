import type { Metadata } from "next"
import type { ReactNode } from "react"
import "./globals.css"
import { Inter, Space_Grotesk, Rajdhani } from "next/font/google"
import { MusicPlayer } from "@/components/shared/MusicPlayer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" })
const rajdhani = Rajdhani({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-game" })

export const metadata: Metadata = {
  title: "Berserk App",
  description: "Forge your will. Conquer your limits.",
}

const themeInitScript = `
try {
  var t = JSON.parse(localStorage.getItem('berserk_theme') || '{}');
  if (t.mode === 'light') document.documentElement.setAttribute('data-theme', 'light');
  document.documentElement.setAttribute('data-accent', t.accent || 'red');
} catch(e) {}
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${space.variable} ${rajdhani.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <MusicPlayer />
      </body>
    </html>
  )
}
