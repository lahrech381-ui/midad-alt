const IA_BASE = "https://archive.org";

export interface IAResult {
  identifier: string;
  title: string;
  description?: string;
  mediatype: string;
  creator?: string;
  year?: string;
  downloads?: number;
  item_size?: number;
  files_count?: number;
  collections?: string[];
  subjects?: string[];
  language?: string;
  image_url?: string;
}

export interface IAFile {
  name: string;
  title?: string;
  format: string;
  size: string;
  length?: string;
}

export interface IASearchResponse {
  response: {
    numFound: number;
    start: number;
    docs: IAResult[];
  };
}

// Search Internet Archives
export async function searchIA(
  query: string,
  mediatype: string = "audio",
  rows: number = 20,
  start: number = 0
): Promise<IASearchResponse> {
  const params = new URLSearchParams({
    q: `${query} AND mediatype:${mediatype}`,
    fl: "identifier,title,description,mediatype,creator,year,downloads,item_size,files_count,collections,subjects,language",
    rows: String(rows),
    start: String(start),
    output: "json",
    sort: "downloads desc",
  });

  const res = await fetch(`${IA_BASE}/advancedsearch.php?${params}`);
  if (!res.ok) throw new Error(`IA search failed: ${res.status}`);
  return res.json();
}

// Get item metadata
export async function getIAItem(identifier: string) {
  const res = await fetch(`${IA_BASE}/metadata/${identifier}`);
  if (!res.ok) throw new Error(`IA item failed: ${res.status}`);
  return res.json();
}

// Get MP3 files from an item
export async function getIAFiles(identifier: string): Promise<IAFile[]> {
  const data = await getIAItem(identifier);
  return (data.files || []).filter(
    (f: IAFile) =>
      f.format === "VBR MP3" ||
      f.format === "MP3" ||
      f.format === "OGG VORBIS" ||
      f.name?.endsWith(".mp3")
  );
}

// Search Islamic audio specifically
export async function searchIslamicAudio(
  query: string,
  rows: number = 20
): Promise<IAResult[]> {
  const res = await searchIA(query, "audio", rows);
  return res.response.docs;
}

// Browse by subject/collection
export async function browseIA(
  subject: string,
  mediatype: string = "audio",
  rows: number = 20
): Promise<IAResult[]> {
  const params = new URLSearchParams({
    q: `subject:${subject} AND mediatype:${mediatype}`,
    fl: "identifier,title,description,mediatype,creator,year,downloads,item_size",
    rows: String(rows),
    output: "json",
    sort: "downloads desc",
  });

  const res = await fetch(`${IA_BASE}/advancedsearch.php?${params}`);
  if (!res.ok) throw new Error(`IA browse failed: ${res.status}`);
  const data = await res.json();
  return data.response.docs;
}

// Get download URL
export function getDownloadURL(identifier: string, filename: string): string {
  return `${IA_BASE}/download/${identifier}/${encodeURIComponent(filename)}`;
}

// Get streaming URL
export function getStreamURL(identifier: string, filename: string): string {
  return `${IA_BASE}/stream/${identifier}/${encodeURIComponent(filename)}`;
}
