import { type ReactNode } from "react";
import { MusicPlayer } from "@/components/shared/MusicPlayer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <MusicPlayer />
    </>
  );
}
