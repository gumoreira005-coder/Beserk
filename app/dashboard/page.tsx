"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/shared/Navbar"
import { Sidebar } from "@/components/shared/Sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HexRadarChart } from "@/components/charts/HexRadarChart"
import { Sword, Target, Flame, Clock } from "lucide-react"

const stats = [
  { label: "Sessões Hoje", value: "4", icon: Target, delta: "+2 vs ontem" },
  { label: "Foco Total", value: "3h 20m", icon: Clock, delta: "+45m vs ontem" },
  { label: "Sequência", value: "7 dias", icon: Flame, delta: "+1 dia" },
  { label: "Desafios", value: "12", icon: Sword, delta: "+3 esta semana" },
]

const recentActivity = [
  { time: "14:30", action: "Sessão de Foco — 25min" },
  { time: "12:15", action: "Treino Completado" },
  { time: "10:00", action: "Leitura — 30min" },
  { time: "08:45", action: "Revisão de Metas" },
  { time: "07:30", action: "Meditação — 10min" },
]

export default function DashboardPage() {
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
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6">
          {/* Page header */}
          <div>
            <h1 className="font-heading text-2xl font-black tracking-[0.15em] uppercase text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Bem-vindo de volta, <span className="text-accent">{userName}</span>.
            </p>
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
                <HexRadarChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="font-heading tracking-[0.15em] uppercase text-sm text-muted-foreground">
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((item) => (
                    <div key={item.time} className="flex items-start gap-3">
                      <span className="text-xs text-muted-foreground font-mono w-10 shrink-0 pt-0.5">
                        {item.time}
                      </span>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="text-sm text-foreground leading-tight">{item.action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
