"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getCollections, getCategories, getStats } from "@/lib/data";
import { BookOpen, Headphones, Users, Search, Filter, ChevronLeft } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  quran: "القرآن الكريم",
  quran_translation: "القرآن بالترجمة",
  lectures: "المحاضرات",
  hadith: "الحديث الشريف",
  tafsir: "التفسير",
  nasheed: "الإنشاد",
  audiobooks: "الكتب المسموعة",
  books: "الكتب",
  videos: "المرئيات",
  fiqh: "الفقه",
  seerah: "السيرة",
};

const CATEGORY_ICONS: Record<string, string> = {
  quran: "📖",
  quran_translation: "🌐",
  lectures: "🎤",
  hadith: "📜",
  tafsir: "📚",
  nasheed: "🎵",
  audiobooks: "🎧",
  books: "📕",
  videos: "🎬",
  fiqh: "⚖️",
  seerah: "📅",
};

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const stats = getStats();
  const categories = getCategories();
  const allCollections = getCollections();

  const filteredCollections = useMemo(() => {
    let result = allCollections;
    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [allCollections, selectedCategory, searchQuery]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, typeof allCollections> = {};
    for (const col of filteredCollections) {
      if (!groups[col.category]) groups[col.category] = [];
      groups[col.category].push(col);
    }
    return groups;
  }, [filteredCollections]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-l from-emerald-900 to-teal-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">المكتبة الصوتية</h1>
          <p className="text-emerald-200 text-lg mb-6">
            أكبر مكتبة صوتية إسلامية من Internet Archives
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <Headphones className="w-8 h-8 mb-2 text-emerald-300" />
              <p className="text-3xl font-bold">{stats.audioItems.toLocaleString()}</p>
              <p className="text-emerald-200 text-sm">ملف صوتي</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <BookOpen className="w-8 h-8 mb-2 text-emerald-300" />
              <p className="text-3xl font-bold">{stats.collections}</p>
              <p className="text-emerald-200 text-sm">مجموعة</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <Users className="w-8 h-8 mb-2 text-emerald-300" />
              <p className="text-3xl font-bold">{stats.scholars}</p>
              <p className="text-emerald-200 text-sm">عالم وداعية</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <span className="text-3xl mb-2 block">📖</span>
              <p className="text-3xl font-bold">{stats.sourates}</p>
              <p className="text-emerald-200 text-sm">سورة</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في المكتبة..."
                className="w-full pr-10 pl-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-600" />
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">جميع الأقسام</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat] || cat} ({allCollections.filter((c) => c.category === cat).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                !selectedCategory
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
            >
              الكل ({allCollections.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat] || cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredCollections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد نتائج</p>
          </div>
        ) : (
          Object.entries(groupedByCategory).map(([category, collections]) => (
            <div key={category} className="mb-10">
              <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2">
                <span>{CATEGORY_ICONS[category]}</span>
                {CATEGORY_LABELS[category] || category}
                <span className="text-sm font-normal text-gray-500">({collections.length})</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/courses/${col.id}`}
                    className="bg-white rounded-xl p-5 shadow-md border border-emerald-100 hover:shadow-lg hover:border-emerald-300 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-emerald-900 group-hover:text-emerald-700 truncate">
                          {col.title}
                        </h3>
                        {col.scholar_name && (
                          <p className="text-emerald-600 text-sm mt-1">{col.scholar_name}</p>
                        )}
                        {col.description && (
                          <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                            {col.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Headphones className="w-3 h-3" />
                            {col.item_count} ملف
                          </span>
                        </div>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
