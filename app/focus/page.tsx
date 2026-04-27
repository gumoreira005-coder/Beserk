"use client"

import { useState, useEffect, useCallback } from "react"
import { Navbar } from "@/components/shared/Navbar"
import { Sidebar } from "@/components/shared/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"
import { recordFocusSession } from "@/lib/gameData"
import { playFocusEnd, playFocusStart } from "@/lib/sounds"

const MODES = [
  { label: "Foco", duration: 25 * 60, strokeColor: "hsl(var(--primary))" },
  { label: "Pausa Curta", duration: 5 * 60, strokeColor: "hsl(var(--accent))" },
  { label: "Pausa Longa", duration: 15 * 60, strokeColor: "hsl(var(--muted-foreground))" },
]

const RADIUS = 120
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function FocusPage() {
  const [modeIndex, setModeIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(MODES[0].duration)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)

  const mode = MODES[modeIndex]

  const reset = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(MODES[modeIndex].duration)
  }, [modeIndex])

  function handleModeChange(index: number) {
    setModeIndex(index)
    setIsRunning(false)
    setTimeLeft(MODES[index].duration)
  }

  const skip = useCallback(() => {
    const next = (modeIndex + 1) % MODES.length
    if (modeIndex === 0) {
      setSessions((s: number) => s + 1)
      recordFocusSession(25)
      playFocusEnd()
    }
    handleModeChange(next)
  }, [modeIndex])

  useEffect(() => {
    reset()
  }, [modeIndex, reset])

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setTimeLeft((t: number) => {
        if (t <= 1) {
          clearInterval(interval)
          setIsRunning(false)
          if (modeIndex === 0) {
            setSessions((s: number) => s + 1)
            recordFocusSession(25)
            playFocusEnd()
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, modeIndex])

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const seconds = String(timeLeft % 60).padStart(2, "0")
  const progress = 1 - timeLeft / mode.duration
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 flex flex-col items-center justify-center gap-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-heading text-2xl font-black tracking-[0.2em] uppercase text-foreground">
              Modo Foco
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sessões completas hoje:{" "}
              <span className="text-accent font-bold font-heading">{sessions}</span>
            </p>
          </div>

          {/* Mode selector */}
          <div className="flex gap-1 p-1 bg-secondary rounded-lg">
            {MODES.map((m, i) => (
              <button
                key={m.label}
                onClick={() => handleModeChange(i)}
                className={`px-4 py-2 rounded-md text-xs font-heading tracking-widest uppercase transition-all ${
                  modeIndex === i
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* SVG Timer ring */}
          <div className="relative flex items-center justify-center select-none">
            <svg width="280" height="280" className="-rotate-90">
              <circle
                cx="140"
                cy="140"
                r={RADIUS}
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="4"
              />
              <circle
                cx="140"
                cy="140"
                r={RADIUS}
                fill="none"
                stroke={mode.strokeColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute text-center">
              <div className="font-heading text-6xl font-black text-foreground tabular-nums">
                {minutes}:{seconds}
              </div>
              <div className="text-muted-foreground text-xs tracking-[0.2em] uppercase mt-2 font-heading">
                {mode.label}
              </div>
            </div>
          </div>

          {/* Controls */}
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <Button variant="ghost" size="icon" onClick={reset} title="Reiniciar">
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                size="lg"
                className="w-36 font-heading tracking-widest uppercase"
                onClick={() => { setIsRunning((r: boolean) => { if (!r) playFocusStart(); return !r; }) }}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" /> Iniciar
                  </>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={skip} title="Pular">
                <SkipForward className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Session dots */}
          <div className="flex gap-2">
            {Array.from({ length: Math.max(sessions, 4) }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i < sessions ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
