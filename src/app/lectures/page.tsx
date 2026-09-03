import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CardItem } from "@/components/CardItem";
import { getCollections } from "@/lib/data";

export default function LecturesPage() {
  const lectures = getCollections("lectures");
  const hadith = getCollections("hadith");
  const nasheed = getCollections("nasheed");
  const allItems = [...lectures, ...hadith, ...nasheed];

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">المحاضرات والدروس</h1>
        <p className="text-emerald-700 mb-8">محاضرات ودروس ونشيد إسلامي</p>

        {lectures.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">المحاضرات</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((c) => (
                <CardItem key={c.id} collection={c} />
              ))}
            </div>
          </section>
        )}

        {hadith.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">الحديث</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hadith.map((c) => (
                <CardItem key={c.id} collection={c} />
              ))}
            </div>
          </section>
        )}

        {nasheed.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">النشيد</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nasheed.map((c) => (
                <CardItem key={c.id} collection={c} />
              ))}
            </div>
          </section>
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
