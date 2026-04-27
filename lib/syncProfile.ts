// Sync local progress to Supabase so profiles are accessible online
import { supabase } from "./supabase";
import { loadProgress } from "./gameData";

export interface SupabaseProfile {
  id?: string;
  username: string;
  nickname: string;
  email: string;
  level: number;
  xp: number;
  attributes: Record<string, number>;
  streak: number;
  focus_minutes_total: number;
  challenges_completed: number;
  updated_at?: string;
}

/** Push current localStorage progress to Supabase. Fire-and-forget. */
export async function syncToSupabase(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const userRaw = localStorage.getItem("berserk_user");
    if (!userRaw) return;
    const user = JSON.parse(userRaw) as {
      name?: string; nickname?: string; email?: string; username?: string;
    };
    if (!user.email) return;

    const progress = loadProgress();
    const username =
      user.username ||
      user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "") ||
      "guerreiro";
    const nickname = user.nickname || user.name || "Guerreiro";
    const challengesCompleted = Object.values(progress.challenges).filter(
      (c) => c.status === "concluido"
    ).length;

    const payload: SupabaseProfile = {
      username,
      nickname,
      email: user.email,
      level: progress.level,
      xp: progress.xp,
      attributes: progress.attributes as Record<string, number>,
      streak: progress.streak,
      focus_minutes_total: progress.focusMinutesTotal,
      challenges_completed: challengesCompleted,
      updated_at: new Date().toISOString(),
    };

    await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "email" });
  } catch {
    // Silently fail — app works offline too
  }
}

/** Fetch a public profile by username from Supabase */
export async function fetchPublicProfile(username: string): Promise<SupabaseProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();
    if (error || !data) return null;
    return data as SupabaseProfile;
  } catch {
    return null;
  }
}

/** Fetch all profiles ordered by XP (for live ranking) */
export async function fetchLeaderboard(limit = 50): Promise<SupabaseProfile[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("xp", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data as SupabaseProfile[];
  } catch {
    return [];
  }
}
