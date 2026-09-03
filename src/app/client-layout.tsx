"use client";

import { AudioShell } from "@/components/AudioShell";
import type { ReactNode } from "react";

export function ClientLayout({ children }: { children: ReactNode }) {
  return <AudioShell>{children}</AudioShell>;
}
