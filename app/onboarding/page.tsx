"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

const questions = [
  // ── Bloco 1: A Dor ───────────────────────────────────────────────────────
  {
    id: 1,
    q: "O que está te bloqueando agora?",
    options: ["Falta de disciplina", "Falta de foco", "Procrastinação"],
    block: "A Dor",
  },
  {
    id: 2,
    q: "Qual o seu nível atual de cansaço?",
    options: ["Sempre exausto", "Energia instável", "Focado, mas sem rumo"],
    block: "A Dor",
  },
  {
    id: 3,
    q: "Como você descreveria sua rotina atual?",
    options: ["Caótica e sem controle", "Inconsistente", "Estável, mas estagnada"],
    block: "A Dor",
  },
  // ── Bloco 2: Mapeamento ──────────────────────────────────────────────────
  {
    id: 4,
    q: "Qual área da sua vida mais precisa de atenção?",
    options: ["Produtividade e foco", "Saúde e energia", "Propósito e direção"],
    block: "Mapeamento",
  },
  {
    id: 5,
    q: "Quanto tempo você reserva para si mesmo por dia?",
    options: ["Menos de 1 hora", "1 a 3 horas", "Mais de 3 horas"],
    block: "Mapeamento",
  },
  {
    id: 6,
    q: "Qual hábito você mais quer desenvolver?",
    options: ["Exercício físico regular", "Leitura e aprendizado", "Meditação e concentração"],
    block: "Mapeamento",
  },
  // ── Bloco 3: O Guerreiro ─────────────────────────────────────────────────
  {
    id: 7,
    q: "O que te move quando tudo parece impossível?",
    options: ["Necessidade de provar algo", "Visão de quem quero ser", "Compromisso com quem amo"],
    block: "O Guerreiro",
  },
  {
    id: 8,
    q: "Como você reage diante de um fracasso?",
    options: ["Fico paralisado por um tempo", "Analiso e recomeço", "Ignoro e sigo em frente"],
    block: "O Guerreiro",
  },
  {
    id: 9,
    q: "Qual é sua maior força hoje?",
    options: ["Resiliência", "Criatividade", "Determinação brutal"],
    block: "O Guerreiro",
  },
  // ── Bloco 4: A Missão ────────────────────────────────────────────────────
  {
    id: 10,
    q: "O que você quer conquistar nos próximos 90 dias?",
    options: ["Construir disciplina sólida", "Alcançar uma meta específica", "Transformar minha rotina"],
    block: "A Missão",
  },
  {
    id: 11,
    q: "O que o sucesso parece para você?",
    options: ["Liberdade financeira", "Saúde e vitalidade plena", "Impacto e legado duradouro"],
    block: "A Missão",
  },
  {
    id: 12,
    q: "O que você está disposto a sacrificar para chegar lá?",
    options: ["Conforto e entretenimento", "Horas de sono e descanso", "Relações que me drenam"],
    block: "A Missão",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  function handleSelect(opt: string) {
    const updated = { ...answers, [current.id]: opt };
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("berserk_onboarding", JSON.stringify(updated));
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Counter */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-iron text-xs font-game tracking-widest uppercase">
            {step + 1} / {questions.length}
          </span>
          <span className="text-iron text-xs font-game tracking-widest uppercase">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-surface w-full mb-8 rounded-full overflow-hidden">
          <div
            className="h-full bg-berserk transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Block label */}
        <p className="text-berserk font-game uppercase tracking-widest text-sm mb-2">
          Bloco: {current.block}
        </p>

        {/* Question */}
        <h1 className="text-3xl font-titles font-bold text-steel mb-8 leading-snug">
          {current.q}
        </h1>

        {/* Options */}
        <div className="grid gap-4">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="p-5 bg-surface border border-white/5 rounded-xl text-left hover:border-berserk hover:bg-berserk/5 transition-all group flex justify-between items-center"
            >
              <span className="font-medium text-steel">{opt}</span>
              <ChevronRight className="w-5 h-5 text-berserk opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-1.5 mt-10 flex-wrap">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-berserk"
                  : answers[q.id]
                  ? "w-3 bg-gold/60"
                  : "w-3 bg-surface"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
