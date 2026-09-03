import Link from "next/link";
import type { Collection } from "@/lib/types";
import { BookOpen, Headphones, Mic, Video } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  quran: <Mic className="w-8 h-8" />,
  quran_translation: <Mic className="w-8 h-8" />,
  lectures: <Headphones className="w-8 h-8" />,
  courses: <BookOpen className="w-8 h-8" />,
  hadith: <BookOpen className="w-8 h-8" />,
  nasheed: <Headphones className="w-8 h-8" />,
  books: <BookOpen className="w-8 h-8" />,
  videos: <Video className="w-8 h-8" />,
};

const categoryColors: Record<string, string> = {
  quran: "from-emerald-600 to-teal-600",
  quran_translation: "from-blue-600 to-indigo-600",
  lectures: "from-purple-600 to-pink-600",
  courses: "from-orange-600 to-red-600",
  hadith: "from-amber-600 to-yellow-600",
  nasheed: "from-cyan-600 to-blue-600",
  books: "from-rose-600 to-red-600",
  videos: "from-violet-600 to-purple-600",
};

interface CardItemProps {
  collection: Collection;
}

export function CardItem({ collection }: CardItemProps) {
  const gradient = categoryColors[collection.category] || "from-emerald-600 to-teal-600";
  const icon = categoryIcons[collection.category] || <BookOpen className="w-8 h-8" />;

  return (
    <Link
      href={`/courses/${collection.id}/`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-emerald-100"
    >
      <div className={`bg-gradient-to-br ${gradient} p-6 text-white flex items-center justify-center h-32`}>
        {icon}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-emerald-900 group-hover:text-emerald-700 transition-colors line-clamp-2 text-sm">
          {collection.title}
        </h3>
        {collection.scholar_name && (
          <p className="text-emerald-600 text-xs mt-1">{collection.scholar_name}</p>
        )}
        <p className="text-gray-500 text-xs mt-2">
          {collection.item_count} عنصر
        </p>
      </div>
    </Link>
  );
}
