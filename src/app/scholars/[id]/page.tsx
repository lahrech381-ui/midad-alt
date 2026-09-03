import { getScholarById, getCollections, getAudioItems } from "@/lib/data";
import { notFound } from "next/navigation";
import { ScholarPageClient } from "./client";

export function generateStaticParams() {
  return Array.from({ length: 132 }, (_, i) => ({ id: String(i + 1) }));
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

  return <ScholarPageClient scholar={scholar} collections={collections} audioItems={audioItems} />;
}
