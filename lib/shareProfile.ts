// Profile sharing — encode/decode via base64 URL param
// No backend needed: the full profile is embedded in the link itself.

import { type GameProgress, type Attributes, ATTRIBUTE_NAMES, avgAttributes, xpToLevel } from "./gameData";

export interface SharedProfile {
  name: string;
  nickname: string;
  level: number;
  xp: number;
  attributes: Attributes;
  streak: number;
  focusMinutesTotal: number;
  challengesCompleted: number;
  ts: number; // unix ms when generated
}

/** Encode the current user's profile into a base64 URL param */
export function encodeProfile(progress: GameProgress, userName: string, nickname: string): string {
  const completedCount = Object.values(progress.challenges).filter(
    (c) => c.status === "concluido"
  ).length;

  const payload: SharedProfile = {
    name: userName,
    nickname: nickname || userName,
    level: progress.level,
    xp: progress.xp,
    attributes: progress.attributes,
    streak: progress.streak,
    focusMinutesTotal: progress.focusMinutesTotal,
    challengesCompleted: completedCount,
    ts: Date.now(),
  };

  try {
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  } catch {
    return "";
  }
}

/** Decode a base64 URL param back into a SharedProfile */
export function decodeProfile(encoded: string): SharedProfile | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const raw = JSON.parse(json) as Partial<SharedProfile>;

    // Fill missing attributes with 0
    const emptyAttrs: Attributes = Object.fromEntries(
      ATTRIBUTE_NAMES.map((k) => [k, 0])
    ) as Attributes;

    return {
      name: raw.name ?? "Guerreiro",
      nickname: raw.nickname ?? raw.name ?? "Guerreiro",
      level: raw.level ?? 1,
      xp: raw.xp ?? 0,
      attributes: { ...emptyAttrs, ...(raw.attributes ?? {}) },
      streak: raw.streak ?? 0,
      focusMinutesTotal: raw.focusMinutesTotal ?? 0,
      challengesCompleted: raw.challengesCompleted ?? 0,
      ts: raw.ts ?? Date.now(),
    };
  } catch {
    return null;
  }
}

/** Helper: warrior class label from level */
export function warriorLabel(level: number): string {
  if (level >= 6) return "Lenda";
  if (level >= 4) return "Veterano";
  if (level >= 2) return "Guerreiro";
  return "Iniciante";
}

/** Format minutes as Xh Ym */
export function fmtMin(m: number): string {
  if (m < 60) return `${m}min`;
  return `${Math.floor(m / 60)}h ${m % 60 > 0 ? `${m % 60}m` : ""}`.trim();
}

export { avgAttributes, xpToLevel };
