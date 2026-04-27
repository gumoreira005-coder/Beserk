export type ThemeMode = "dark" | "light";
export type AccentColor = "red" | "blue" | "green" | "purple";

export interface AppTheme {
  mode: ThemeMode;
  accent: AccentColor;
}

const STORAGE_KEY = "berserk_theme";

export function loadTheme(): AppTheme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as AppTheme;
  } catch {}
  return { mode: "dark", accent: "red" };
}

export function saveTheme(theme: AppTheme): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {}
  applyTheme(theme);
}

export function applyTheme(theme: AppTheme): void {
  const html = document.documentElement;
  if (theme.mode === "light") {
    html.setAttribute("data-theme", "light");
  } else {
    html.removeAttribute("data-theme");
  }
  html.setAttribute("data-accent", theme.accent);
}
