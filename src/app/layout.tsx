import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مداد البديل - القرآن الكريم والدروس والمقالات والكتب",
  description:
    "موقع إسلامي علمي ودعوي يحتوي على القرآن الكريم ودروس ومحاضرات صوتية ومقالات وكتب متنوعة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
