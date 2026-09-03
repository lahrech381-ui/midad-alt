import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getStats } from "@/lib/data";
import { ExternalLink, Github, BookOpen, Headphones, Users, Globe } from "lucide-react";

export default function AboutPage() {
  const stats = getStats();

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-emerald-900 mb-8">عن الموقع</h1>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">مداد البديل</h2>
          <p className="text-emerald-700 leading-relaxed mb-4">
            موقع إسلامي علمي ودعوي يحتوي على القرآن الكريم والدروس والمحاضرات الصوتية والمقالات والكتب المتنوعة.
            جميع الملفات الصوتية مسترجعة من Internet Archives - أكبر مكتبة رقمية في العالم.
          </p>
          <p className="text-emerald-700 leading-relaxed">
            يهدف الموقع إلى توفير محتوى إسلامي أصيل ومتقن يمكن الوصول إليه بسهولة عبر الإنترنت.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
            <Headphones className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-900">{stats.audioItems.toLocaleString()}</p>
            <p className="text-sm text-gray-600">ملف صوتي</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
            <BookOpen className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-900">{stats.collections}</p>
            <p className="text-sm text-gray-600">مجموعة</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
            <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-900">{stats.scholars}</p>
            <p className="text-sm text-gray-600">عالم وداعية</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
            <span className="text-3xl mb-2 block">📖</span>
            <p className="text-2xl font-bold text-emerald-900">{stats.sourates}</p>
            <p className="text-sm text-gray-600">سورة</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">المصادر</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <Globe className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900">Internet Archives</h3>
                <p className="text-emerald-700 text-sm"> أكبر مكتبة رقمية في العالم - archive.org</p>
              </div>
              <a
                href="https://archive.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-800 mr-auto"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <Github className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-emerald-900">GitHub</h3>
                <p className="text-emerald-700 text-sm">الكود المصدري للموقع</p>
              </div>
              <a
                href="https://github.com/lahrech381-ui/midad-alt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-800 mr-auto"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-200">
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">كيف يعمل الموقع؟</h2>
          <div className="space-y-4 text-emerald-700">
            <div className="flex items-start gap-3">
              <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
              <p>يتم جمع المحتوى الصوتي من Internet Archives عبر خدمة البحث الخاصة بهم</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
              <p>يتم حفظ البيانات في قاعدة محلية وتصديرها بصيغة JSON</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
              <p>يتم بناء الموقع كصفحات ثابتة ونشره على GitHub Pages</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
              <p>يمكنك الاستماع مباشرة من المتصفح عبر روابط Internet Archives</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
