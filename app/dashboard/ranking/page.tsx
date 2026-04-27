"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { Trophy, Flame, Zap, Crown, TrendingUp, Circle } from "lucide-react";
import { loadProgress, xpToLevel, type GameProgress } from "@/lib/gameData";

// ── Fake player pool ─────────────────────────────────────────────────────────
const NAMES = [
  "Rafael Costa",   "Lucas Mendes",   "Gabriel Silva",  "Matheus Souza",
  "Pedro Alves",    "João Ferreira",  "Bruno Rocha",    "Diego Martins",
  "Felipe Gomes",   "Thiago Lima",    "André Santos",   "Rodrigo Nunes",
  "Vinicius Castro","Caio Oliveira",  "Leonardo Pereira",
];

const CLASSES = ["Iniciante","Guerreiro","Veterano","Lenda"] as const;
type WarriorClass = typeof CLASSES[number];

interface FakePlayer {
  id: string;
  name: string;
  xp: number;
  level: number;
  cls: WarriorClass;
  online: boolean;
  avatar: string; // initials color
}

interface FeedEntry {
  id: string;
  player: string;
  action: string;
  xp: number;
  ts: number;
}

const FEED_ACTIONS = [
  (p: string, x: number) => ({ player: p, action: "completou uma sessão de foco", xp: x }),
  (p: string, x: number) => ({ player: p, action: "concluiu um desafio", xp: x }),
  (p: string, x: number) => ({ player: p, action: "marcou um dia de hábito", xp: x }),
  (p: string, x: number) => ({ player: p, action: "subiu de nível!", xp: x }),
  (p: string, x: number) => ({ player: p, action: "completou 7 dias seguidos", xp: x }),
];

const AVATAR_COLORS = [
  "bg-rose-600","bg-orange-600","bg-amber-600","bg-emerald-700",
  "bg-cyan-700","bg-violet-700","bg-indigo-700","bg-pink-700",
];

function classFromLevel(level: number): WarriorClass {
  if (level >= 6) return "Lenda";
  if (level >= 4) return "Veterano";
  if (level >= 2) return "Guerreiro";
  return "Iniciante";
}

function classColor(cls: WarriorClass) {
  if (cls === "Lenda")     return "text-accent";
  if (cls === "Veterano")  return "text-accent";
  if (cls === "Guerreiro") return "text-primary";
  return "text-muted-foreground";
}

function generateFakePlayers(): FakePlayer[] {
  const XP_RANGES = [
    [6000,14000],[3500,8000],[2000,5500],[1200,4000],[800,2800],
    [500,2000],  [300,1400], [100,800],  [50,500],   [10,300],
    [5000,12000],[1800,6000],[700,3000], [200,1200],  [80,600],
  ];
  return NAMES.map((name, i) => {
    const [min, max] = XP_RANGES[i];
    const xp = Math.floor(Math.random() * (max - min) + min);
    const level = xpToLevel(xp);
    return {
      id: `fake_${i}`,
      name,
      xp,
      level,
      cls: classFromLevel(level),
      online: Math.random() > 0.45,
      avatar: AVATAR_COLORS[i % AVATAR_COLORS.length],
    };
  });
}

function rankLabel(pos: number) {
  if (pos === 1) return { icon: Crown, color: "text-amber-400" };
  if (pos === 2) return { icon: Trophy, color: "text-slate-400" };
  if (pos === 3) return { icon: Trophy, color: "text-amber-700" };
  return null;
}

export default function RankingPage() {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [players, setPlayers] = useState<FakePlayer[]>([]);
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [pulse, setPulse] = useState<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    const fakes = generateFakePlayers();
    setPlayers(fakes);

    function tick() {
      setPlayers((prev: FakePlayer[]) => {
        const copy = [...prev];
        const idx = Math.floor(Math.random() * copy.length);
        const gain = Math.floor(Math.random() * 120 + 30);
        const p = { ...copy[idx] };
        p.xp += gain;
        p.level = xpToLevel(p.xp);
        p.cls = classFromLevel(p.level);
        p.online = true;
        copy[idx] = p;
        setPulse(p.id);
        setTimeout(() => setPulse(null), 800);

        // Feed entry
        const actionFn = FEED_ACTIONS[Math.floor(Math.random() * FEED_ACTIONS.length)];
        const entry: FeedEntry = {
          id: `${Date.now()}`,
          ts: Date.now(),
          ...actionFn(p.name.split(" ")[0], gain),
        };
        setFeed((f: FeedEntry[]) => [entry, ...f].slice(0, 8));

        return copy;
      });

      const next = Math.floor(Math.random() * 5000 + 3000);
      tickRef.current = setTimeout(tick, next);
    }

    tickRef.current = setTimeout(tick, 2000);
    return () => { if (tickRef.current) clearTimeout(tickRef.current); };
  }, []);

  if (!progress || players.length === 0) return null;

  // Merge real user into ranking
  const userName = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("berserk_user") || "{}") as { name?: string; nickname?: string };
      return u.nickname || u.name || "Você";
    } catch { return "Você"; }
  })();

  type RankEntry = { id: string; name: string; xp: number; level: number; cls: WarriorClass; online: boolean; avatar: string; isMe: boolean; };

  const allPlayers: RankEntry[] = [
    ...players.map((p: FakePlayer) => ({ ...p, isMe: false })),
    {
      id: "me",
      name: userName,
      xp: progress.xp,
      level: progress.level,
      cls: classFromLevel(progress.level),
      online: true,
      avatar: "bg-primary",
      isMe: true,
    },
  ].sort((a: RankEntry, b: RankEntry) => b.xp - a.xp);

  const myRank = allPlayers.findIndex((p: RankEntry) => p.isMe) + 1;
  const top3 = allPlayers.slice(0, 3);
  const rest = allPlayers.slice(3);
  const onlineCount = allPlayers.filter((p) => p.online).length;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-heading text-2xl font-black tracking-[0.15em] uppercase text-foreground">
                Ranking Global
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Sua posição: <span className="text-accent font-heading font-black">#{myRank}</span> de {allPlayers.length} guerreiros
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-700/40 rounded-lg px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-heading font-black tracking-widest">AO VIVO</span>
              </div>
              <div className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-3 py-1.5">
                <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-heading">{onlineCount} online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* ── Ranking list ─────────────────────────────────────────── */}
            <div className="xl:col-span-2 space-y-4">

              {/* Top 3 podium */}
              <div className="grid grid-cols-3 gap-3">
                {[top3[1], top3[0], top3[2]].filter(Boolean).map((p, displayIdx) => {
                  const rank = displayIdx === 0 ? 2 : displayIdx === 1 ? 1 : 3;
                  const RankIcon = rank === 1 ? Crown : Trophy;
                  const sizes = rank === 1 ? "pt-0" : "pt-6";
                  return (
                    <div
                      key={p.id}
                      className={`${sizes} flex flex-col items-center gap-2 bg-card border ${p.isMe ? "border-primary/60" : "border-border"} rounded-xl p-4 relative`}
                    >
                      <RankIcon className={`w-5 h-5 ${rank === 1 ? "text-amber-400" : rank === 2 ? "text-slate-400" : "text-amber-700"}`} />
                      <div className={`w-12 h-12 rounded-full ${(p as FakePlayer & { isMe: boolean; avatar: string }).avatar || "bg-primary"} flex items-center justify-center text-white font-black text-lg font-heading relative`}>
                        {p.name.charAt(0)}
                        {p.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />}
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-medium truncate w-full max-w-[90px] ${p.isMe ? "text-accent" : "text-foreground"}`}>
                          {p.isMe ? "Você" : p.name.split(" ")[0]}
                        </p>
                        <p className={`text-xs font-heading font-black ${classColor(p.cls)}`}>{p.cls}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-accent" />
                        <span className="text-xs font-heading font-black text-accent">{p.xp.toLocaleString()} XP</span>
                      </div>
                      <span className="absolute top-2 right-2 text-xs font-heading font-black text-muted-foreground">#{rank}</span>
                    </div>
                  );
                })}
              </div>

              {/* Rest of ranking */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {rest.map((p, i) => {
                  const rank = i + 4;
                  const isPulsing = pulse === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 transition-all duration-300 ${
                        p.isMe ? "bg-primary/10 border-l-2 border-l-primary" : isPulsing ? "bg-accent/5" : ""
                      }`}
                    >
                      {/* Rank */}
                      <span className="text-muted-foreground text-xs font-heading w-6 text-right shrink-0">
                        #{rank}
                      </span>

                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full ${(p as FakePlayer & { isMe: boolean; avatar: string }).avatar || "bg-primary"} flex items-center justify-center text-white text-xs font-black font-heading shrink-0 relative`}>
                        {p.name.charAt(0)}
                        {p.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-background" />
                        )}
                      </div>

                      {/* Name + class */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${p.isMe ? "text-accent" : "text-foreground"}`}>
                          {p.isMe ? `${p.name} (você)` : p.name}
                        </p>
                        <p className={`text-xs font-heading ${classColor(p.cls)}`}>
                          Nível {p.level} · {p.cls}
                        </p>
                      </div>

                      {/* XP + trending */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isPulsing && (
                          <div className="flex items-center gap-1 text-emerald-400 animate-in fade-in duration-300">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-xs font-heading font-black">+XP</span>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="text-xs font-heading font-black text-foreground">{p.xp.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">XP</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Live feed ───────────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-xs font-heading font-black uppercase tracking-widest text-foreground">
                    Atividade Global
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {feed.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground text-xs">
                      Aguardando atividade...
                    </div>
                  ) : (
                    feed.map((entry: FeedEntry) => (
                      <div key={entry.id} className="px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-300">
                        <p className="text-xs text-foreground">
                          <span className="font-bold text-accent">{entry.player}</span>{" "}
                          {entry.action}
                        </p>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-xs text-muted-foreground">
                            {Math.floor((Date.now() - entry.ts) / 1000)}s atrás
                          </p>
                          <span className="text-xs font-heading font-black text-emerald-400">+{entry.xp} XP</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sua posição card */}
              <div className="bg-card border border-primary/30 rounded-xl p-4 space-y-3">
                <p className="text-xs font-heading font-black uppercase tracking-widest text-muted-foreground">
                  Sua Posição
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black font-heading text-lg">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{userName}</p>
                      <p className={`text-xs font-heading font-black ${classColor(classFromLevel(progress.level))}`}>
                        Nível {progress.level} · {classFromLevel(progress.level)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-heading font-black text-accent">#{myRank}</p>
                    <p className="text-xs text-muted-foreground">de {allPlayers.length}</p>
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-xs">
                  <div>
                    <p className="text-muted-foreground">XP Total</p>
                    <p className="font-heading font-black text-foreground">{progress.xp.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Para #{myRank - 1}</p>
                    <p className="font-heading font-black text-accent">
                      {myRank > 1
                        ? `${(allPlayers[myRank - 2].xp - progress.xp).toLocaleString()} XP`
                        : "Líder! 🏆"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
