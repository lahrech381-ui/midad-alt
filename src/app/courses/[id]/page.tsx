import { getCollectionById, getAudioItems } from "@/lib/data";
import { notFound } from "next/navigation";
import { CollectionPageClient } from "./client";

export function generateStaticParams() {
  return Array.from({ length: 131 }, (_, i) => ({ id: String(i + 1) }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { id } = await params;
  const collection = getCollectionById(parseInt(id));

  if (!collection) return notFound();

  const audioItems = getAudioItems(collection.id);

  return <CollectionPageClient collection={collection} audioItems={audioItems} />;
}
