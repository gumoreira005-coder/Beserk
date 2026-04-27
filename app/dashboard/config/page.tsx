"use client";

import { useState, useEffect, type ChangeEvent, type ReactNode } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { Bell, Eye, Shield, Trash2, Moon, Sun, Check, Lock } from "lucide-react";

interface AppSettings {
  theme: "dark" | "light";
  accentColor: string;
  language: string;
  notifyFocus: boolean;
  notifyChallenge: boolean;
  notifyStreak: boolean;
  profilePublic: boolean;
  showStats: boolean;
}

const DEFAULTS: AppSettings = {
  theme: "dark",
  accentColor: "#E63946",
  language: "pt-BR",
  notifyFocus: true,
  notifyChallenge: true,
  notifyStreak: true,
  profilePublic: true,
  showStats: true,
};

const ACCENT_COLORS = [
  { label: "Berserk", value: "#E63946" },
  { label: "Ouro", value: "#D4AF37" },
  { label: "Azul", value: "#4361EE" },
  { label: "Verde", value: "#2DC653" },
  { label: "Roxo", value: "#8B5CF6" },
  { label: "Laranja", value: "#F97316" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 mt-0.5 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-heading font-black uppercase tracking-[0.15em] text-sm text-foreground">{title}</h2>
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function Row({ label, description, children }: { label: string; description?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 gap-4">
      <div className="min-w-0">
        <p className="text-sm text-foreground font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function ConfigPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("berserk_settings");
      if (stored) setSettings({ ...DEFAULTS, ...(JSON.parse(stored) as Partial<AppSettings>) });
    } catch {}
  }, []);

  function set<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((s: AppSettings) => ({ ...s, [key]: value }));
  }

  function handleSave() {
    localStorage.setItem("berserk_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDeleteAccount() {
    if (deleteInput !== "DELETAR") return;
    localStorage.removeItem("berserk_user");
    localStorage.removeItem("berserk_settings");
    localStorage.removeItem("berserk_onboarding");
    window.location.href = "/auth";
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 max-w-2xl space-y-6">

          <div>
            <h1 className="font-heading text-2xl font-black tracking-[0.15em] uppercase text-foreground">
              Configurações
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Personalize sua experiência no Berserk.</p>
          </div>

          {/* Aparência */}
          <Section title="Aparência">
            <Row label="Tema" description="Escolha entre modo escuro e claro">
              <div className="flex gap-2">
                <button
                  onClick={() => set("theme", "dark")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    settings.theme === "dark"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Escuro
                </button>
                <button
                  onClick={() => set("theme", "light")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    settings.theme === "light"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Claro
                </button>
              </div>
            </Row>

            <Row label="Cor de destaque" description="Cor usada nos elementos principais">
              <div className="flex gap-2">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => set("accentColor", c.value)}
                    title={c.label}
                    className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                    style={{ backgroundColor: c.value, outline: settings.accentColor === c.value ? `2px solid ${c.value}` : "none", outlineOffset: "2px" }}
                  />
                ))}
              </div>
            </Row>

            <Row label="Idioma">
              <select
                value={settings.language}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => set("language", e.target.value)}
                className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="pt-BR">Português (BR)</option>
                <option value="en-US">English (US)</option>
                <option value="es">Español</option>
              </select>
            </Row>
          </Section>

          {/* Notificações */}
          <Section title="Notificações">
            <Row label="Sessão de Foco" description="Aviso ao iniciar e terminar sessões">
              <Toggle checked={settings.notifyFocus} onChange={() => set("notifyFocus", !settings.notifyFocus)} />
            </Row>
            <Row label="Desafios" description="Novos desafios e conclusões">
              <Toggle checked={settings.notifyChallenge} onChange={() => set("notifyChallenge", !settings.notifyChallenge)} />
            </Row>
            <Row label="Sequência" description="Lembrete diário para manter sua sequência">
              <Toggle checked={settings.notifyStreak} onChange={() => set("notifyStreak", !settings.notifyStreak)} />
            </Row>
          </Section>

          {/* Privacidade */}
          <Section title="Privacidade">
            <Row label="Perfil público" description="Outros guerreiros podem ver seu perfil">
              <Toggle checked={settings.profilePublic} onChange={() => set("profilePublic", !settings.profilePublic)} />
            </Row>
            <Row label="Exibir atributos" description="Mostrar seus atributos para outros">
              <Toggle checked={settings.showStats} onChange={() => set("showStats", !settings.showStats)} />
            </Row>
          </Section>

          {/* Conta */}
          <Section title="Conta">
            <Row label="Alterar senha" description="Redefina sua senha de acesso">
              <button
                onClick={() => alert("Em breve!")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <Lock className="w-3.5 h-3.5" /> Alterar
              </button>
            </Row>
            <Row label="Excluir conta" description="Apaga todos os seus dados permanentemente">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Excluir
              </button>
            </Row>
          </Section>

          {/* Botão salvar */}
          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-lg font-heading font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 ${
              saved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {saved ? <><Check className="w-4 h-4" /> Salvo!</> : "Salvar Configurações"}
          </button>

        </main>
      </div>

      {/* Modal excluir conta */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-heading font-black text-foreground">Excluir conta</h3>
                <p className="text-xs text-muted-foreground">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Digite <span className="text-destructive font-mono font-bold">DELETAR</span> para confirmar.
            </p>
            <input
              value={deleteInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDeleteInput(e.target.value)}
              placeholder="DELETAR"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none focus:border-destructive"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                className="flex-1 py-2 rounded-lg text-sm bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== "DELETAR"}
                className="flex-1 py-2 rounded-lg text-sm bg-destructive text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
