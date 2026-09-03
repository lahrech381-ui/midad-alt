"use client";

import { AudioProvider } from "@/lib/audio-context";
import { PlayerBar } from "./PlayerBar";
import type { ReactNode } from "react";

export function AudioShell({ children }: { children: ReactNode }) {
  return (
    <AudioProvider>
      <div className="min-h-screen pb-20">{children}</div>
      <PlayerBar />
    </AudioProvider>
  );
}
