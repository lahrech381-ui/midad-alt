"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CardItem } from "@/components/CardItem";
import { getCollections } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 12;

export default function LecturesPage() {
  const [page, setPage] = useState(1);
  const lectures = getCollections("lectures");
  const hadith = getCollections("hadith");
  const nasheed = getCollections("nasheed");
  const tafsir = getCollections("tafsir");
  const allItems = [...lectures, ...hadith, ...nasheed, ...tafsir];

  const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
  const startIdx = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = allItems.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Group current items by category
  const grouped: Record<string, typeof allItems> = {};
  for (const item of currentItems) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  }

  const CATEGORY_LABELS: Record<string, string> = {
    lectures: "المحاضرات",
    hadith: "الحديث",
    nasheed: "النشيد",
    tafsir: "التفسير",
  };

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">المحاضرات والدروس</h1>
        <p className="text-emerald-700 mb-8">{allItems.length} مجموعة</p>

        {Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="mb-10">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">
              {CATEGORY_LABELS[category] || category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((c) => (
                <CardItem key={c.id} collection={c} />
              ))}
            </div>
          </section>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {allItems.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
            <p className="text-gray-500">لا توجد محاضرات متاحة حالياً</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
