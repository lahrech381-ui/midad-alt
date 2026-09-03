"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlaylistTrack } from "@/components/PlaylistTrack";
import { useAudio, type Track } from "@/lib/audio-context";
import Link from "next/link";
import { Play, Shuffle } from "lucide-react";
import type { Sourate, AudioItem } from "@/lib/types";

interface SouratePageClientProps {
  sourate: Sourate;
  audioItems: AudioItem[];
}

export function SouratePageClient({ sourate, audioItems }: SouratePageClientProps) {
  const { playCollection } = useAudio();

  const tracks: Track[] = audioItems.map((a) => ({
    id: `sourate-${sourate.number}-${a.id}`,
    title: a.title,
    url: a.file_url,
    scholar: a.scholar_name || undefined,
    collection: `سورة ${sourate.name_ar}`,
  }));

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <nav className="text-sm text-emerald-600 mb-6">
          <Link href="/quran/" className="hover:underline">القرآن الكريم</Link>
          <span className="mx-2">&larr;</span>
          <span className="text-emerald-900">{sourate.name_ar}</span>
        </nav>

        <div className="text-center py-8 bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl text-white mb-8">
          <p className="text-emerald-200 text-sm">سورة رقم</p>
          <p className="text-6xl font-bold">{sourate.number}</p>
          <h1 className="text-4xl font-bold mt-4">{sourate.name_ar}</h1>
          <p className="text-emerald-200 mt-2">{sourate.name_en}</p>
          <p className="text-emerald-300 text-sm mt-1">{sourate.name_fr}</p>
          <p className="mt-2">{sourate.ayah_count} آية</p>
          {tracks.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => playCollection(tracks)}
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <Play className="w-5 h-5" />
                تشغيل الكل
              </button>
              <button
                onClick={() => {
                  const shuffled = [...tracks].sort(() => Math.random() - 0.5);
                  playCollection(shuffled);
                }}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                عشوائي
              </button>
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-emerald-900 mb-4">تلاوات هذه السورة</h2>

        {tracks.length > 0 ? (
          <div className="space-y-2">
            {tracks.map((track, i) => (
              <PlaylistTrack key={track.id} track={track} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
            <p className="text-gray-500">لا توجد تلاوات متاحة حالياً لهذه السورة</p>
            <p className="text-sm text-gray-400 mt-2">
              يمكنك استكشاف المحتوى من{" "}
              <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
                Internet Archives
              </a>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
