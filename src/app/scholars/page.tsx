import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getScholars } from "@/lib/data";
import Link from "next/link";

export default function ScholarsPage() {
  const scholars = getScholars();

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">العلماء والدعاة</h1>
        <p className="text-emerald-700 mb-8">قائمة بالعلماء والدعاة</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {scholars.map((scholar) => (
            <Link
              key={scholar.id}
              href={`/scholars/${scholar.id}/`}
              className="bg-white rounded-xl p-6 shadow-md border border-emerald-100 text-center hover:shadow-lg hover:border-emerald-300 transition-all"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-3 flex items-center justify-center shadow-md">
                <span className="text-2xl text-white font-bold">
                  {scholar.name_ar.charAt(0)}
                </span>
              </div>
              <h3 className="font-bold text-emerald-900 text-sm">{scholar.name_ar}</h3>
              {scholar.name_en && (
                <p className="text-gray-500 text-xs mt-1">{scholar.name_en}</p>
              )}
              {scholar.bio && (
                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{scholar.bio}</p>
              )}
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
