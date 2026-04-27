"use client";

import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;
    const onCanPlay = () => setReady(true);
    audio.addEventListener("canplaythrough", onCanPlay);
    return () => audio.removeEventListener("canplaythrough", onCanPlay);
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  function handleVolume(e: ChangeEvent<HTMLInputElement>) {
    const v = parseFloat(e.target.value);
    setVolume(v);
    setMuted(v === 0);
  }

  return (
    <>
      <audio ref={audioRef} src="/music/theme.mp3" preload="auto" />

      {/* Player flutuante */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

        {/* Painel expandido */}
        {expanded && (
          <div className="bg-card border border-border rounded-xl p-4 shadow-2xl w-60 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">The Minstrel&apos;s Return</p>
                <p className="text-xs text-muted-foreground">Kaazoom · Medieval RPG</p>
              </div>
            </div>

            {/* Barra de volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="flex-1 h-1 accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground w-7 text-right">
                {Math.round((muted ? 0 : volume) * 100)}%
              </span>
            </div>

            {/* Visualizador animado quando toca */}
            {playing && (
              <div className="flex items-end gap-0.5 h-4 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="w-1 bg-primary rounded-full animate-bounce"
                    style={{ height: `${Math.random() * 12 + 4}px`, animationDelay: `${i * 0.1}s`, animationDuration: `${0.5 + i * 0.1}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Botão principal */}
        <button
          onClick={() => {
            if (!playing && !expanded) { toggle(); setExpanded(true); }
            else if (expanded) setExpanded(false);
            else setExpanded(true);
          }}
          className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 ${
            playing
              ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
          title={playing ? "Música tocando" : "Tocar música"}
        >
          {playing ? (
            <span className="flex items-end gap-0.5 h-5">
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-0.5 bg-primary-foreground rounded-full animate-bounce"
                  style={{ height: `${8 + i * 4}px`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </span>
          ) : (
            <Music className="w-5 h-5" />
          )}
        </button>

        {/* Play/Pause quando expandido */}
        {expanded && (
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        )}
      </div>
    </>
  );
}
