"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Sword, Eye, EyeOff, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "cadastro";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("cadastro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "cadastro") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setSuccess("Conta criada! Iniciando sua jornada...");
        setTimeout(() => router.push("/onboarding"), 1200);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro inesperado.";
      setError(translateError(msg));
    } finally {
      setLoading(false);
    }
  }

  function translateError(msg: string) {
    if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
    if (msg.includes("Email not confirmed"))       return "Confirme seu e-mail antes de entrar.";
    if (msg.includes("User already registered"))   return "Este e-mail já está cadastrado.";
    if (msg.includes("Password should be"))        return "A senha deve ter no mínimo 6 caracteres.";
    return msg;
  }

  function switchMode(m: Mode) {
    setMode(m);
    setError("");
    setSuccess("");
  }

  return (
    <div className="min-h-screen bg-void flex">

      {/* ── Painel esquerdo (branding) ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-[#2A2A4A] relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(192,57,43,0.12)_0%,transparent_60%)]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-berserk/40 flex items-center justify-center">
            <Sword className="w-5 h-5 text-berserk" />
          </div>
          <span className="font-titles text-xl font-bold tracking-[0.2em] uppercase text-steel">
            Berserk
          </span>
        </div>

        {/* Quote */}
        <div className="relative z-10 space-y-6">
          <h2 className="font-titles text-4xl font-bold text-steel leading-tight">
            Forje sua vontade.<br />
            <span className="text-berserk">Conquiste</span> seus limites.
          </h2>
          <p className="text-iron text-sm leading-relaxed max-w-sm">
            Uma ferramenta de produtividade para aqueles que recusam a mediocridade.
            Cada dia é uma batalha. Vença a sua.
          </p>
          <blockquote className="border-l-2 border-berserk pl-4">
            <p className="text-iron/70 text-xs italic leading-relaxed">
              &ldquo;In this world, is the destiny of mankind controlled by some
              transcendental entity or law? Is it like the hand of God hovering
              above?&rdquo;
            </p>
            <cite className="text-iron/50 text-xs mt-2 block not-italic">— Berserk</cite>
          </blockquote>
        </div>

        {/* Stats decorativos */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: "Guerreiros", value: "10K+" },
            { label: "Desafios", value: "500+" },
            { label: "XP Total", value: "∞" },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-[#2A2A4A] rounded-lg p-3 text-center">
              <p className="font-titles text-xl font-bold text-gold">{s.value}</p>
              <p className="text-iron text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Painel direito (formulário) ────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <Sword className="w-5 h-5 text-berserk" />
          <span className="font-titles text-lg font-bold tracking-[0.2em] uppercase text-steel">
            Berserk
          </span>
        </div>

        <div className="w-full max-w-sm">

          {/* Toggle login / cadastro */}
          <div className="flex bg-surface border border-[#2A2A4A] rounded-lg p-1 mb-8">
            {(["cadastro", "login"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 rounded-md text-sm font-game transition-all ${
                  mode === m
                    ? "bg-berserk text-steel"
                    : "text-iron hover:text-steel"
                }`}
              >
                {m === "cadastro" ? "Criar Conta" : "Entrar"}
              </button>
            ))}
          </div>

          {/* Título */}
          <div className="mb-8">
            <h1 className="font-titles text-2xl font-bold text-steel tracking-wide">
              {mode === "cadastro" ? "Comece sua jornada" : "Bem-vindo de volta"}
            </h1>
            <p className="text-iron text-sm mt-1">
              {mode === "cadastro"
                ? "Crie sua conta e responda ao diagnóstico."
                : "Entre para continuar sua batalha diária."}
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nome (só no cadastro) */}
            {mode === "cadastro" && (
              <div>
                <label className="text-iron text-xs font-game uppercase tracking-widest block mb-1.5">
                  Nome de Guerreiro
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="Como quer ser chamado?"
                  className="w-full bg-surface border border-[#2A2A4A] rounded-lg px-4 py-3 text-steel text-sm placeholder:text-iron/50 focus:outline-none focus:border-berserk transition-colors"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-iron text-xs font-game uppercase tracking-widest block mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-surface border border-[#2A2A4A] rounded-lg px-4 py-3 text-steel text-sm placeholder:text-iron/50 focus:outline-none focus:border-berserk transition-colors"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="text-iron text-xs font-game uppercase tracking-widest block mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-surface border border-[#2A2A4A] rounded-lg px-4 py-3 pr-11 text-steel text-sm placeholder:text-iron/50 focus:outline-none focus:border-berserk transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-iron hover:text-steel transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Feedback */}
            {error && (
              <p className="text-berserk text-xs bg-berserk/10 border border-berserk/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-gold text-xs bg-gold/10 border border-gold/30 rounded-lg px-3 py-2">
                {success}
              </p>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-berserk hover:bg-blood text-steel font-titles font-bold tracking-widest uppercase py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "cadastro" ? "Iniciar Jornada" : "Entrar"}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link alternativo */}
          <p className="text-center text-iron text-xs mt-6">
            {mode === "cadastro" ? "Já tem uma conta?" : "Ainda não tem conta?"}{" "}
            <button
              onClick={() => switchMode(mode === "cadastro" ? "login" : "cadastro")}
              className="text-berserk hover:text-blood transition-colors underline"
            >
              {mode === "cadastro" ? "Entrar" : "Criar conta"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
