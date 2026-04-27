"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { Camera, Check, Pencil, Share2, Copy, ExternalLink } from "lucide-react";

interface BerserkUser {
  name: string;
  email: string;
  username: string;
  nickname: string;
  avatar: string;
}

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<BerserkUser>({
    name: "",
    email: "",
    username: "",
    nickname: "",
    avatar: "",
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<BerserkUser>>({});
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const username =
      user.username ||
      user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "") ||
      "guerreiro";
    const url = `${window.location.origin}/perfil/${username}`;
    setShareUrl(url);
  }

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  useEffect(() => {
    try {
      const stored = localStorage.getItem("berserk_user");
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<BerserkUser>;
        setUser({
          name: parsed.name ?? "",
          email: parsed.email ?? "",
          username: parsed.username ?? (parsed.email?.split("@")[0] ?? ""),
          nickname: parsed.nickname ?? parsed.name ?? "",
          avatar: parsed.avatar ?? "",
        });
      }
    } catch {}
  }, []);

  function handleAvatar(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setUser((u: BerserkUser) => ({ ...u, avatar: result }));
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    const errs: Partial<BerserkUser> = {};
    if (!user.username.trim()) errs.username = "Obrigatório";
    if (user.username.includes(" ")) errs.username = "Sem espaços";
    if (!user.nickname.trim()) errs.nickname = "Obrigatório";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    localStorage.setItem("berserk_user", JSON.stringify(user));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.dispatchEvent(new Event("berserk_user_updated"));
  }

  const initial = (user.nickname || user.name || "G").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 max-w-2xl">

          <div className="mb-8">
            <h1 className="font-heading text-2xl font-black tracking-[0.15em] uppercase text-foreground">
              Perfil
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Personalize sua identidade no Berserk.</p>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-6 mb-8 p-6 bg-card border border-border rounded-xl">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-primary flex items-center justify-center ring-2 ring-border">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-black font-heading text-primary-foreground">{initial}</span>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </div>
            <div>
              <p className="text-foreground font-medium">{user.nickname || user.name || "Guerreiro"}</p>
              <p className="text-muted-foreground text-sm">@{user.username || "usuario"}</p>
              <button
                onClick={() => fileRef.current?.click()}
                className="text-xs text-accent hover:underline mt-1 flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> Alterar foto
              </button>
            </div>
          </div>

          {/* Compartilhar Perfil */}
          <div className="p-6 bg-card border border-border rounded-xl space-y-4 mb-5">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-accent" />
              <p className="text-foreground font-heading font-black text-sm uppercase tracking-widest">Compartilhar Perfil</p>
            </div>
            <p className="text-muted-foreground text-sm">
              Gere um link com um snapshot do seu perfil atual. Qualquer pessoa com o link consegue visualizar seus atributos, nível e estatísticas.
            </p>

            {!shareUrl ? (
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent font-heading font-black text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg hover:bg-accent/20 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Gerar Link do Perfil
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                  <span className="flex-1 text-xs text-muted-foreground truncate font-mono">{shareUrl}</span>
                  <button onClick={handleCopy} className={`shrink-0 flex items-center gap-1 text-xs font-heading font-black transition-colors ${ copied ? "text-green-400" : "text-accent hover:text-accent/80" }`}>
                    {copied ? <><Check className="w-3 h-3" /> Copiado!</> : <><Copy className="w-3 h-3" /> Copiar</>}
                  </button>
                </div>
                <div className="flex gap-2">
                  <a href={shareUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="w-3 h-3" /> Ver como outros veem
                  </a>
                  <button onClick={handleShare} className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    ↺ Atualizar snapshot
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Campos */}
          <div className="space-y-5 p-6 bg-card border border-border rounded-xl">

            {/* Apelido */}
            <div>
              <label className="text-xs font-game uppercase tracking-widest text-muted-foreground block mb-1.5">
                Apelido <span className="text-muted-foreground/60 normal-case font-sans font-normal">(visível para outros)</span>
              </label>
              <input
                value={user.nickname}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUser((u: BerserkUser) => ({ ...u, nickname: e.target.value }))}
                placeholder="Como quer ser chamado?"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              {errors.nickname && <p className="text-destructive text-xs mt-1">{errors.nickname}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="text-xs font-game uppercase tracking-widest text-muted-foreground block mb-1.5">
                Nome de usuário <span className="text-muted-foreground/60 normal-case font-sans font-normal">(usado no login)</span>
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-background border border-r-0 border-border rounded-l-lg text-muted-foreground text-sm select-none">@</span>
                <input
                  value={user.username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUser((u: BerserkUser) => ({ ...u, username: e.target.value.toLowerCase().replace(/\s/g, "") }))
                  }
                  placeholder="seuusername"
                  className="flex-1 bg-background border border-border rounded-r-lg px-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              {errors.username && <p className="text-destructive text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="text-xs font-game uppercase tracking-widest text-muted-foreground block mb-1.5">
                E-mail
              </label>
              <input
                value={user.email}
                readOnly
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-muted-foreground text-sm cursor-not-allowed"
              />
            </div>

            {/* Botão salvar */}
            <button
              onClick={handleSave}
              className={`w-full py-3 rounded-lg font-heading font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {saved ? (
                <><Check className="w-4 h-4" /> Salvo!</>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
