// Central progression system — all data lives in localStorage: "berserk_progress"

export const ATTRIBUTE_NAMES = [
  "Foco", "Disciplina", "Corpo", "Resiliência",
  "Estratégia", "Criatividade", "Propósito", "Finanças",
  "Aprendizado", "Tempo", "Conexões", "Recuperação",
] as const;

export type AttributeName = typeof ATTRIBUTE_NAMES[number];
export type Attributes = Record<AttributeName, number>;

export interface ActivityEntry {
  id: string;
  time: string;   // HH:MM
  date: string;   // YYYY-MM-DD
  action: string;
  xp: number;
}

export interface ChallengeState {
  status: "disponivel" | "em_progresso" | "concluido" | "bloqueado";
  daysCompleted: number;
}

export interface WeekSnapshot {
  week: string;
  score: number;
}

export interface GameProgress {
  // Focus tracking
  sessionsToday: number;
  sessionsTodayDate: string;   // YYYY-MM-DD
  focusMinutesToday: number;
  focusMinutesTotal: number;
  // Streak
  streak: number;
  lastStreakDate: string;
  // XP & Level
  xp: number;
  level: number;
  // Attributes 0–100
  attributes: Attributes;
  // Challenges: key = challenge id (string)
  challenges: Record<string, ChallengeState>;
  // Activity log (max 20)
  activityLog: ActivityEntry[];
  // Weekly history snapshots
  weeklyHistory: WeekSnapshot[];
}

const EMPTY_ATTRS: Attributes = {
  Foco: 0, Disciplina: 0, Corpo: 0, Resiliência: 0,
  Estratégia: 0, Criatividade: 0, Propósito: 0, Finanças: 0,
  Aprendizado: 0, Tempo: 0, Conexões: 0, Recuperação: 0,
};

const DEFAULT: GameProgress = {
  sessionsToday: 0,
  sessionsTodayDate: "",
  focusMinutesToday: 0,
  focusMinutesTotal: 0,
  streak: 0,
  lastStreakDate: "",
  xp: 0,
  level: 1,
  attributes: { ...EMPTY_ATTRS },
  challenges: {},
  activityLog: [],
  weeklyHistory: [{ week: "Sem 1", score: 0 }],
};

const KEY = "berserk_progress";
export const UPDATE_EVENT = "berserk_progress_updated";

// ── XP → Level thresholds ──────────────────────────────────────────────────
const XP_THRESHOLDS = [0, 500, 1500, 3000, 5000, 8000, 12000];

export function xpToLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, XP_THRESHOLDS.length);
}

export function xpForNextLevel(level: number): number {
  return XP_THRESHOLDS[level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
}

// ── Load / Save ────────────────────────────────────────────────────────────
export function loadProgress(): GameProgress {
  if (typeof window === "undefined") return { ...DEFAULT, attributes: { ...EMPTY_ATTRS } };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT, attributes: { ...EMPTY_ATTRS } };
    const parsed = JSON.parse(raw) as Partial<GameProgress>;
    return {
      ...DEFAULT,
      ...parsed,
      attributes: { ...EMPTY_ATTRS, ...(parsed.attributes ?? {}) },
      challenges: parsed.challenges ?? {},
      activityLog: parsed.activityLog ?? [],
      weeklyHistory: parsed.weeklyHistory ?? [{ week: "Sem 1", score: 0 }],
    };
  } catch {
    return { ...DEFAULT, attributes: { ...EMPTY_ATTRS } };
  }
}

function saveProgress(p: GameProgress) {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

// ── Helpers ────────────────────────────────────────────────────────────────
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function nowTime(): string {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function cap(v: number) { return Math.min(100, Math.max(0, Math.round(v))); }

function addAttr(attrs: Attributes, gains: Partial<Attributes>): Attributes {
  const result = { ...attrs };
  for (const key of ATTRIBUTE_NAMES) {
    if (gains[key]) result[key] = cap(result[key] + (gains[key] ?? 0));
  }
  return result;
}

function addActivity(log: ActivityEntry[], action: string, xp: number): ActivityEntry[] {
  const entry: ActivityEntry = {
    id: `${Date.now()}`,
    time: nowTime(),
    date: today(),
    action,
    xp,
  };
  return [entry, ...log].slice(0, 20);
}

function updateStreak(p: GameProgress): GameProgress {
  const t = today();
  if (p.lastStreakDate === t) return p;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yd = yesterday.toISOString().slice(0, 10);
  const newStreak = p.lastStreakDate === yd ? p.streak + 1 : 1;
  return { ...p, streak: newStreak, lastStreakDate: t };
}

function resetDailyIfNeeded(p: GameProgress): GameProgress {
  if (p.sessionsTodayDate !== today()) {
    return { ...p, sessionsToday: 0, focusMinutesToday: 0, sessionsTodayDate: today() };
  }
  return p;
}

function takeWeeklySnapshot(p: GameProgress): GameProgress {
  const avg = Math.round(
    ATTRIBUTE_NAMES.reduce((s, k) => s + p.attributes[k], 0) / ATTRIBUTE_NAMES.length
  );
  const history = [...p.weeklyHistory];
  const label = `Sem ${history.length + 1}`;
  if (history.length === 0 || history[history.length - 1].score !== avg) {
    history.push({ week: label, score: avg });
    if (history.length > 10) history.shift();
  }
  return { ...p, weeklyHistory: history };
}

// ── Public actions ──────────────────────────────────────────────────────────

/** Call when a focus session (25 min) is completed */
export function recordFocusSession(minutes = 25) {
  let p = loadProgress();
  p = resetDailyIfNeeded(p);
  p = updateStreak(p);
  const xpGain = Math.round(minutes * 4);
  const attrGain: Partial<Attributes> = { Foco: 2, Disciplina: 1, Tempo: 1 };
  p = {
    ...p,
    xp: p.xp + xpGain,
    level: xpToLevel(p.xp + xpGain),
    sessionsToday: p.sessionsToday + 1,
    focusMinutesToday: p.focusMinutesToday + minutes,
    focusMinutesTotal: p.focusMinutesTotal + minutes,
    attributes: addAttr(p.attributes, attrGain),
    activityLog: addActivity(p.activityLog, `Sessão de Foco — ${minutes}min`, xpGain),
  };
  p = takeWeeklySnapshot(p);
  saveProgress(p);
  return p;
}

/** Challenge attribute rewards */
const CHALLENGE_REWARDS: Record<number, Partial<Attributes>> = {
  1:  { Aprendizado: 5, Disciplina: 3 },
  2:  { Estratégia: 4, Foco: 3, Resiliência: 2 },
  3:  { Aprendizado: 10, Disciplina: 5, Estratégia: 5 },
  4:  { Corpo: 8, Disciplina: 5, Recuperação: 3 },
  5:  { Disciplina: 6, Corpo: 4, Recuperação: 3 },
  6:  { Corpo: 15, Disciplina: 10, Recuperação: 5 },
  7:  { Disciplina: 8, Tempo: 5, Recuperação: 3 },
  8:  { Foco: 6, Disciplina: 5, Tempo: 4 },
  9:  { Disciplina: 20, Foco: 10, Resiliência: 10 },
  10: { Foco: 5, Disciplina: 3, Tempo: 2 },
  11: { Foco: 8, Disciplina: 5, Tempo: 4 },
  12: { Foco: 15, Disciplina: 10, Estratégia: 10, Resiliência: 5 },
};

export interface ChallengeInfo {
  id: number;
  title: string;
  xp: number;
  days?: number;
}

/** Start a challenge (moves to em_progresso) */
export function startChallenge(c: ChallengeInfo) {
  let p = loadProgress();
  const cur = p.challenges[String(c.id)];
  if (cur?.status === "concluido" || cur?.status === "em_progresso") return;
  p = {
    ...p,
    challenges: {
      ...p.challenges,
      [String(c.id)]: { status: "em_progresso", daysCompleted: 0 },
    },
    activityLog: addActivity(p.activityLog, `Desafio iniciado: ${c.title}`, 0),
  };
  saveProgress(p);
}

/** Mark one day done for a challenge in progress */
export function markChallengeDay(c: ChallengeInfo) {
  let p = loadProgress();
  const cur = p.challenges[String(c.id)];
  if (!cur || cur.status !== "em_progresso") return;
  const days = c.days ?? 1;
  const newDays = cur.daysCompleted + 1;
  const completed = newDays >= days;
  const rewards = CHALLENGE_REWARDS[c.id] ?? {};
  if (completed) {
    p = {
      ...p,
      xp: p.xp + c.xp,
      level: xpToLevel(p.xp + c.xp),
      attributes: addAttr(p.attributes, rewards),
      challenges: {
        ...p.challenges,
        [String(c.id)]: { status: "concluido", daysCompleted: newDays },
      },
      activityLog: addActivity(p.activityLog, `Desafio concluído: ${c.title}`, c.xp),
    };
    p = takeWeeklySnapshot(p);
  } else {
    p = {
      ...p,
      challenges: {
        ...p.challenges,
        [String(c.id)]: { status: "em_progresso", daysCompleted: newDays },
      },
      activityLog: addActivity(
        p.activityLog,
        `${c.title} — Dia ${newDays}/${days}`,
        Math.round(c.xp / days)
      ),
    };
  }
  saveProgress(p);
}

/** Check if a challenge should be locked based on current level */
export function isChallengeUnlocked(difficulty: "Iniciante" | "Guerreiro" | "Lenda", level: number): boolean {
  if (difficulty === "Iniciante") return true;
  if (difficulty === "Guerreiro") return level >= 2;
  return level >= 4;
}

/** Format minutes as "Xh Ym" */
export function fmtMinutes(m: number): string {
  if (m < 60) return `${m}min`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/** Average of all attributes */
export function avgAttributes(attrs: Attributes): number {
  const sum = ATTRIBUTE_NAMES.reduce((s, k) => s + attrs[k], 0);
  return Math.round(sum / ATTRIBUTE_NAMES.length);
}
