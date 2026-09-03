import { getSourateByNumber, getAudioItems } from "@/lib/data";
import { notFound } from "next/navigation";
import { SouratePageClient } from "./client";

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

  return <SouratePageClient sourate={sourateData} audioItems={quranAudio} />;
}
