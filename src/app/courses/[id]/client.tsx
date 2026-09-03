"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PlaylistTrack } from "@/components/PlaylistTrack";
import { useAudio, type Track } from "@/lib/audio-context";
import Link from "next/link";
import { Play, Shuffle } from "lucide-react";
import type { Collection, AudioItem } from "@/lib/types";

interface CollectionPageClientProps {
  collection: Collection;
  audioItems: AudioItem[];
}

export function CollectionPageClient({ collection, audioItems }: CollectionPageClientProps) {
  const { playCollection } = useAudio();

  const tracks: Track[] = audioItems.map((a) => ({
    id: `col-${collection.id}-${a.id}`,
    title: a.title,
    url: a.file_url,
    scholar: a.scholar_name || collection.scholar_name || undefined,
    collection: collection.title,
  }));

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <nav className="text-sm text-emerald-600 mb-6">
          <Link href="/courses/" className="hover:underline">المكتبة</Link>
          <span className="mx-2">&larr;</span>
          <span className="text-emerald-900">{collection.title}</span>
        </nav>

        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">{collection.title}</h1>
          {collection.scholar_name && (
            <p className="text-emerald-200">{collection.scholar_name}</p>
          )}
          {collection.description && (
            <p className="text-emerald-300 mt-4 text-sm leading-relaxed line-clamp-3">{collection.description}</p>
          )}
          <div className="flex items-center gap-4 mt-6">
            <p className="text-emerald-200 text-sm">{tracks.length} عنصر صوتي</p>
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
        </div>

        {tracks.length > 0 ? (
          <div className="space-y-2">
            {tracks.map((track, i) => (
              <PlaylistTrack key={track.id} track={track} index={i} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
            <p className="text-gray-500">لا يوجد محتوى صوتي متاح</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
