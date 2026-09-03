import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSourateByNumber, getAudioItems } from "@/lib/data";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/AudioPlayer";
import Link from "next/link";

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({ sourate: String(i + 1) }));
}

interface PageProps {
  params: Promise<{ sourate: string }>;
}

export default async function SouratePage({ params }: PageProps) {
  const { sourate } = await params;
  const num = parseInt(sourate);
  const sourateData = getSourateByNumber(num);

  if (!sourateData) return notFound();

  const quranAudio = getAudioItems(1).filter((a) => a.ia_file_name?.includes(String(num).padStart(3, "0")));

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <nav className="text-sm text-emerald-600 mb-6">
          <Link href="/quran/" className="hover:underline">القرآن الكريم</Link>
          <span className="mx-2">&larr;</span>
          <span className="text-emerald-900">{sourateData.name_ar}</span>
        </nav>

        <div className="text-center py-8 bg-gradient-to-br from-emerald-900 to-teal-900 rounded-2xl text-white mb-8">
          <p className="text-emerald-200 text-sm">سورة رقم</p>
          <p className="text-6xl font-bold">{sourateData.number}</p>
          <h1 className="text-4xl font-bold mt-4">{sourateData.name_ar}</h1>
          <p className="text-emerald-200 mt-2">{sourateData.name_en}</p>
          <p className="text-emerald-300 text-sm mt-1">{sourateData.name_fr}</p>
          <p className="mt-2">{sourateData.ayah_count} آية</p>
        </div>

        <h2 className="text-xl font-bold text-emerald-900 mb-4">تلاوات هذه السورة</h2>

        {quranAudio.length > 0 ? (
          <div className="space-y-4">
            {quranAudio.map((audio) => (
              <AudioPlayer
                key={audio.id}
                src={audio.file_url}
                title={audio.title}
                scholar={audio.scholar_name}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
            <p className="text-gray-500">لا توجد تلاوات متاحة حالياً لهذه السورة</p>
            <p className="text-sm text-gray-400 mt-2">
              يمكنك استكشاف المحتوى من{" "}
              <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
                Internet Archives
              </a>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
