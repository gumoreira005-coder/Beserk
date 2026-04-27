"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { HexRadarChart } from "@/components/charts/HexRadarChart";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Shield, Zap, Clock, Target, Lightbulb, BookOpen,
  Star, ShieldCheck, Sword, DollarSign, Eye, Flame,
} from "lucide-react";
import {
  loadProgress, ATTRIBUTE_NAMES, UPDATE_EVENT,
  avgAttributes, xpForNextLevel,
  type GameProgress,
} from "@/lib/gameData";

const ATTR_ICONS: Record<string, typeof Shield> = {
  Foco: Target, Disciplina: Shield, Corpo: Zap, Resiliência: ShieldCheck,
  Estratégia: Sword, Criatividade: Lightbulb, Propósito: Star,
  Finanças: DollarSign, Aprendizado: BookOpen, Tempo: Clock,
  Conexões: Eye, Recuperação: Flame,
};

function getWarriorClass(level: number) {
  if (level >= 6) return { label: "Lenda",     color: "text-accent"   };
  if (level >= 4) return { label: "Veterano",  color: "text-accent"   };
  if (level >= 2) return { label: "Guerreiro", color: "text-primary"  };
  return              { label: "Iniciante",  color: "text-muted-foreground" };
}

function barColor(v: number) {
  if (v >= 70) return "bg-accent";
  if (v >= 40) return "bg-yellow-600";
  return "bg-primary";
}

export default function StatsPage() {
  const [progress, setProgress] = useState<GameProgress | null>(null);

  function refresh() { setProgress(loadProgress()); }

  useEffect(() => {
    refresh();
    window.addEventListener(UPDATE_EVENT, refresh);
    return () => window.removeEventListener(UPDATE_EVENT, refresh);
  }, []);

  if (!progress) return null;

  const attrs = progress.attributes;
  const avg = avgAttributes(attrs);
  const warrior = getWarriorClass(progress.level);
  const circumference = 2 * Math.PI * 60;
  const nextXP = xpForNextLevel(progress.level);
  const prevXP = progress.level > 1 ? xpForNextLevel(progress.level - 1) : 0;
  const xpPct = nextXP > prevXP
    ? Math.round(((progress.xp - prevXP) / (nextXP - prevXP)) * 100)
    : 100;

  const radarData = ATTRIBUTE_NAMES.map((name) => ({ attribute: name, value: attrs[name] }));
  const scores = ATTRIBUTE_NAMES.map((name) => attrs[name]);

  const historyData = progress.weeklyHistory.length >= 2
    ? progress.weeklyHistory
    : [...progress.weeklyHistory, { week: "Agora", score: avg }];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6">

          {/* Header */}
          <div>
            <h1 className="font-heading text-2xl font-black tracking-[0.15em] uppercase text-foreground">
              Atributos
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Seu perfil evolui a cada sessão de foco e desafio concluído.
            </p>
          </div>

          {/* Radar + Score geral */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <p className="text-muted-foreground text-xs font-heading uppercase tracking-widest mb-4">
                Mapa de Atributos
              </p>
              <HexRadarChart data={radarData} />
            </div>

            <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
              <p className="text-muted-foreground text-xs font-heading uppercase tracking-widest mb-6">
                Score Geral
              </p>

              <div className="flex flex-col items-center justify-center flex-1 gap-5">
                {/* Circular score */}
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 140 140" className="-rotate-90 w-full h-full">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
                    <circle
                      cx="70" cy="70" r="60" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - avg / 100)}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-heading text-4xl font-black text-foreground leading-none">{avg}</span>
                    <span className="text-muted-foreground text-xs mt-0.5">/100</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className={`font-heading text-2xl font-black tracking-[0.2em] uppercase ${warrior.color}`}>
                    {warrior.label}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1 font-heading">Nível {progress.level}</p>
                </div>

                {/* XP bar */}
                <div className="w-full">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span className="font-heading">{progress.xp} XP</span>
                    <span className="font-heading">{nextXP} XP</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(xpPct, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    Próximo nível: {nextXP - progress.xp} XP restantes
                  </p>
                </div>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: "Fortes",  count: scores.filter((s) => s >= 70).length, cls: "text-accent" },
                  { label: "Médios",  count: scores.filter((s) => s >= 40 && s < 70).length, cls: "text-yellow-500" },
                  { label: "Fracos",  count: scores.filter((s) => s < 40).length, cls: "text-primary" },
                ].map((item) => (
                  <div key={item.label} className="bg-secondary rounded-lg p-3 text-center">
                    <p className={`font-heading font-black text-xl leading-none ${item.cls}`}>{item.count}</p>
                    <p className="text-muted-foreground text-xs mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Attribute bars */}
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-muted-foreground text-xs font-heading uppercase tracking-widest mb-6">
              Detalhamento por Atributo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {ATTRIBUTE_NAMES.map((name) => {
                const score = attrs[name];
                const Icon = ATTR_ICONS[name] ?? Star;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground text-sm font-medium">{name}</span>
                      </div>
                      <span className={`text-xs font-heading font-bold ${score >= 70 ? "text-accent" : score >= 40 ? "text-yellow-500" : "text-primary"}`}>
                        {score}/100
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* History chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground text-xs font-heading uppercase tracking-widest">
                Histórico de Evolução
              </p>
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md font-heading">
                Score médio dos atributos
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historyData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--foreground))", fontSize: "12px" }}
                  formatter={(v) => [`${String(v)}/100`, "Score Médio"]}
                  cursor={{ stroke: "hsl(var(--border))" }}
                />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2}
                  dot={{ fill: "hsl(var(--accent))", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "hsl(var(--accent))", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </main>
      </div>
    </div>
  );
}
