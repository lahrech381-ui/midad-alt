"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { searchAll } from "@/lib/data";
import { searchIslamicAudio, getDownloadURL, type IAResult } from "@/lib/internet-archive";
import { Search, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [localResults, setLocalResults] = useState<{ type: string; items: unknown[] }[]>([]);
  const [iaResults, setIaResults] = useState<IAResult[]>([]);
  const [loadingIA, setLoadingIA] = useState(false);
  const [searchMode, setSearchMode] = useState<"local" | "live" | "both">("both");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Local search always
    setLocalResults(searchAll(query));

    // Live IA search
    if (searchMode === "live" || searchMode === "both") {
      setLoadingIA(true);
      try {
        const results = await searchIslamicAudio(query, 20);
        setIaResults(results);
      } catch {
        setIaResults([]);
      } finally {
        setLoadingIA(false);
      }
    }
  };

  const totalLocal = localResults.reduce((sum, r) => sum + r.items.length, 0);

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-6">بحث</h1>

        {/* Search mode selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSearchMode("both")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              searchMode === "both" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            محلي + مباشر
          </button>
          <button
            onClick={() => setSearchMode("local")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              searchMode === "local" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            محلي فقط
          </button>
          <button
            onClick={() => setSearchMode("live")}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              searchMode === "live" ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            مباشر من IA
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في القرآن والمحاضرات والعلماء..."
              className="flex-1 px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
            />
            <button
              type="submit"
              disabled={loadingIA}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loadingIA ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              بحث
            </button>
          </div>
        </form>

        {/* Local results */}
        {(searchMode === "local" || searchMode === "both") && localResults.length > 0 && (
          <div className="mb-8">
            <p className="text-emerald-700 mb-4">{totalLocal} نتيجة محلية</p>
            {localResults.map((group) =>
              group.items.length > 0 ? (
                <section key={group.type} className="mb-6">
                  <h2 className="text-lg font-bold text-emerald-900 mb-3">
                    {group.type === "scholars"
                      ? "العلماء"
                      : group.type === "collections"
                      ? "السلاسل"
                      : "المحتوى الصوتي"}
                  </h2>
                  <div className="space-y-2">
                    {group.type === "scholars" &&
                      group.items.map((item) => {
                        const s = item as { id: number; name_ar: string; name_en?: string };
                        return (
                          <Link
                            key={s.id}
                            href={`/scholars/${s.id}/`}
                            className="block bg-white rounded-xl p-4 shadow-md border border-emerald-100 hover:shadow-lg transition-all"
                          >
                            <p className="font-bold text-emerald-900">{s.name_ar}</p>
                            {s.name_en && <p className="text-gray-500 text-sm">{s.name_en}</p>}
                          </Link>
                        );
                      })}
                    {group.type === "collections" &&
                      group.items.map((item) => {
                        const c = item as { id: number; title: string; scholar_name?: string; item_count: number };
                        return (
                          <Link
                            key={c.id}
                            href={`/courses/${c.id}/`}
                            className="block bg-white rounded-xl p-4 shadow-md border border-emerald-100 hover:shadow-lg transition-all"
                          >
                            <p className="font-bold text-emerald-900">{c.title}</p>
                            {c.scholar_name && <p className="text-gray-500 text-sm">{c.scholar_name}</p>}
                            <p className="text-gray-400 text-xs">{c.item_count} عنصر</p>
                          </Link>
                        );
                      })}
                    {group.type === "audio" &&
                      group.items.map((item) => {
                        const a = item as { id: number; title: string; file_url: string; scholar_name?: string };
                        return (
                          <AudioPlayer
                            key={a.id}
                            src={a.file_url}
                            title={a.title}
                            scholar={a.scholar_name}
                          />
                        );
                      })}
                  </div>
                </section>
              ) : null
            )}
          </div>
        )}

        {/* Live IA results */}
        {(searchMode === "live" || searchMode === "both") && (
          <div>
            {loadingIA && (
              <div className="flex items-center gap-2 py-8">
                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                <span className="text-emerald-700">جاري البحث في Internet Archives...</span>
              </div>
            )}

            {!loadingIA && iaResults.length > 0 && (
              <div>
                <p className="text-emerald-700 mb-4">{iaResults.length} نتيجة من Internet Archives</p>
                <div className="space-y-3">
                  {iaResults.map((item) => {
                    const url = getDownloadURL(item.identifier, "");
                    return (
                      <div
                        key={item.identifier}
                        className="bg-white rounded-xl p-4 shadow-md border border-emerald-100 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
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
                            </div>
                          </div>
                          <a
                            href={`https://archive.org/details/${item.identifier}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-500 hover:text-emerald-700 flex-shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <div className="mt-3">
                          <Link
                            href={`/live/?q=${item.identifier}`}
                            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                          >
                            استمع الآن &larr;
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!loadingIA && query && iaResults.length === 0 && localResults.length === 0 && (
              <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
                <p className="text-gray-500">لا توجد نتائج لـ &quot;{query}&quot;</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
