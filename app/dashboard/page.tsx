"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/shared/Navbar"
import { Sidebar } from "@/components/shared/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HexRadarChart } from "@/components/charts/HexRadarChart"
import { Sword, Target, Flame, Clock, Star } from "lucide-react"
import {
  loadProgress, fmtMinutes, ATTRIBUTE_NAMES, UPDATE_EVENT,
  type GameProgress, type ActivityEntry,
} from "@/lib/gameData"

function buildRadarData(p: GameProgress) {
  return ATTRIBUTE_NAMES.map((name) => ({ attribute: name, value: p.attributes[name] }))
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("Guerreiro")
  const [progress, setProgress] = useState<GameProgress | null>(null)

  function refresh() {
    setProgress(loadProgress())
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("berserk_user")
      if (stored) {
        const user = JSON.parse(stored) as { name: string; nickname?: string }
        setUserName(user.nickname || user.name || "Guerreiro")
      }
    } catch {}
    refresh()
    window.addEventListener(UPDATE_EVENT, refresh)
    return () => window.removeEventListener(UPDATE_EVENT, refresh)
  }, [])

  if (!progress) return null

  const challengesDone = Object.values(progress.challenges).filter(
    (c) => (c as { status: string }).status === "concluido"
  ).length

  const stats = [
    {
      label: "Sessões Hoje",
      value: String(progress.sessionsToday),
      icon: Target,
      delta: `${progress.focusMinutesToday}min hoje`,
    },
    {
      label: "Foco Total",
      value: fmtMinutes(progress.focusMinutesTotal),
      icon: Clock,
      delta: `${progress.sessionsToday} sessão(ões) hoje`,
    },
    {
      label: "Sequência",
      value: `${progress.streak} dia${progress.streak !== 1 ? "s" : ""}`,
      icon: Flame,
      delta: progress.streak > 0 ? "🔥 Continue!" : "Comece hoje",
    },
    {
      label: "Desafios",
      value: String(challengesDone),
      icon: Sword,
      delta: `Nível ${progress.level} · ${progress.xp} XP`,
    },
  ]

  const radarData = buildRadarData(progress)
  const _todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6">
          {/* Page header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl font-black tracking-[0.15em] uppercase text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Bem-vindo de volta, <span className="text-accent font-bold">{userName}</span>.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-xs font-heading font-black text-foreground">
                Nível {progress.level}
              </span>
              <span className="text-xs text-muted-foreground">{progress.xp} XP</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground text-xs uppercase tracking-wider font-heading">
                      {stat.label}
                    </span>
                    <stat.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-2xl font-black font-heading text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-primary mt-1">{stat.delta}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="font-heading tracking-[0.15em] uppercase text-sm text-muted-foreground">
                  Perfil de Atributos
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center pt-4">
                <HexRadarChart data={radarData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-heading tracking-[0.15em] uppercase text-sm text-muted-foreground">
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {progress.activityLog.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm">Nenhuma atividade ainda.</p>
                    <p className="text-xs text-muted-foreground mt-1">Complete uma sessão de foco ou desafio!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {progress.activityLog.slice(0, 6).map((item: ActivityEntry) => (
                      <div key={item.id} className="flex items-start gap-3">
                        <span className="text-xs text-muted-foreground font-mono w-10 shrink-0 pt-0.5">
                          {item.time}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground leading-tight">{item.action}</span>
                          {item.xp > 0 && (
                            <span className="text-xs text-accent font-heading font-bold ml-2">+{item.xp} XP</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
