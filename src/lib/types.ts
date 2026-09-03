export interface Scholar {
  id: number;
  name_ar: string;
  name_en?: string;
  bio?: string;
  image_url?: string;
  ia_identifier?: string;
}

export interface Collection {
  id: number;
  title: string;
  description?: string;
  category: string;
  scholar_id: number;
  scholar_name?: string;
  ia_identifier?: string;
  image_url?: string;
  item_count: number;
}

export interface AudioItem {
  id: number;
  title: string;
  description?: string;
  collection_id: number;
  scholar_id: number;
  scholar_name?: string;
  collection_title?: string;
  file_url: string;
  duration?: number | null;
  file_size?: number;
  ia_identifier?: string;
  ia_file_name?: string;
}

export interface Sourate {
  id: number;
  number: number;
  name_ar: string;
  name_en: string;
  name_fr?: string;
  ayah_count: number;
  juz?: number;
}
