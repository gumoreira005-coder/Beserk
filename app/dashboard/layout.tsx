"use client";

import { type ReactNode, useEffect } from "react";
import { syncToSupabase } from "@/lib/syncProfile";
import { UPDATE_EVENT } from "@/lib/gameData";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Sync on mount (login)
    syncToSupabase();

    // Sync whenever progress changes (focus, challenges, etc.)
    const handler = () => { syncToSupabase(); };
    window.addEventListener(UPDATE_EVENT, handler);
    return () => window.removeEventListener(UPDATE_EVENT, handler);
  }, []);

  return <>{children}</>;
}
