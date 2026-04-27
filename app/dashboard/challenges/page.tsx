"use client";

import { useState, useEffect, type ElementType } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { CheckCircle2, Circle, Lock, Flame, Sword, Brain, Dumbbell, Clock, Star, Play, Plus } from "lucide-react";
import {
  loadProgress, startChallenge, markChallengeDay, isChallengeUnlocked,
  UPDATE_EVENT, type GameProgress, type ChallengeState,
} from "@/lib/gameData";
import { playAchievement, playClick, playSuccess } from "@/lib/sounds";

type Difficulty = "Iniciante" | "Guerreiro" | "Lenda";
type Category = "Mente" | "Corpo" | "Disciplina" | "Foco" | "Missão";

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  xp: number;
  days?: number;
}

const CHALLENGES: Challenge[] = [
  { id: 1,  title: "Leitura Diária",        description: "Leia 20 minutos por dia durante 7 dias seguidos.",           category: "Mente",      difficulty: "Iniciante", xp: 150,  days: 7  },
  { id: 2,  title: "Diário de Reflexão",     description: "Escreva 3 aprendizados do dia antes de dormir por 5 dias.", category: "Mente",      difficulty: "Iniciante", xp: 120,  days: 5  },
  { id: 3,  title: "Aprendizado Intensivo",  description: "Conclua 1 curso ou livro técnico em 30 dias.",              category: "Mente",      difficulty: "Guerreiro", xp: 500,  days: 30 },
  { id: 4,  title: "7 Dias de Movimento",    description: "Faça 30 min de exercício por 7 dias consecutivos.",         category: "Corpo",      difficulty: "Iniciante", xp: 200,  days: 7  },
  { id: 5,  title: "Acordar às 5h",          description: "Acorde às 5h da manhã por 5 dias seguidos.",                category: "Corpo",      difficulty: "Guerreiro", xp: 350,  days: 5  },
  { id: 6,  title: "30 Dias Sem Açúcar",     description: "Elimine açúcar refinado da dieta por 30 dias completos.",   category: "Corpo",      difficulty: "Lenda",     xp: 1000, days: 30 },
  { id: 7,  title: "Rotina Matinal",         description: "Execute sua rotina matinal completa por 14 dias seguidos.", category: "Disciplina", difficulty: "Guerreiro", xp: 400,  days: 14 },
  { id: 8,  title: "Sem Redes Sociais",      description: "Fique 3 dias sem acessar redes sociais.",                   category: "Disciplina", difficulty: "Guerreiro", xp: 300,  days: 3  },
  { id: 9,  title: "100 Dias de Hábito",     description: "Mantenha qualquer hábito por 100 dias consecutivos.",       category: "Disciplina", difficulty: "Lenda",     xp: 2000, days: 100},
  { id: 10, title: "Bloco de Foco Profundo", description: "Complete 4 sessões Pomodoro sem interrupção em um dia.",    category: "Foco",       difficulty: "Iniciante", xp: 100,  days: 1  },
  { id: 11, title: "Semana de Flow",         description: "Complete metas diárias de foco por 7 dias seguidos.",       category: "Foco",       difficulty: "Guerreiro", xp: 450,  days: 7  },
  { id: 12, title: "Missão Impossível",      description: "Trabalhe em seu projeto principal por 4h/dia por 21 dias.", category: "Missão",     difficulty: "Lenda",     xp: 1500, days: 21 },
];

const CATEGORY_ICONS: Record<Category, ElementType> = {
  Mente: Brain, Corpo: Dumbbell, Disciplina: Flame, Foco: Clock, Missão: Star,
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Iniciante: "text-iron border-iron/30 bg-iron/10",
  Guerreiro: "text-berserk border-berserk/30 bg-berserk/10",
  Lenda:     "text-gold border-gold/30 bg-gold/10",
};

const CATEGORIES: Category[] = ["Mente", "Corpo", "Disciplina", "Foco", "Missão"];

export default function ChallengesPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "Todos">("Todos");
  const [progress, setProgress] = useState<GameProgress | null>(null);

  function refresh() { setProgress(loadProgress()); }

  useEffect(() => {
    refresh();
    window.addEventListener(UPDATE_EVENT, refresh);
    return () => window.removeEventListener(UPDATE_EVENT, refresh);
  }, []);

  if (!progress) return null;

  function getState(id: number): ChallengeState {
    const saved = progress!.challenges[String(id)];
    const c = CHALLENGES.find((ch) => ch.id === id)!;
    if (saved) return saved;
    const unlocked = isChallengeUnlocked(c.difficulty, progress!.level);
    return { status: unlocked ? "disponivel" : "bloqueado", daysCompleted: 0 };
  }

  const allWithState = CHALLENGES.map((c) => ({ ...c, state: getState(c.id) }));
  const filtered = activeCategory === "Todos"
    ? allWithState
    : allWithState.filter((c) => c.category === activeCategory);

  const concluido = allWithState.filter((c) => c.state.status === "concluido").length;
  const emProgresso = allWithState.filter((c) => c.state.status === "em_progresso").length;
  const totalXP = allWithState
    .filter((c) => c.state.status === "concluido")
    .reduce((sum, c) => sum + c.xp, 0);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6">

          <div>
            <h1 className="font-heading text-2xl font-black tracking-[0.15em] uppercase text-foreground">Desafios</h1>
            <p className="text-muted-foreground text-sm mt-1">Forje sua vontade. Conquiste seus limites.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total", value: CHALLENGES.length, color: "text-foreground" },
              { label: "Concluídos", value: concluido, color: "text-accent" },
              { label: "Em Progresso", value: emProgresso, color: "text-primary" },
              { label: "XP Ganho", value: totalXP.toLocaleString(), color: "text-accent" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-muted-foreground text-xs font-heading uppercase tracking-widest mb-2">{s.label}</p>
                <p className={`font-heading text-3xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {(["Todos", ...CATEGORIES] as const).map((cat) => {
              const Icon = cat === "Todos" ? Sword : CATEGORY_ICONS[cat as Category];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat as Category | "Todos"); playClick(); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading border transition-all ${
                    isActive
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Challenge grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((challenge) => {
              const Icon = CATEGORY_ICONS[challenge.category];
              const { state } = challenge;
              const days = challenge.days ?? 1;
              const pct = days > 0 ? (state.daysCompleted / days) * 100 : 0;

              const cardCls = {
                concluido:    "border-accent/40 bg-accent/5",
                em_progresso: "border-primary/40 bg-primary/5",
                disponivel:   "border-border bg-card",
                bloqueado:    "border-border bg-card opacity-50",
              }[state.status];

              return (
                <div key={challenge.id} className={`border rounded-xl p-5 flex flex-col gap-3 transition-all ${cardCls}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium leading-tight">{challenge.title}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{challenge.category}</p>
                      </div>
                    </div>
                    {state.status === "concluido"    && <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />}
                    {state.status === "em_progresso" && <Flame        className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
                    {state.status === "bloqueado"    && <Lock         className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />}
                    {state.status === "disponivel"   && <Circle       className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />}
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed">{challenge.description}</p>

                  {/* Progress bar */}
                  {state.status === "em_progresso" && (
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progresso</span>
                        <span className="text-primary font-heading font-bold">
                          {state.daysCompleted}/{days} dias
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Footer / Actions */}
                  <div className="flex items-center justify-between mt-auto pt-1 gap-2">
                    <span className={`text-xs font-heading border rounded-md px-2 py-0.5 ${DIFFICULTY_COLORS[challenge.difficulty]}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs font-heading text-accent font-bold">+{challenge.xp} XP</span>

                    {state.status === "disponivel" && (
                      <button
                        onClick={() => { startChallenge({ id: challenge.id, title: challenge.title, xp: challenge.xp, days }); playClick(); }}
                        className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity font-heading"
                      >
                        <Play className="w-3 h-3" /> Iniciar
                      </button>
                    )}
                    {state.status === "em_progresso" && (
                      <button
                        onClick={() => {
                          markChallengeDay({ id: challenge.id, title: challenge.title, xp: challenge.xp, days });
                          const newDays = state.daysCompleted + 1;
                          if (newDays >= days) playAchievement(); else playSuccess();
                        }}
                        className="flex items-center gap-1 text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity font-heading"
                      >
                        <Plus className="w-3 h-3" /> Dia {state.daysCompleted + 1}
                      </button>
                    )}
                    {state.status === "bloqueado" && (
                      <span className="text-xs text-muted-foreground font-heading">Nível {challenge.difficulty === "Guerreiro" ? 2 : 4}+</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
