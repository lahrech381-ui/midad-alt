import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { IABrowser } from "@/components/IABrowser";

export default function LivePage() {
  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">بحث مباشر من Internet Archives</h1>
          <p className="text-emerald-700">
            ابحث واستمع مباشرة من أكبر مكتبة رقمية في العالم
          </p>
        </div>

        <IABrowser />
      </main>

      <Footer />
    </>
  );
}
