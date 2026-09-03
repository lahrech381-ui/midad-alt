"use client";

import { useState, useEffect, useCallback } from "react";
import { searchIslamicAudio, browseIA, getDownloadURL, type IAResult } from "@/lib/internet-archive";
import { AudioPlayer } from "./AudioPlayer";
import { Search, Loader2, RefreshCw, ExternalLink } from "lucide-react";

const PRESETS = [
  { label: "قرآن كريم", query: "quran recitation arabic" },
  { label: "محاضرات إسلامية", query: "islamic lecture" },
  { label: "eldon nashid", query: "nasheed islamic" },
  { label: "فقه إسلامي", query: "islamic fiqh lecture" },
  { label: "حديث شريف", query: "hadith arabic" },
  { label: "تفسير", query: "tafsir quran" },
];

export function IABrowser() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IAResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IAResult | null>(null);
  const [mp3Files, setMp3Files] = useState<{name: string; title?: string; size: string}[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const doSearch = useCallback(async (q: string, start: number = 0) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await searchIslamicAudio(q, 20);
      setResults(res);
      setPage(start);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPreset = (preset: typeof PRESETS[0]) => {
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
    setLoadingFiles(true);
    try {
      const res = await fetch(`https://archive.org/metadata/${item.identifier}`);
      const data = await res.json();
      const files = (data.files || []).filter(
        (f: {name: string; format: string}) =>
          f.format === "VBR MP3" ||
          f.format === "MP3" ||
          f.format === "OGG VORBIS" ||
          f.name?.endsWith(".mp3")
      );
      setMp3Files(files);
    } catch (err) {
      console.error("Files error:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
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

      {/* Presets */}
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

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="mr-2 text-emerald-700">جاري البحث في Internet Archives...</span>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-emerald-700 text-sm">{results.length} نتيجة</p>
          {results.map((item) => (
            <div
              key={item.identifier}
              className={`bg-white rounded-xl p-4 shadow-md border transition-all cursor-pointer ${
                selectedItem?.identifier === item.identifier
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-emerald-100 hover:shadow-lg"
              }`}
              onClick={() => loadFiles(item)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-emerald-900 truncate">{item.title}</h3>
                  {item.creator && (
                    <p className="text-emerald-600 text-sm">{item.creator}</p>
                  )}
                  {item.description && (
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {item.year && <span>{item.year}</span>}
                    {item.downloads && <span>{item.downloads.toLocaleString()} تحميل</span>}
                    {item.files_count && <span>{item.files_count} ملف</span>}
                  </div>
                </div>
                <a
                  href={`https://archive.org/details/${item.identifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-500 hover:text-emerald-700 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected item files */}
      {selectedItem && (
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <h3 className="font-bold text-emerald-900 mb-4">
            ملفات: {selectedItem.title}
          </h3>

          {loadingFiles ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
              <span className="text-emerald-700">جاري تحميل الملفات...</span>
            </div>
          ) : mp3Files.length > 0 ? (
            <div className="space-y-3">
              {mp3Files.map((file, i) => {
                const url = getDownloadURL(selectedItem.identifier, file.name);
                const sizeKB = parseInt(file.size) / 1024;
                const sizeMB = (sizeKB / 1024).toFixed(1);
                return (
                  <div key={i}>
                    <AudioPlayer
                      src={url}
                      title={file.title || file.name.replace(/\.[^.]+$/, "").replace(/_/g, " ")}
                      scholar={selectedItem.creator}
                    />
                    <p className="text-xs text-gray-400 mt-1 mr-4">{sizeMB} MB</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">لا توجد ملفات MP3</p>
          )}
        </div>
      )}
    </div>
  );
}
