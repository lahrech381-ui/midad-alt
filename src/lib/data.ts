import scholarsData from "../../data/json/scholars.json";
import collectionsData from "../../data/json/collections.json";
import audioItemsData from "../../data/json/audio_items.json";
import souratesData from "../../data/json/sourates.json";
import type { Scholar, Collection, AudioItem, Sourate } from "./types";

export const getScholars = (): Scholar[] => scholarsData as Scholar[];

export const getScholarById = (id: number): Scholar | undefined =>
  (scholarsData as Scholar[]).find((s) => s.id === id);

export const getCollections = (category?: string): Collection[] => {
  const cols = collectionsData as Collection[];
  if (category) return cols.filter((c) => c.category === category);
  return cols;
};

export const getCollectionById = (id: number): Collection | undefined =>
  (collectionsData as Collection[]).find((c) => c.id === id);

export const getAudioItems = (collectionId?: number): AudioItem[] => {
  const items = audioItemsData as AudioItem[];
  if (collectionId) return items.filter((a) => a.collection_id === collectionId);
  return items;
};

export const getAudioById = (id: number): AudioItem | undefined =>
  (audioItemsData as AudioItem[]).find((a) => a.id === id);

export const getSourates = (): Sourate[] => souratesData as Sourate[];

export const getSourateByNumber = (num: number): Sourate | undefined =>
  (souratesData as Sourate[]).find((s) => s.number === num);

export const getCategories = (): string[] => {
  const cols = collectionsData as Collection[];
  const cats = new Set(cols.map((c) => c.category));
  return Array.from(cats);
};

export const getStats = () => {
  return {
    scholars: (scholarsData as Scholar[]).length,
    collections: (collectionsData as Collection[]).length,
    audioItems: (audioItemsData as AudioItem[]).length,
    sourates: (souratesData as Sourate[]).length,
  };
};

export const searchAll = (query: string): { type: string; items: (Scholar | Collection | AudioItem)[] }[] => {
  const q = query.toLowerCase();
  return [
    {
      type: "scholars",
      items: (scholarsData as Scholar[]).filter(
        (s) => s.name_ar.includes(q) || (s.name_en && s.name_en.toLowerCase().includes(q))
      ),
    },
    {
      type: "collections",
      items: (collectionsData as Collection[]).filter(
        (c) => c.title.includes(q) || (c.description && c.description.includes(q))
      ),
    },
    {
      type: "audio",
      items: (audioItemsData as AudioItem[]).filter(
        (a) => a.title.includes(q) || (a.description && a.description.includes(q))
      ),
    },
  ];
};
