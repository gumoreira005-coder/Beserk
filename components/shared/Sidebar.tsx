"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Timer, BarChart2, Sword, Settings, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/focus", label: "Foco", icon: Timer },
  { href: "/dashboard/stats", label: "Atributos", icon: BarChart2 },
  { href: "/dashboard/challenges", label: "Desafios", icon: Sword },
  { href: "/dashboard/settings", label: "Perfil", icon: UserCircle },
  { href: "/dashboard/config", label: "Configurações", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [userName, setUserName] = useState("Guerreiro")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("berserk_user")
      if (stored) {
        const user = JSON.parse(stored) as { name: string }
        if (user.name) setUserName(user.name)
      }
    } catch {}
  }, [])

  return (
    <aside className="w-56 border-r border-border bg-card flex flex-col shrink-0 min-h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-border">
        <span className="font-heading text-lg font-black tracking-[0.2em] uppercase text-foreground">
          Berserk
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary/10 text-foreground font-medium border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("w-4 h-4 shrink-0", active ? "text-primary" : "text-muted-foreground")}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-black font-heading shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-accent truncate font-heading">Nível 7</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
