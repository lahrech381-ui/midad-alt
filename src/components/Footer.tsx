import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">مداد البديل</h3>
            <p className="text-emerald-200 text-sm leading-relaxed">
              موقع إسلامي علمي ودعوي يحتوي على القرآن الكريم ودروس ومحاضرات صوتية ومقالات وكتب متنوعة
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li><Link href="/quran/" className="hover:text-white transition-colors">القرآن الكريم</Link></li>
              <li><Link href="/courses/" className="hover:text-white transition-colors">السلاسل العلمية</Link></li>
              <li><Link href="/lectures/" className="hover:text-white transition-colors">المحاضرات</Link></li>
              <li><Link href="/books/" className="hover:text-white transition-colors">الكتب</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">أقسام أخرى</h4>
            <ul className="space-y-2 text-sm text-emerald-200">
              <li><Link href="/live/" className="hover:text-white transition-colors">مباشر من Internet Archives</Link></li>
              <li><Link href="/videos/" className="hover:text-white transition-colors">المرئيات</Link></li>
              <li><Link href="/scholars/" className="hover:text-white transition-colors">العلماء والدعاة</Link></li>
              <li><Link href="/search/" className="hover:text-white transition-colors">بحث محلي</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">المحتوى</h4>
            <p className="text-emerald-200 text-sm">
              المحتوى مصدره من Internet Archives وهو متاح للجميع بشكل مجاني
            </p>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-emerald-300 text-sm">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} مداد البديل</p>
          <p className="mt-1">
            Powered by{" "}
            <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              Internet Archives
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
