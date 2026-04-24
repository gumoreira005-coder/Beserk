"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { HexRadarChart } from "@/components/charts/HexRadarChart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Shield, Zap, Clock, Target, Timer, BookOpen,
  Star, ShieldCheck, Sword, Map, Eye, Flame,
} from "lucide-react";

// Score por posição da opção escolhida (pior → melhor)
const OPTION_SCORES = [30, 60, 85];

const MOCK_SCORES = [30, 60, 85, 60, 60, 85, 85, 60, 85, 85, 85, 60];

const ATTRIBUTES = [
  { id: 1,  name: "Disciplina",      icon: Shield,      options: ["Falta de disciplina", "Falta de foco", "Procrastinação"] },
  { id: 2,  name: "Energia",         icon: Zap,         options: ["Sempre exausto", "Energia instável", "Focado, mas sem rumo"] },
  { id: 3,  name: "Rotina",          icon: Clock,       options: ["Caótica e sem controle", "Inconsistente", "Estável, mas estagnada"] },
  { id: 4,  name: "Foco",            icon: Target,      options: ["Produtividade e foco", "Saúde e energia", "Propósito e direção"] },
  { id: 5,  name: "Tempo",           icon: Timer,       options: ["Menos de 1 hora", "1 a 3 horas", "Mais de 3 horas"] },
  { id: 6,  name: "Hábitos",         icon: BookOpen,    options: ["Exercício físico regular", "Leitura e aprendizado", "Meditação e concentração"] },
  { id: 7,  name: "Propósito",       icon: Star,        options: ["Necessidade de provar algo", "Visão de quem quero ser", "Compromisso com quem amo"] },
  { id: 8,  name: "Resiliência",     icon: ShieldCheck, options: ["Fico paralisado por um tempo", "Analiso e recomeço", "Ignoro e sigo em frente"] },
  { id: 9,  name: "Força",           icon: Sword,       options: ["Resiliência", "Criatividade", "Determinação brutal"] },
  { id: 10, name: "Missão",          icon: Map,         options: ["Construir disciplina sólida", "Alcançar uma meta específica", "Transformar minha rotina"] },
  { id: 11, name: "Visão",           icon: Eye,         options: ["Liberdade financeira", "Saúde e vitalidade plena", "Impacto e legado duradouro"] },
  { id: 12, name: "Comprometimento", icon: Flame,       options: ["Conforto e entretenimento", "Horas de sono e descanso", "Relações que me drenam"] },
];

const MOCK_HISTORY = [
  { week: "Sem 1", score: 48 },
  { week: "Sem 2", score: 52 },
  { week: "Sem 3", score: 57 },
  { week: "Sem 4", score: 61 },
  { week: "Sem 5", score: 67 },
  { week: "Atual", score: 72 },
];

function getWarriorClass(avg: number) {
  if (avg >= 80) return { label: "Lenda",     color: "text-gold",    level: 10 };
  if (avg >= 65) return { label: "Veterano",  color: "text-gold",    level: 7  };
  if (avg >= 45) return { label: "Guerreiro", color: "text-berserk", level: 4  };
  return              { label: "Iniciante",  color: "text-iron",    level: 1  };
}

function getBarColor(value: number) {
  if (value >= 70) return "bg-gold";
  if (value >= 40) return "bg-yellow-600";
  return "bg-berserk";
}

export default function StatsPage() {
  const [scores, setScores] = useState<number[]>(MOCK_SCORES);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("berserk_onboarding");
      if (!raw) return;
      const saved: Record<string, string> = JSON.parse(raw);
      const computed = ATTRIBUTES.map((attr, i) => {
        const answer = saved[attr.id];
        if (!answer) return MOCK_SCORES[i];
        const idx = attr.options.indexOf(answer);
        return idx >= 0 ? OPTION_SCORES[idx] : MOCK_SCORES[i];
      });
      setScores(computed);
    } catch {}
  }, []);

  const radarData = ATTRIBUTES.map((attr, i) => ({
    attribute: attr.name,
    value: scores[i],
  }));

  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const warrior = getWarriorClass(avg);
  const circumference = 2 * Math.PI * 60;

  return (
    <div className="min-h-screen bg-void flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6">

          {/* ── Header ──────────────────────────────────────────────── */}
          <div>
            <h1 className="font-titles text-2xl font-bold tracking-[0.15em] uppercase text-steel">
              Atributos
            </h1>
            <p className="text-iron text-sm mt-1">
              Seu perfil de guerreiro baseado no diagnóstico inicial.
            </p>
          </div>

          {/* ── Seção 1: Radar + Score Geral ────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Radar */}
            <div className="bg-surface border border-[#2A2A4A] rounded-xl p-6">
              <p className="text-iron text-xs font-game uppercase tracking-widest mb-4">
                Mapa de Atributos
              </p>
              <HexRadarChart data={radarData} />
            </div>

            {/* Score Geral */}
            <div className="bg-surface border border-[#2A2A4A] rounded-xl p-6 flex flex-col">
              <p className="text-iron text-xs font-game uppercase tracking-widest mb-6">
                Score Geral
              </p>

              {/* Circular progress */}
              <div className="flex flex-col items-center justify-center flex-1 gap-5">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 140 140" className="-rotate-90 w-full h-full">
                    <circle
                      cx="70" cy="70" r="60"
                      fill="none" stroke="#2A2A4A" strokeWidth="10"
                    />
                    <circle
                      cx="70" cy="70" r="60"
                      fill="none" stroke="#C0392B" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (1 - avg / 100)}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-titles text-4xl font-bold text-steel leading-none">
                      {avg}
                    </span>
                    <span className="text-iron text-xs mt-0.5">/100</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className={`font-titles text-2xl font-bold tracking-[0.2em] uppercase ${warrior.color}`}>
                    {warrior.label}
                  </p>
                  <p className="text-iron text-sm mt-1 font-game">
                    Nível {warrior.level}
                  </p>
                </div>
              </div>

              {/* Mini counters */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-void rounded-lg p-3 text-center">
                  <p className="text-gold font-titles font-bold text-xl leading-none">
                    {scores.filter((s) => s >= 70).length}
                  </p>
                  <p className="text-iron text-xs mt-1">Fortes</p>
                </div>
                <div className="bg-void rounded-lg p-3 text-center">
                  <p className="text-yellow-500 font-titles font-bold text-xl leading-none">
                    {scores.filter((s) => s >= 40 && s < 70).length}
                  </p>
                  <p className="text-iron text-xs mt-1">Médios</p>
                </div>
                <div className="bg-void rounded-lg p-3 text-center">
                  <p className="text-berserk font-titles font-bold text-xl leading-none">
                    {scores.filter((s) => s < 40).length}
                  </p>
                  <p className="text-iron text-xs mt-1">Fracos</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Seção 2: Barras de Progresso ────────────────────────── */}
          <div className="bg-surface border border-[#2A2A4A] rounded-xl p-6">
            <p className="text-iron text-xs font-game uppercase tracking-widest mb-6">
              Detalhamento por Atributo
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
              {ATTRIBUTES.map((attr, i) => {
                const score = scores[i];
                const Icon = attr.icon;
                return (
                  <div key={attr.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-iron shrink-0" />
                        <span className="text-steel text-sm font-medium">
                          {attr.name}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-game font-bold ${
                          score >= 70 ? "text-gold" : score >= 40 ? "text-yellow-500" : "text-berserk"
                        }`}
                      >
                        {score}/100
                      </span>
                    </div>
                    <div className="h-1.5 bg-void rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Seção 3: Histórico de Evolução ──────────────────────── */}
          <div className="bg-surface border border-[#2A2A4A] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-iron text-xs font-game uppercase tracking-widest">
                Histórico de Evolução
              </p>
              <span className="text-xs text-iron bg-void px-2 py-1 rounded-md font-game">
                Últimas 6 semanas
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MOCK_HISTORY} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#2A2A4A" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#95A5A6", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#95A5A6", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1A1A2E",
                    border: "1px solid #2A2A4A",
                    borderRadius: "8px",
                    color: "#ECF0F1",
                    fontSize: "12px",
                  }}
                  formatter={(v: number) => [`${v}/100`, "Score Médio"]}
                  cursor={{ stroke: "#2A2A4A" }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#C0392B"
                  strokeWidth={2}
                  dot={{ fill: "#F39C12", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#F39C12", strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </main>
      </div>
    </div>
  );
}
