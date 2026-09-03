"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/live/", label: "مباشر من IA" },
  { href: "/quran/", label: "القرآن الكريم" },
  { href: "/courses/", label: "السلاسل العلمية" },
  { href: "/lectures/", label: "المحاضرات" },
  { href: "/books/", label: "الكتب" },
  { href: "/videos/", label: "المرئيات" },
  { href: "/scholars/", label: "العلماء" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-l from-emerald-900 to-teal-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold">
            مداد البديل
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-emerald-300 transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/search/"
              className="p-2 hover:bg-emerald-800 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              className="md:hidden p-2 hover:bg-emerald-800 rounded-lg transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-emerald-700 mt-2 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 px-4 hover:bg-emerald-800 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
