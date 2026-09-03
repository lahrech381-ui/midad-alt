import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CardItem } from "@/components/CardItem";
import { getCollections } from "@/lib/data";

export default function CoursesPage() {
  const courses = getCollections("courses");
  const quran = getCollections("quran");
  const all = [...quran, ...courses];

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">السلاسل العلمية</h1>
        <p className="text-emerald-700 mb-8">سلاسل ودروس علمية متنوعة</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {all.map((c) => (
            <CardItem key={c.id} collection={c} />
          ))}
        </div>

        {all.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
            <p className="text-gray-500">لا توجد سلاسل علمية متاحة حالياً</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
