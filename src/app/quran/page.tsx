import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSourates } from "@/lib/data";
import Link from "next/link";

export default function QuranPage() {
  const sourates = getSourates();

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">القرآن الكريم</h1>
        <p className="text-emerald-700 mb-8">تصفح سور القرآن الكريم</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {sourates.map((sourate) => (
            <Link
              key={sourate.id}
              href={`/quran/${sourate.number}/`}
              className="bg-white rounded-xl p-4 shadow-md border border-emerald-100 text-center hover:shadow-lg hover:border-emerald-300 transition-all"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-emerald-700 text-sm font-bold">{sourate.number}</span>
              </div>
              <p className="font-bold text-emerald-900">{sourate.name_ar}</p>
              <p className="text-gray-500 text-xs">{sourate.name_en}</p>
              <p className="text-gray-400 text-xs">{sourate.ayah_count} آية</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
