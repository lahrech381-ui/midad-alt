"use client";

import { useState, useCallback } from "react";
import { searchIslamicAudio, getDownloadURL, type IAResult } from "@/lib/internet-archive";
import { useAudio, type Track } from "@/lib/audio-context";
import { Search, Loader2, Play, ExternalLink } from "lucide-react";

const PRESETS = [
  { label: "قرآن كريم", query: "quran recitation arabic" },
  { label: "محاضرات إسلامية", query: "islamic lecture" },
  { label: "نشيد إسلامي", query: "nasheed islamic" },
  { label: "فقه إسلامي", query: "islamic fiqh lecture" },
  { label: "حديث شريف", query: "hadith arabic" },
  { label: "تفسير", query: "tafsir quran" },
];

export function IABrowser() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IAResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IAResult | null>(null);
  const [mp3Files, setMp3Files] = useState<{ name: string; title?: string; size: string }[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const { play, playCollection, currentTrack, isPlaying, toggle } = useAudio();

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await searchIslamicAudio(q, 20);
      setResults(res);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPreset = (preset: (typeof PRESETS)[0]) => {
    setQuery(preset.query);
    setActivePreset(preset.label);
    doSearch(preset.query);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActivePreset(null);
    doSearch(query);
  };

  const loadFiles = async (item: IAResult) => {
    setSelectedItem(item);
    setMp3Files([]);
    setLoadingFiles(true);
    try {
      const res = await fetch(`https://archive.org/metadata/${item.identifier}`);
      const data = await res.json();
      const files = (data.files || []).filter(
        (f: { name: string; format: string }) =>
          f.format === "VBR MP3" || f.format === "MP3" || f.format === "OGG VORBIS" || f.name?.endsWith(".mp3")
      );
      setMp3Files(files);

      // Auto-play as playlist
      if (files.length > 0) {
        const tracks: Track[] = files.map((f: { name: string; title?: string; size: string }) => ({
          id: `ia-${item.identifier}-${f.name}`,
          title: f.title || f.name.replace(/\.[^.]+$/, "").replace(/_/g, " "),
          url: getDownloadURL(item.identifier, f.name),
          scholar: item.creator,
          collection: item.title,
        }));
        playCollection(tracks);
      }
    } catch (err) {
      console.error("Files error:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في Internet Archives..."
          className="flex-1 px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          بحث مباشر
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => loadPreset(preset)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              activePreset === preset.label
                ? "bg-emerald-600 text-white"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="mr-2 text-emerald-700">جاري البحث في Internet Archives...</span>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-emerald-700 text-sm">{results.length} نتيجة</p>
          {results.map((item) => {
            const isCurrent = currentTrack?.collection === item.title;
            return (
              <div
                key={item.identifier}
                className={`bg-white rounded-xl p-4 shadow-md border transition-all cursor-pointer ${
                  isCurrent && isPlaying
                    ? "border-emerald-500 ring-2 ring-emerald-200"
                    : "border-emerald-100 hover:shadow-lg"
                }`}
                onClick={() => loadFiles(item)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-emerald-900 truncate">{item.title}</h3>
                    {item.creator && <p className="text-emerald-600 text-sm">{item.creator}</p>}
                    {item.description && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      {item.year && <span>{item.year}</span>}
                      {item.downloads && <span>{item.downloads.toLocaleString()} تحميل</span>}
                      {item.files_count && <span>{item.files_count} ملف</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCurrent && isPlaying ? (
                      <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                        <div className="flex gap-0.5">
                          <span className="w-0.5 h-3 bg-white animate-pulse" />
                          <span className="w-0.5 h-4 bg-white animate-pulse" style={{ animationDelay: "0.2s" }} />
                          <span className="w-0.5 h-2 bg-white animate-pulse" style={{ animationDelay: "0.4s" }} />
                        </div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}
                    <a
                      href={`https://archive.org/details/${item.identifier}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:text-emerald-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedItem && (
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <h3 className="font-bold text-emerald-900 mb-4">ملفات: {selectedItem.title}</h3>
          {loadingFiles ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              <span className="text-emerald-700">جاري تحميل الملفات...</span>
            </div>
          ) : mp3Files.length > 0 ? (
            <p className="text-emerald-700 text-sm">جاري التشغيل في المشغل السفلي...</p>
          ) : (
            <p className="text-gray-500">لا توجد ملفات MP3</p>
          )}
        </div>
      )}
    </div>
  );
}
