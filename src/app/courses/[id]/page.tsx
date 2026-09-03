import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getCollectionById, getAudioItems } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return Array.from({ length: 8 }, (_, i) => ({ id: String(i + 1) }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { id } = await params;
  const collection = getCollectionById(parseInt(id));

  if (!collection) return notFound();

  const audioItems = getAudioItems(collection.id);

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <nav className="text-sm text-emerald-600 mb-6">
          <Link href="/courses/" className="hover:underline">السلاسل العلمية</Link>
          <span className="mx-2">&larr;</span>
          <span className="text-emerald-900">{collection.title}</span>
        </nav>

        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold">{collection.title}</h1>
          {collection.scholar_name && (
            <p className="text-emerald-200 mt-2">{collection.scholar_name}</p>
          )}
          {collection.description && (
            <p className="text-emerald-300 mt-4 text-sm leading-relaxed">{collection.description}</p>
          )}
          <p className="text-emerald-200 text-sm mt-4">{collection.item_count} عنصر صوتي</p>
        </div>

        {audioItems.length > 0 ? (
          <div className="space-y-3">
            {audioItems.map((audio) => (
              <AudioPlayer
                key={audio.id}
                src={audio.file_url}
                title={audio.title}
                scholar={audio.scholar_name || collection.scholar_name}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
            <p className="text-gray-500">لا يوجد محتوى صوتي متاح</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
