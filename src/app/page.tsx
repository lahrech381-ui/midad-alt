import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CardItem } from "@/components/CardItem";
import { getCollections, getScholars, getSourates, getStats } from "@/lib/data";
import { BookOpen, Headphones, Mic, Users, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const stats = getStats();
  const quranCollections = getCollections("quran").slice(0, 4);
  const lectureCollections = getCollections("lectures").slice(0, 4);
  const scholars = getScholars().slice(0, 8);
  const sourates = getSourates().slice(0, 6);

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            مداد البديل
          </h1>
          <p className="text-xl text-emerald-700 mb-8">
            أكبر مكتبة صوتية إسلامية - مصدرها Internet Archives
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-md border border-emerald-100">
              <Mic className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-900">{stats.sourates}</p>
              <p className="text-sm text-gray-600">سورة</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-emerald-100">
              <Headphones className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-900">{stats.audioItems.toLocaleString()}</p>
              <p className="text-sm text-gray-600">ملف صوتي</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-emerald-100">
              <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-900">{stats.collections}</p>
              <p className="text-sm text-gray-600">مجموعة</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-emerald-100">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-900">{stats.scholars}</p>
              <p className="text-sm text-gray-600">عالم وداعية</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/library/"
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors font-medium"
            >
              📚 تصفح المكتبة
            </Link>
            <Link
              href="/live/"
              className="bg-white text-emerald-700 px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors font-medium border border-emerald-200"
            >
              🔍 بحث مباشر من Internet Archives
            </Link>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-900">القرآن الكريم</h2>
            <Link href="/quran/" className="text-emerald-600 hover:text-emerald-800 text-sm">
              عرض الكل &larr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quranCollections.map((collection) => (
              <CardItem key={collection.id} collection={collection} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-900">المحاضرات والدروس</h2>
            <Link href="/lectures/" className="text-emerald-600 hover:text-emerald-800 text-sm">
              عرض الكل &larr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lectureCollections.map((collection) => (
              <CardItem key={collection.id} collection={collection} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">سُوَر سريعة</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {sourates.map((sourate) => (
              <Link
                key={sourate.id}
                href={`/quran/${sourate.number}/`}
                className="bg-white rounded-xl p-4 shadow-md border border-emerald-100 text-center hover:shadow-lg hover:border-emerald-300 transition-all"
              >
                <p className="text-emerald-600 text-xs">{sourate.number}</p>
                <p className="font-bold text-emerald-900 text-lg">{sourate.name_ar}</p>
                <p className="text-gray-500 text-xs">{sourate.name_fr}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-900 mb-6">العلماء والدعاة</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {scholars.map((scholar) => (
              <Link
                key={scholar.id}
                href={`/scholars/${scholar.id}/`}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-2 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-xl text-white font-bold">
                    {scholar.name_ar.charAt(0)}
                  </span>
                </div>
                <p className="text-xs font-medium text-emerald-900 group-hover:text-emerald-700 line-clamp-2">
                  {scholar.name_ar}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Source attribution */}
        <section className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <h3 className="font-bold text-emerald-900">المحتوى من Internet Archives</h3>
              <p className="text-emerald-700 text-sm">
                جميع الملفات الصوتية مسترجعة من Archive.org - أكبر مكتبة رقمية في العالم
              </p>
            </div>
            <a
              href="https://archive.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-800"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
