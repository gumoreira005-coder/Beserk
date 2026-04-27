"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HexRadarChart } from "@/components/charts/HexRadarChart";
import {
  Shield, Zap, Clock, Target, Lightbulb, BookOpen,
  Star, ShieldCheck, Sword, DollarSign, Eye, Flame,
  Trophy, Timer, Swords, RefreshCw,
} from "lucide-react";
import { fetchPublicProfile, type SupabaseProfile } from "@/lib/syncProfile";
import { ATTRIBUTE_NAMES, avgAttributes, type Attributes } from "@/lib/gameData";

const ATTR_ICONS: Record<string, typeof Shield> = {
  Foco: Target, Disciplina: Shield, Corpo: Zap, Resiliência: ShieldCheck,
  Estratégia: Sword, Criatividade: Lightbulb, Propósito: Star,
  Finanças: DollarSign, Aprendizado: BookOpen, Tempo: Clock,
  Conexões: Eye, Recuperação: Flame,
};

function warriorLabel(level: number) {
  if (level >= 6) return "Lenda";
  if (level >= 4) return "Veterano";
  if (level >= 2) return "Guerreiro";
  return "Iniciante";
}

function classColor(level: number) {
  if (level >= 4) return "text-amber-400";
  if (level >= 2) return "text-primary";
  return "text-muted-foreground";
}

function fmtMin(m: number) {
  if (m < 60) return `${m}min`;
  return `${Math.floor(m / 60)}h ${m % 60 > 0 ? `${m % 60}m` : ""}`.trim();
}

function barColor(v: number) {
  if (v >= 70) return "bg-amber-500";
  if (v >= 40) return "bg-yellow-600";
  return "bg-primary";
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `há ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)} dias`;
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = typeof params.username === "string" ? params.username : "";

  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load(showSpinner = false) {
    if (showSpinner) setRefreshing(true);
    const data = await fetchPublicProfile(username);
    if (!data) setNotFound(true);
    else setProfile(data);
    setLoading(false);
    setRefreshing(false);
  }

  useEffect(() => { if (username) load(); }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Swords className="w-12 h-12 text-primary mx-auto" />
          <h1 className="font-heading text-xl font-black text-foreground">
            @{username} não encontrado
          </h1>
          <p className="text-muted-foreground text-sm">
            Este guerreiro ainda não sincronizou o perfil.
          </p>
          <a href="/auth" className="inline-block mt-4 text-primary text-sm font-heading font-bold hover:underline">
            Criar minha conta →
          </a>
        </div>
      </div>
    );
  }

  const attrs = profile.attributes as Attributes;
  const avg = avgAttributes(attrs);
  const cls = warriorLabel(profile.level);
  const circumference = 2 * Math.PI * 54;
  const radarData = ATTRIBUTE_NAMES.map((name) => ({ attribute: name, value: attrs[name] ?? 0 }));
  const scores = ATTRIBUTE_NAMES.map((name) => attrs[name] ?? 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <span className="font-heading text-lg font-black tracking-[0.2em] uppercase text-foreground">
          Berserk
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </button>
          <div className="flex items-center gap-2 bg-green-950/40 border border-green-700/40 rounded-lg px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-400 text-xs font-heading font-black tracking-widest">AO VIVO</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Profile hero */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-black font-heading shrink-0">
              {profile.nickname.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-2xl font-black text-foreground truncate">
                {profile.nickname}
              </h1>
              <p className={`font-heading font-black text-lg ${classColor(profile.level)}`}>
                {cls} · Nível {profile.level}
              </p>
              <p className="text-muted-foreground text-sm mt-0.5">@{profile.username}</p>
              {profile.updated_at && (
                <p className="text-muted-foreground text-xs mt-1">
                  Atualizado {timeAgo(profile.updated_at)}
                </p>
              )}
            </div>
            <div className="bg-secondary rounded-xl px-4 py-3 text-center shrink-0">
              <p className="text-accent font-heading font-black text-2xl leading-none">
                {profile.xp.toLocaleString()}
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">XP Total</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Timer,  label: "Foco Total",  value: fmtMin(profile.focus_minutes_total) },
              { icon: Flame,  label: "Sequência",   value: `${profile.streak} dias` },
              { icon: Trophy, label: "Desafios",    value: String(profile.challenges_completed) },
            ].map((s) => (
              <div key={s.label} className="bg-secondary rounded-lg p-3 text-center">
                <s.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-foreground font-heading font-black text-lg leading-none">{s.value}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-xs font-heading uppercase tracking-widest">
                Mapa de Atributos
              </p>
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 120 120" className="-rotate-90 w-full h-full">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--secondary))" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke="hsl(var(--primary))" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - avg / 100)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading font-black text-sm text-foreground leading-none">{avg}</span>
                  <span className="text-muted-foreground text-[9px]">/100</span>
                </div>
              </div>
            </div>
            <HexRadarChart data={radarData} />
          </div>

          {/* Bars */}
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-muted-foreground text-xs font-heading uppercase tracking-widest mb-5">
              Detalhamento
            </p>
            <div className="space-y-3">
              {ATTRIBUTE_NAMES.map((name) => {
                const score = attrs[name] ?? 0;
                const Icon = ATTR_ICONS[name] ?? Star;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-foreground text-xs">{name}</span>
                      </div>
                      <span className={`text-xs font-heading font-bold ${score >= 70 ? "text-amber-400" : score >= 40 ? "text-yellow-500" : "text-primary"}`}>
                        {score}
                      </span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor(score)} transition-all duration-700`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5">
              {[
                { l: "Fortes", n: scores.filter((s) => s >= 70).length, c: "text-amber-400" },
                { l: "Médios", n: scores.filter((s) => s >= 40 && s < 70).length, c: "text-yellow-500" },
                { l: "Fracos", n: scores.filter((s) => s < 40).length, c: "text-primary" },
              ].map((item) => (
                <div key={item.l} className="bg-secondary rounded-lg p-2 text-center">
                  <p className={`font-heading font-black text-base leading-none ${item.c}`}>{item.n}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{item.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-card border border-primary/30 rounded-xl p-6 text-center space-y-3">
          <p className="text-foreground font-heading font-black text-lg">
            Quer forjar seu próprio perfil?
          </p>
          <p className="text-muted-foreground text-sm">
            Crie sua conta e comece sua jornada do zero.
          </p>
          <a
            href="/auth"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-heading font-black text-sm uppercase tracking-widest px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Iniciar Jornada →
          </a>
        </div>

      </main>
    </div>
  );
}
