export interface Scholar {
  id: number;
  name_ar: string;
  name_en: string | null;
  bio: string | null;
  image_url: string | null;
  ia_identifier: string | null;
}

export interface Collection {
  id: number;
  title: string;
  description: string | null;
  category: string;
  scholar_id: number;
  scholar_name: string | null;
  ia_identifier: string | null;
  image_url: string | null;
  item_count: number;
}

export interface AudioItem {
  id: number;
  title: string;
  description: string | null;
  collection_id: number;
  scholar_id: number;
  scholar_name: string | null;
  collection_title: string | null;
  file_url: string;
  duration: number | null;
  file_size: number;
  ia_identifier: string | null;
  ia_file_name: string | null;
}

export interface Sourate {
  id: number;
  number: number;
  name_ar: string;
  name_en: string;
  name_fr: string | null;
  ayah_count: number;
  juz: number | null;
}

export interface Book {
  id: number;
  title: string;
  description: string | null;
  author: string | null;
  language: string | null;
  ia_identifier: string | null;
  image_url: string | null;
  download_url: string | null;
  category: string;
}

export interface Video {
  id: number;
  title: string;
  description: string | null;
  scholar: string | null;
  ia_identifier: string | null;
  image_url: string | null;
  duration: number | null;
  category: string;
}
