import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function BooksPage() {
  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-900 mb-2">الكتب</h1>
        <p className="text-emerald-700 mb-8">كتب إسلامية مقروءة ومسموعة</p>

        <div className="bg-white rounded-xl p-8 text-center shadow-md border border-emerald-100">
          <p className="text-gray-500 text-lg">قريباً إن شاء الله</p>
          <p className="text-gray-400 text-sm mt-2">
            سيتم إضافة قسم الكتب من{" "}
            <a href="https://archive.org/details/texts" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">
              Internet Archives
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
