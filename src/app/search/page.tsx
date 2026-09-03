"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { searchAll } from "@/lib/data";
import { Search } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setResults(searchAll(query));
    }
  };

  const totalResults = results.reduce((sum, r) => sum + r.items.length, 0);

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-6">بحث</h1>

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
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              بحث
            </button>
          </div>
        </form>

        {results.length > 0 && (
          <p className="text-emerald-700 mb-4">
            {totalResults} نتيجة
          </p>
        )}

        {results.map((group) =>
          group.items.length > 0 ? (
            <section key={group.type} className="mb-8">
              <h2 className="text-lg font-bold text-emerald-900 mb-3 capitalize">
                {group.type === "scholars"
                  ? "العلماء"
                  : group.type === "collections"
                  ? "السلاسل"
                  : "المحتوى الصوتي"}
              </h2>
              <div className="space-y-2">
                {group.type === "scholars" &&
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  group.items.map((item: any) => {
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  group.items.map((item: any) => {
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  group.items.map((item: any) => {
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

        {query && totalResults === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
            <p className="text-gray-500">لا توجد نتائج لـ &quot;{query}&quot;</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
