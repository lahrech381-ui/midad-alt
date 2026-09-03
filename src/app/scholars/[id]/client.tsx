"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlaylistTrack } from "@/components/PlaylistTrack";
import { useAudio, type Track } from "@/lib/audio-context";
import Link from "next/link";
import { Play, Shuffle } from "lucide-react";
import type { Scholar, Collection, AudioItem } from "@/lib/types";

interface ScholarPageClientProps {
  scholar: Scholar;
  collections: Collection[];
  audioItems: AudioItem[];
}

export function ScholarPageClient({ scholar, collections, audioItems }: ScholarPageClientProps) {
  const { playCollection } = useAudio();

  const tracks: Track[] = audioItems.map((a) => ({
    id: `scholar-${scholar.id}-${a.id}`,
    title: a.title,
    url: a.file_url,
    scholar: scholar.name_ar,
    collection: a.collection_title || undefined,
  }));

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <nav className="text-sm text-emerald-600 mb-6">
          <Link href="/scholars/" className="hover:underline">العلماء</Link>
          <span className="mx-2">&larr;</span>
          <span className="text-emerald-900">{scholar.name_ar}</span>
        </nav>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-3xl text-white font-bold">{scholar.name_ar.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">{scholar.name_ar}</h1>
            {scholar.name_en && <p className="text-emerald-700">{scholar.name_en}</p>}
            {scholar.bio && <p className="text-gray-600 mt-2">{scholar.bio}</p>}
          </div>
        </div>

        {collections.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">السلاسل العلمية</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}/`}
                  className="bg-white rounded-xl p-4 shadow-md border border-emerald-100 hover:shadow-lg transition-all"
                >
                  <h3 className="font-bold text-emerald-900 text-sm">{c.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{c.item_count} عنصر</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {tracks.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-emerald-900">المحتوى الصوتي ({tracks.length})</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => playCollection(tracks)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-emerald-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  تشغيل الكل
                </button>
                <button
                  onClick={() => {
                    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
                    playCollection(shuffled);
                  }}
                  className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-sm flex items-center gap-2 hover:bg-emerald-200 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  عشوائي
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {tracks.slice(0, 20).map((track, i) => (
                <PlaylistTrack key={track.id} track={track} index={i} />
              ))}
            </div>
          </section>
        )}

        {collections.length === 0 && tracks.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
            <p className="text-gray-500">لا يوجد محتوى متاح حالياً لهذا العالم</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
