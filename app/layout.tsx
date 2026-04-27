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
  var _t = JSON.parse(localStorage.getItem('berserk_theme') || '{}');
  var _h = document.documentElement;
  var _light = {
    '--background':'248 249 250','--foreground':'26 26 46','--card':'255 255 255',
    '--card-foreground':'26 26 46','--popover':'255 255 255','--popover-foreground':'26 26 46',
    '--primary-foreground':'255 255 255','--secondary':'233 236 239','--secondary-foreground':'26 26 46',
    '--muted':'233 236 239','--muted-foreground':'108 117 125','--accent':'243 156 18',
    '--accent-foreground':'255 255 255','--destructive':'220 53 69','--destructive-foreground':'255 255 255',
    '--border':'222 226 230','--input':'233 236 239','--void':'248 249 250','--surface':'255 255 255',
    '--steel':'26 26 46','--iron':'108 117 125','--gold':'243 156 18','--blood':'220 53 69'
  };
  var _dark = {
    '--background':'10 10 15','--foreground':'236 240 241','--card':'26 26 46',
    '--card-foreground':'236 240 241','--popover':'26 26 46','--popover-foreground':'236 240 241',
    '--primary-foreground':'236 240 241','--secondary':'22 22 42','--secondary-foreground':'236 240 241',
    '--muted':'22 22 42','--muted-foreground':'149 165 166','--accent':'243 156 18',
    '--accent-foreground':'10 10 15','--destructive':'231 76 60','--destructive-foreground':'236 240 241',
    '--border':'42 42 74','--input':'22 22 42','--void':'10 10 15','--surface':'26 26 46',
    '--steel':'236 240 241','--iron':'149 165 166','--gold':'243 156 18','--blood':'231 76 60'
  };
  var _accents = {
    red:{'--primary':'192 57 43','--ring':'192 57 43','--berserk':'192 57 43'},
    blue:{'--primary':'41 128 185','--ring':'41 128 185','--berserk':'41 128 185'},
    green:{'--primary':'39 174 96','--ring':'39 174 96','--berserk':'39 174 96'},
    purple:{'--primary':'142 68 173','--ring':'142 68 173','--berserk':'142 68 173'}
  };
  var _mv = _t.mode === 'light' ? _light : _dark;
  var _av = _accents[_t.accent || 'red'] || _accents.red;
  var _vars = Object.assign({}, _mv, _av);
  Object.keys(_vars).forEach(function(k){ _h.style.setProperty(k, _vars[k]); });
  _h.setAttribute('data-theme', _t.mode === 'light' ? 'light' : 'dark');
  _h.setAttribute('data-accent', _t.accent || 'red');
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
