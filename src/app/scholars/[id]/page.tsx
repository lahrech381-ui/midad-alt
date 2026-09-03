import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getScholarById, getCollections, getAudioItems } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ScholarPage({ params }: PageProps) {
  const { id } = await params;
  const scholar = getScholarById(parseInt(id));

  if (!scholar) return notFound();

  const collections = getCollections().filter((c) => c.scholar_id === scholar.id);
  const audioItems = getAudioItems().filter((a) => a.scholar_id === scholar.id);

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <nav className="text-sm text-emerald-600 mb-6">
          <Link href="/scholars/" className="hover:underline">العلماء</Link>
          <span className="mx-2">&larr;</span>
          <span className="text-emerald-900">{scholar.name_ar}</span>
        </nav>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-3xl text-white font-bold">{scholar.name_ar.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">{scholar.name_ar}</h1>
            {scholar.name_en && <p className="text-emerald-700">{scholar.name_en}</p>}
            {scholar.bio && <p className="text-gray-600 mt-2">{scholar.bio}</p>}
          </div>
        </div>

        {collections.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">السلاسل العلمية</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses/${c.id}/`}
                  className="bg-white rounded-xl p-4 shadow-md border border-emerald-100 hover:shadow-lg transition-all"
                >
                  <h3 className="font-bold text-emerald-900 text-sm">{c.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">{c.item_count} عنصر</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {audioItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">المحتوى الصوتي</h2>
            <div className="space-y-3">
              {audioItems.slice(0, 10).map((audio) => (
                <AudioPlayer
                  key={audio.id}
                  src={audio.file_url}
                  title={audio.title}
                />
              ))}
            </div>
          </section>
        )}

        {collections.length === 0 && audioItems.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
            <p className="text-gray-500">لا يوجد محتوى متاح حالياً لهذا العالم</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
