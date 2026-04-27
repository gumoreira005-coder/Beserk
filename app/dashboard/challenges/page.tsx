"use client";

import { useState, type ElementType } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { CheckCircle2, Circle, Lock, Flame, Sword, Brain, Dumbbell, Clock, Star } from "lucide-react";

type Difficulty = "Iniciante" | "Guerreiro" | "Lenda";
type Status = "disponivel" | "em_progresso" | "concluido" | "bloqueado";
type Category = "Mente" | "Corpo" | "Disciplina" | "Foco" | "Missão";

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  xp: number;
  status: Status;
  days?: number;
  daysLeft?: number;
}

const CHALLENGES: Challenge[] = [
  // Mente
  { id: 1,  title: "Leitura Diária",         description: "Leia 20 minutos por dia durante 7 dias seguidos.",            category: "Mente",       difficulty: "Iniciante",  xp: 150,  status: "concluido"    },
  { id: 2,  title: "Diário de Reflexão",      description: "Escreva 3 aprendizados do dia antes de dormir por 5 dias.",  category: "Mente",       difficulty: "Iniciante",  xp: 120,  status: "em_progresso", days: 5, daysLeft: 2 },
  { id: 3,  title: "Aprendizado Intensivo",   description: "Conclua 1 curso ou livro técnico em 30 dias.",               category: "Mente",       difficulty: "Guerreiro",  xp: 500,  status: "disponivel"   },
  // Corpo
  { id: 4,  title: "7 Dias de Movimento",     description: "Faça 30 min de exercício por 7 dias consecutivos.",          category: "Corpo",       difficulty: "Iniciante",  xp: 200,  status: "concluido"    },
  { id: 5,  title: "Acordar às 5h",           description: "Acorde às 5h da manhã por 5 dias seguidos.",                 category: "Corpo",       difficulty: "Guerreiro",  xp: 350,  status: "em_progresso", days: 5, daysLeft: 3 },
  { id: 6,  title: "30 Dias Sem Açúcar",      description: "Elimine açúcar refinado da dieta por 30 dias completos.",    category: "Corpo",       difficulty: "Lenda",      xp: 1000, status: "bloqueado"    },
  // Disciplina
  { id: 7,  title: "Rotina Matinal",          description: "Execute sua rotina matinal completa por 14 dias seguidos.",  category: "Disciplina",  difficulty: "Guerreiro",  xp: 400,  status: "disponivel"   },
  { id: 8,  title: "Sem Redes Sociais",       description: "Fique 72 horas sem acessar redes sociais.",                  category: "Disciplina",  difficulty: "Guerreiro",  xp: 300,  status: "disponivel"   },
  { id: 9,  title: "100 Dias de Hábito",      description: "Mantenha qualquer hábito por 100 dias consecutivos.",        category: "Disciplina",  difficulty: "Lenda",      xp: 2000, status: "bloqueado"    },
  // Foco
  { id: 10, title: "Bloco de Foco Profundo",  description: "Complete 4 sessões Pomodoro sem interrupção em um dia.",     category: "Foco",        difficulty: "Iniciante",  xp: 100,  status: "concluido"    },
  { id: 11, title: "Semana de Flow",          description: "Complete metas diárias de foco por 7 dias seguidos.",        category: "Foco",        difficulty: "Guerreiro",  xp: 450,  status: "disponivel"   },
  { id: 12, title: "Missão Impossível",       description: "Trabalhe em seu projeto principal por 4h/dia por 21 dias.",  category: "Missão",      difficulty: "Lenda",      xp: 1500, status: "bloqueado"    },
];

const CATEGORY_ICONS: Record<Category, ElementType> = {
  Mente:      Brain,
  Corpo:      Dumbbell,
  Disciplina: Flame,
  Foco:       Clock,
  Missão:     Star,
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Iniciante:  "text-iron border-iron/30 bg-iron/10",
  Guerreiro:  "text-berserk border-berserk/30 bg-berserk/10",
  Lenda:      "text-gold border-gold/30 bg-gold/10",
};

const STATUS_COLORS: Record<Status, string> = {
  concluido:    "border-gold/40 bg-gold/5",
  em_progresso: "border-berserk/40 bg-berserk/5",
  disponivel:   "border-[#2A2A4A] bg-surface",
  bloqueado:    "border-[#2A2A4A] bg-surface opacity-50",
};

const CATEGORIES: Category[] = ["Mente", "Corpo", "Disciplina", "Foco", "Missão"];

export default function ChallengesPage() {
  const [activeCategory, setActiveCategory] = useState<Category | "Todos">("Todos");

  const filtered =
    activeCategory === "Todos"
      ? CHALLENGES
      : CHALLENGES.filter((c) => c.category === activeCategory);

  const total     = CHALLENGES.length;
  const concluido = CHALLENGES.filter((c) => c.status === "concluido").length;
  const progresso = CHALLENGES.filter((c) => c.status === "em_progresso").length;
  const totalXP   = CHALLENGES.filter((c) => c.status === "concluido").reduce((a, c) => a + c.xp, 0);

  return (
    <div className="min-h-screen bg-void flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6">

          {/* ── Header ──────────────────────────────────────────────── */}
          <div>
            <h1 className="font-titles text-2xl font-bold tracking-[0.15em] uppercase text-steel">
              Desafios
            </h1>
            <p className="text-iron text-sm mt-1">
              Forje sua vontade. Conquiste seus limites.
            </p>
          </div>

          {/* ── Stats ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface border border-[#2A2A4A] rounded-xl p-4">
              <p className="text-iron text-xs font-game uppercase tracking-widest mb-2">Total</p>
              <p className="font-titles text-3xl font-bold text-steel">{total}</p>
            </div>
            <div className="bg-surface border border-[#2A2A4A] rounded-xl p-4">
              <p className="text-iron text-xs font-game uppercase tracking-widest mb-2">Concluídos</p>
              <p className="font-titles text-3xl font-bold text-gold">{concluido}</p>
            </div>
            <div className="bg-surface border border-[#2A2A4A] rounded-xl p-4">
              <p className="text-iron text-xs font-game uppercase tracking-widest mb-2">Em Progresso</p>
              <p className="font-titles text-3xl font-bold text-berserk">{progresso}</p>
            </div>
            <div className="bg-surface border border-[#2A2A4A] rounded-xl p-4">
              <p className="text-iron text-xs font-game uppercase tracking-widest mb-2">XP Total</p>
              <p className="font-titles text-3xl font-bold text-gold">{totalXP.toLocaleString()}</p>
            </div>
          </div>

          {/* ── Filtros por categoria ────────────────────────────────── */}
          <div className="flex flex-wrap gap-2">
            {(["Todos", ...CATEGORIES] as const).map((cat) => {
              const Icon = cat === "Todos" ? Sword : CATEGORY_ICONS[cat as Category];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as Category | "Todos")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-game border transition-all ${
                    isActive
                      ? "bg-berserk border-berserk text-steel"
                      : "bg-surface border-[#2A2A4A] text-iron hover:border-berserk/50 hover:text-steel"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* ── Grid de Desafios ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((challenge) => {
              const Icon = CATEGORY_ICONS[challenge.category];
              return (
                <div
                  key={challenge.id}
                  className={`border rounded-xl p-5 flex flex-col gap-3 transition-all ${STATUS_COLORS[challenge.status]}`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-void flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-iron" />
                      </div>
                      <div>
                        <p className="text-steel text-sm font-medium leading-tight">{challenge.title}</p>
                        <p className="text-iron text-xs mt-0.5">{challenge.category}</p>
                      </div>
                    </div>

                    {/* Status icon */}
                    {challenge.status === "concluido" && (
                      <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    )}
                    {challenge.status === "em_progresso" && (
                      <Flame className="w-5 h-5 text-berserk shrink-0 mt-0.5" />
                    )}
                    {challenge.status === "bloqueado" && (
                      <Lock className="w-5 h-5 text-iron shrink-0 mt-0.5" />
                    )}
                    {challenge.status === "disponivel" && (
                      <Circle className="w-5 h-5 text-iron shrink-0 mt-0.5" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-iron text-xs leading-relaxed">{challenge.description}</p>

                  {/* Progress bar (em_progresso only) */}
                  {challenge.status === "em_progresso" && challenge.days && challenge.daysLeft !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs text-iron mb-1">
                        <span>Progresso</span>
                        <span className="text-berserk font-game">
                          {challenge.days - challenge.daysLeft}/{challenge.days} dias
                        </span>
                      </div>
                      <div className="h-1.5 bg-void rounded-full overflow-hidden">
                        <div
                          className="h-full bg-berserk rounded-full transition-all"
                          style={{
                            width: `${((challenge.days - challenge.daysLeft) / challenge.days) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <span className={`text-xs font-game border rounded-md px-2 py-0.5 ${DIFFICULTY_COLORS[challenge.difficulty]}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs font-game text-gold font-bold">
                      +{challenge.xp} XP
                    </span>
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
