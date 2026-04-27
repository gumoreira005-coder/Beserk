"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const router = useRouter()
  const [userName, setUserName] = useState("Guerreiro")
  const [avatar, setAvatar] = useState("")
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  function loadUser() {
    try {
      const stored = localStorage.getItem("berserk_user")
      if (stored) {
        const user = JSON.parse(stored) as { name: string; nickname?: string; avatar?: string }
        setUserName(user.nickname || user.name || "Guerreiro")
        setAvatar(user.avatar || "")
      }
    } catch {}
  }

  useEffect(() => {
    loadUser()
    window.addEventListener("berserk_user_updated", loadUser)
    return () => window.removeEventListener("berserk_user_updated", loadUser)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleLogout() {
    // Remove only the session — progress data is preserved
    localStorage.removeItem("berserk_user")
    localStorage.removeItem("berserk_onboarding")
    router.push("/auth")
  }

  const initial = userName.charAt(0).toUpperCase()

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-48"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="w-4 h-4" />
        </Button>

        {/* Avatar com dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-black font-heading hover:opacity-80 transition-opacity overflow-hidden"
          >
            {avatar
              ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              : initial
            }
          </button>

          {open && (
            <div className="absolute right-0 top-10 w-52 bg-surface border border-[#2A2A4A] rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Info do usuário */}
              <div className="px-4 py-3 border-b border-[#2A2A4A]">
                <p className="text-steel text-sm font-medium truncate">{userName}</p>
                <p className="text-iron text-xs mt-0.5 font-game">Guerreiro Berserk</p>
              </div>
              {/* Ações */}
              <div className="p-1">
                <button
                  onClick={() => { setOpen(false); router.push("/dashboard/settings") }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-iron hover:text-steel hover:bg-void text-sm transition-colors"
                >
                  <User className="w-4 h-4" />
                  Ver Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-berserk hover:bg-berserk/10 text-sm transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
