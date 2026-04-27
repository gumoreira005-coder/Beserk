"use client";

import { type ReactNode, useEffect } from "react";
import { syncToSupabase } from "@/lib/syncProfile";
import { UPDATE_EVENT } from "@/lib/gameData";
import { PageTransition } from "@/components/shared/PageTransition";
import { TopProgressBar } from "@/components/shared/TopProgressBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    syncToSupabase();
    const handler = () => { syncToSupabase(); };
    window.addEventListener(UPDATE_EVENT, handler);
    return () => window.removeEventListener(UPDATE_EVENT, handler);
  }, []);

  return (
    <>
      <TopProgressBar />
      <PageTransition>{children}</PageTransition>
    </>
  );
}
