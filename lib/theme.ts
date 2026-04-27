export type ThemeMode = "dark" | "light";
export type AccentColor = "red" | "blue" | "green" | "purple";

export interface AppTheme {
  mode: ThemeMode;
  accent: AccentColor;
}

const STORAGE_KEY = "berserk_theme";

const DARK_VARS: Record<string, string> = {
  "--background":             "10 10 15",
  "--foreground":             "236 240 241",
  "--card":                   "26 26 46",
  "--card-foreground":        "236 240 241",
  "--popover":                "26 26 46",
  "--popover-foreground":     "236 240 241",
  "--primary-foreground":     "236 240 241",
  "--secondary":              "22 22 42",
  "--secondary-foreground":   "236 240 241",
  "--muted":                  "22 22 42",
  "--muted-foreground":       "149 165 166",
  "--accent":                 "243 156 18",
  "--accent-foreground":      "10 10 15",
  "--destructive":            "231 76 60",
  "--destructive-foreground": "236 240 241",
  "--border":                 "42 42 74",
  "--input":                  "22 22 42",
  "--void":                   "10 10 15",
  "--surface":                "26 26 46",
  "--steel":                  "236 240 241",
  "--iron":                   "149 165 166",
  "--gold":                   "243 156 18",
  "--blood":                  "231 76 60",
};

const LIGHT_VARS: Record<string, string> = {
  "--background":             "248 249 250",
  "--foreground":             "26 26 46",
  "--card":                   "255 255 255",
  "--card-foreground":        "26 26 46",
  "--popover":                "255 255 255",
  "--popover-foreground":     "26 26 46",
  "--primary-foreground":     "255 255 255",
  "--secondary":              "233 236 239",
  "--secondary-foreground":   "26 26 46",
  "--muted":                  "233 236 239",
  "--muted-foreground":       "108 117 125",
  "--accent":                 "243 156 18",
  "--accent-foreground":      "255 255 255",
  "--destructive":            "220 53 69",
  "--destructive-foreground": "255 255 255",
  "--border":                 "222 226 230",
  "--input":                  "233 236 239",
  "--void":                   "248 249 250",
  "--surface":                "255 255 255",
  "--steel":                  "26 26 46",
  "--iron":                   "108 117 125",
  "--gold":                   "243 156 18",
  "--blood":                  "220 53 69",
};

const ACCENT_VARS: Record<AccentColor, Record<string, string>> = {
  red:    { "--primary": "192 57 43",  "--ring": "192 57 43",  "--berserk": "192 57 43"  },
  blue:   { "--primary": "41 128 185", "--ring": "41 128 185", "--berserk": "41 128 185" },
  green:  { "--primary": "39 174 96",  "--ring": "39 174 96",  "--berserk": "39 174 96"  },
  purple: { "--primary": "142 68 173", "--ring": "142 68 173", "--berserk": "142 68 173" },
};

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
  const modeVars = theme.mode === "light" ? LIGHT_VARS : DARK_VARS;
  const accentVars = ACCENT_VARS[theme.accent];

  Object.entries({ ...modeVars, ...accentVars }).forEach(([k, v]) => {
    html.style.setProperty(k, v);
  });

  html.setAttribute("data-theme",  theme.mode === "light" ? "light" : "dark");
  html.setAttribute("data-accent", theme.accent);
}
