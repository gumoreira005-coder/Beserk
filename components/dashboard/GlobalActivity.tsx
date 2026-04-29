"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ActivityItem {
  id: string;
  username: string;
  action: string;
  xp: number;
  ts: number;
}

const FAKE_NAMES = [
  "Rodrigo","João","Lucas","Pedro","Gabriel","Mateus","Felipe","André",
  "Thiago","Bruno","Gustavo","Rafael","Diego","Vitor","Igor","Caio",
];

const ACTIONS: { text: string; xp: number }[] = [
  { text: "marcou um dia de hábito",       xp: 30  },
  { text: "completou um desafio",           xp: 50  },
  { text: "registrou sessão de foco",       xp: 20  },
  { text: "subiu de nível!",               xp: 135 },
  { text: "treinou por 45 minutos",         xp: 40  },
  { text: "manteve a sequência de 7 dias!", xp: 70  },
  { text: "zerou todos os desafios do dia", xp: 90  },
  { text: "completou meditação diária",     xp: 25  },
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeFake(): ActivityItem {
  const action = randomItem(ACTIONS);
  return {
    id: Math.random().toString(36).slice(2),
    username: randomItem(FAKE_NAMES),
    action: action.text,
    xp: action.xp,
    ts: Date.now(),
  };
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)  return `${s}s atrás`;
  if (s < 3600) return `${Math.floor(s / 60)}min atrás`;
  return `${Math.floor(s / 3600)}h atrás`;
}

const MAX_ITEMS = 8;

export function GlobalActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [, setTick] = useState(0);

  const push = useCallback((item: ActivityItem) => {
    setItems((prev) => [item, ...prev].slice(0, MAX_ITEMS));
  }, []);

  /* ── Seed inicial com itens fake ─────────────────── */
  useEffect(() => {
    const seed: ActivityItem[] = Array.from({ length: 5 }, (_, i) => ({
      ...makeFake(),
      ts: Date.now() - (i + 1) * 7000,
    }));
    setItems(seed);
  }, []);

  /* ── Adiciona fake a cada 12-25s ─────────────────── */
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 12000 + Math.random() * 13000;
      timeout = setTimeout(() => {
        push(makeFake());
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [push]);

  /* ── Supabase Realtime ───────────────────────────── */
  useEffect(() => {
    const channel = supabase
      .channel("global-activity")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          const n = payload.new as {
            nickname?: string; username?: string; xp?: number;
            level?: number; streak?: number;
          };
          const o = payload.old as { xp?: number; level?: number; streak?: number };

          const name = n.nickname || n.username || "Guerreiro";
          const xpDiff = (n.xp ?? 0) - (o.xp ?? 0);

          if ((n.level ?? 0) > (o.level ?? 0)) {
            push({ id: crypto.randomUUID(), username: name, action: "subiu de nível!", xp: 135, ts: Date.now() });
          } else if ((n.streak ?? 0) > (o.streak ?? 0)) {
            push({ id: crypto.randomUUID(), username: name, action: "marcou um dia de hábito", xp: 30, ts: Date.now() });
          } else if (xpDiff > 0) {
            const action = randomItem(ACTIONS.filter((a) => a.xp <= xpDiff + 10));
            push({ id: crypto.randomUUID(), username: name, action: action?.text ?? "registrou atividade", xp: xpDiff, ts: Date.now() });
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [push]);

  /* ── Atualiza timestamps a cada 10s ──────────────── */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Flame className="w-4 h-4 text-accent" />
        <span className="font-heading font-black text-xs uppercase tracking-widest text-foreground">
          Atividade Global
        </span>
        <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* Feed */}
      <div className="divide-y divide-border">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">
                  <span className="text-accent font-bold">{item.username}</span>
                  <span className="text-foreground"> {item.action}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(item.ts)}</p>
              </div>
              <span className="shrink-0 text-sm font-heading font-black text-green-400">
                +{item.xp} XP
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
