"use client";

import { AudioShell } from "@/components/AudioShell";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-900">
        <AudioShell>{children}</AudioShell>
      </body>
    </html>
  );
}
