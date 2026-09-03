#!/usr/bin/env python3
"""
Scraper Internet Archives - Collections Islamiques
Récupère les métadonnées audio, livres et vidéos depuis archive.org
"""

import requests
import json
import sqlite3
import os
import time
from pathlib import Path
from urllib.parse import quote

BASE_URL = "https://archive.org/metadata"
SEARCH_URL = "https://archive.org/advancedsearch.php"
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"
DB_PATH = DATA_DIR / "islam.db"
JSON_DIR = DATA_DIR / "json"

# Collections directes (audio)
IA_COLLECTIONS = [
    {
        "name": "quran_mishary",
        "identifier": "MisharyRashidAlafasyQuranmp3.info",
        "category": "quran",
        "scholar_name_ar": "مشاري راشد العفاسي",
        "scholar_name_en": "Mishary Rashid Alafasy",
    },
    {
        "name": "quran_full",
        "identifier": "quran_full",
        "category": "quran",
        "scholar_name_ar": "تلاوات متنوعة",
        "scholar_name_en": "Various Reciters",
    },
    {
        "name": "mufti_menk",
        "identifier": "AbdallahKamelSura99AzZalzala_201906",
        "category": "lectures",
        "scholar_name_ar": "مفتى منك",
        "scholar_name_en": "Mufti Menk",
    },
    {
        "name": "abu_adnan",
        "identifier": "AdhereToQuranAndSunnah",
        "category": "lectures",
        "scholar_name_ar": "أبو عدنان",
        "scholar_name_en": "Abu Adnan",
    },
    {
        "name": "islamic_lessons",
        "identifier": "islam-audio-lessons",
        "category": "lectures",
        "scholar_name_ar": "دروس إسلامية",
        "scholar_name_en": "Islamic Lessons",
    },
    {
        "name": "40_hadith",
        "identifier": "40-hadith-on-the-quran-the-quran-project",
        "category": "hadith",
        "scholar_name_ar": "مشروع القرآن",
        "scholar_name_en": "The Quran Project",
    },
    {
        "name": "nasheeds",
        "identifier": "background-nasheed-collection",
        "category": "nasheed",
        "scholar_name_ar": "إنشاد إسلامي",
        "scholar_name_en": "Islamic Nasheed",
    },
    {
        "name": "quran_english",
        "identifier": "Al-Quran-with-English-Saheeh-International-Translation-Audio-MP3-HQ",
        "category": "quran_translation",
        "scholar_name_ar": "مشاري العفاسي - ترجمة إنجليزية",
        "scholar_name_en": "Mishary Alafasy - English Translation",
    },
    # Audio supplémentaire
    {
        "name": "quran_yasser",
        "identifier": "MisharyRashidAlafasyQuranmp3.info",
        "category": "quran",
        "scholar_name_ar": "ياسر الدوسري",
        "scholar_name_en": "Yasser Al-Dosari",
    },
    {
        "name": "islamic_audiobooks",
        "identifier": "islamic-audiobooks",
        "category": "audiobooks",
        "scholar_name_ar": "كتب مسموعة إسلامية",
        "scholar_name_en": "Islamic Audiobooks",
    },
    {
        "name": "tareq_suwaidan",
        "identifier": "TareqAlSuwaidan",
        "category": "lectures",
        "scholar_name_ar": "طارق السويدان",
        "scholar_name_en": "Tareq Al-Suwaidan",
    },
    {
        "name": "omar_abdulkareem",
        "identifier": "omarabdulkareem",
        "category": "lectures",
        "scholar_name_ar": "عمر عبد الكريم",
        "scholar_name_en": "Omar Abdulkareem",
    },
]

# Requêtes de recherche pour trouver plus de contenu
SEARCH_QUERIES = [
    {"query": "islamic lecture audio", "category": "lectures", "max_results": 30},
    {"query": "quran recitation", "category": "quran", "max_results": 20},
    {"query": "nasheed islamic", "category": "nasheed", "max_results": 20},
    {"query": "islamic book text", "category": "books", "max_results": 20},
    {"query": "islamic video lecture", "category": "videos", "max_results": 20},
    {"query": "hadith audio", "category": "hadith", "max_results": 15},
    {"query": "tafsir quran audio", "category": "tafsir", "max_results": 15},
    {"query": "islamic fiqh lecture", "category": "lectures", "max_results": 15},
    {"query": "seerah prophet audio", "category": "lectures", "max_results": 15},
    {"query": "islamic reminder", "category": "lectures", "max_results": 15},
]


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS scholars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name_ar TEXT NOT NULL,
            name_en TEXT,
            bio TEXT,
            image_url TEXT,
            ia_identifier TEXT UNIQUE
        );
        CREATE TABLE IF NOT EXISTS collections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT NOT NULL,
            scholar_id INTEGER,
            ia_identifier TEXT UNIQUE,
            image_url TEXT,
            item_count INTEGER DEFAULT 0,
            FOREIGN KEY (scholar_id) REFERENCES scholars(id)
        );
        CREATE TABLE IF NOT EXISTS audio_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            collection_id INTEGER,
            scholar_id INTEGER,
            file_url TEXT NOT NULL,
            duration INTEGER,
            file_size INTEGER,
            ia_identifier TEXT,
            ia_file_name TEXT,
            FOREIGN KEY (collection_id) REFERENCES collections(id),
            FOREIGN KEY (scholar_id) REFERENCES scholars(id)
        );
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            author TEXT,
            language TEXT,
            ia_identifier TEXT UNIQUE,
            image_url TEXT,
            download_url TEXT,
            category TEXT DEFAULT 'islamic'
        );
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            scholar TEXT,
            ia_identifier TEXT UNIQUE,
            image_url TEXT,
            duration INTEGER,
            category TEXT DEFAULT 'islamic'
        );
    """)
    conn.commit()
    return conn


def fetch_item(identifier):
    url = f"{BASE_URL}/{identifier}"
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"  Erreur metadata: {e}")
        return None


def search_ia(query, mediatype="audio", rows=20, start=0):
    params = {
        "q": f"{query} AND mediatype:{mediatype}",
        "fl": "identifier,title,description,mediatype,creator,year,downloads,item_size,files_count,subjects",
        "rows": str(rows),
        "start": str(start),
        "output": "json",
        "sort": "downloads desc",
    }
    try:
        response = requests.get(SEARCH_URL, params=params, timeout=30)
        response.raise_for_status()
        return response.json().get("response", {}).get("docs", [])
    except Exception as e:
        print(f"  Erreur recherche: {e}")
        return []


def extract_files(data, identifier, file_types=None):
    if file_types is None:
        file_types = ["VBR MP3", "MP3", "OGG VORBIS"]
    files = []
    for f in data.get("files", []):
        fmt = f.get("format", "")
        name = f.get("name", "")
        if fmt in file_types or name.endswith((".mp3", ".ogg")):
            files.append({
                "name": name,
                "title": f.get("title", name.replace(".mp3", "").replace(".ogg", "").replace("_", " ")),
                "size": int(f.get("size", 0)),
                "url": f"https://archive.org/download/{identifier}/{name}",
                "format": fmt,
            })
    return files


def extract_book_files(data, identifier):
    books = []
    for f in data.get("files", []):
        fmt = f.get("format", "")
        name = f.get("name", "")
        if fmt in ["Text PDF", "PDF", "DJVU", "EPUB", "MOBI"] or name.endswith((".pdf", ".epub", ".mobi")):
            books.append({
                "name": name,
                "title": f.get("title", name),
                "size": int(f.get("size", 0)),
                "url": f"https://archive.org/download/{identifier}/{name}",
                "format": fmt,
            })
    return books


def extract_video_files(data, identifier):
    videos = []
    for f in data.get("files", []):
        fmt = f.get("format", "")
        name = f.get("name", "")
        if fmt in ["MPEG4", "Ogg Video", "h.264", "512Kb MPEG4"] or name.endswith((".mp4", ".ogv", ".avi")):
            videos.append({
                "name": name,
                "title": f.get("title", name),
                "size": int(f.get("size", 0)),
                "url": f"https://archive.org/download/{identifier}/{name}",
                "format": fmt,
            })
    return videos


def scrape_audio_collection(conn, config):
    identifier = config["identifier"]
    print(f"\n[Audio] Scraping: {config['name']} ({identifier})")

    data = fetch_item(identifier)
    if not data:
        return

    metadata = data.get("metadata", {})
    mp3_files = extract_files(data, identifier)

    cursor = conn.cursor()

    # Scholar
    cursor.execute(
        "INSERT OR IGNORE INTO scholars (name_ar, name_en, ia_identifier) VALUES (?, ?, ?)",
        (config["scholar_name_ar"], config["scholar_name_en"], identifier),
    )
    cursor.execute("SELECT id FROM scholars WHERE ia_identifier = ?", (identifier,))
    scholar_id = cursor.fetchone()[0]

    # Collection
    cursor.execute(
        """INSERT OR IGNORE INTO collections
           (title, description, category, scholar_id, ia_identifier, item_count)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (
            metadata.get("title", config["name"]),
            metadata.get("description", "")[:500] if metadata.get("description") else "",
            config["category"],
            scholar_id,
            identifier,
            len(mp3_files),
        ),
    )
    cursor.execute("SELECT id FROM collections WHERE ia_identifier = ?", (identifier,))
    collection_id = cursor.fetchone()[0]

    # Audio items
    for mp3 in mp3_files:
        cursor.execute(
            """INSERT OR IGNORE INTO audio_items
               (title, collection_id, scholar_id, file_url, file_size, ia_identifier, ia_file_name)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                mp3["title"],
                collection_id,
                scholar_id,
                mp3["url"],
                mp3["size"],
                identifier,
                mp3["name"],
            ),
        )

    conn.commit()
    print(f"  -> {len(mp3_files)} fichiers audio ajoutés")
    return len(mp3_files)


def scrape_search_results(conn, query_config):
    query = query_config["query"]
    category = query_config["category"]
    max_results = query_config["max_results"]
    print(f"\n[Search] Recherche: '{query}' ({category})")

    items = search_ia(query, "audio" if category in ["quran", "lectures", "hadith", "tafsir", "nasheed", "audiobooks"] else category, max_results)
    if category in ["books", "videos"]:
        items += search_ia(query, category, max_results)

    cursor = conn.cursor()
    count = 0

    for item in items:
        identifier = item.get("identifier", "")
        title = item.get("title", "")
        description = item.get("description", "")[:500] if item.get("description") else ""
        creator = item.get("creator", "مجهول")
        downloads = item.get("downloads", 0)

        if category in ["quran", "lectures", "hadith", "tafsir", "nasheed", "audiobooks"]:
            # Audio
            data = fetch_item(identifier)
            if not data:
                continue

            mp3_files = extract_files(data, identifier)
            if not mp3_files:
                continue

            cursor.execute(
                "INSERT OR IGNORE INTO scholars (name_ar, name_en, ia_identifier) VALUES (?, ?, ?)",
                (creator, creator, f"search_{identifier}"),
            )
            cursor.execute("SELECT id FROM scholars WHERE ia_identifier = ?", (f"search_{identifier}",))
            scholar_id = cursor.fetchone()[0]

            cursor.execute(
                """INSERT OR IGNORE INTO collections
                   (title, description, category, scholar_id, ia_identifier, item_count)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (title, description, category, scholar_id, identifier, len(mp3_files)),
            )
            cursor.execute("SELECT id FROM collections WHERE ia_identifier = ?", (identifier,))
            collection_id = cursor.fetchone()[0]

            for mp3 in mp3_files[:10]:  # Limiter à 10 par collection
                cursor.execute(
                    """INSERT OR IGNORE INTO audio_items
                       (title, collection_id, scholar_id, file_url, file_size, ia_identifier, ia_file_name)
                       VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (mp3["title"], collection_id, scholar_id, mp3["url"], mp3["size"], identifier, mp3["name"]),
                )
            count += len(mp3_files[:10])

        elif category == "books":
            data = fetch_item(identifier)
            if not data:
                continue
            book_files = extract_book_files(data, identifier)
            if book_files:
                best = book_files[0]
                cursor.execute(
                    """INSERT OR IGNORE INTO books
                       (title, description, author, ia_identifier, download_url, category)
                       VALUES (?, ?, ?, ?, ?, ?)""",
                    (title, description, creator, identifier, best["url"], "islamic"),
                )
                count += 1

        elif category == "videos":
            data = fetch_item(identifier)
            if not data:
                continue
            video_files = extract_video_files(data, identifier)
            if video_files:
                best = video_files[0]
                cursor.execute(
                    """INSERT OR IGNORE INTO videos
                       (title, description, scholar, ia_identifier, category)
                       VALUES (?, ?, ?, ?, ?)""",
                    (title, description, creator, identifier, "islamic"),
                )
                count += 1

        time.sleep(0.5)  # Pause pour ne pas surcharger

    conn.commit()
    print(f"  -> {count} éléments ajoutés")


def export_json(conn):
    JSON_DIR.mkdir(parents=True, exist_ok=True)
    cursor = conn.cursor()
    cursor.row_factory = sqlite3.Row

    cursor.execute("SELECT * FROM scholars")
    scholars = [dict(row) for row in cursor.fetchall()]
    with open(JSON_DIR / "scholars.json", "w", encoding="utf-8") as f:
        json.dump(scholars, f, ensure_ascii=False, indent=2)
    print(f"Exporté: {len(scholars)} scholars")

    cursor.execute("""
        SELECT c.*, s.name_ar as scholar_name
        FROM collections c LEFT JOIN scholars s ON c.scholar_id = s.id
    """)
    collections = [dict(row) for row in cursor.fetchall()]
    with open(JSON_DIR / "collections.json", "w", encoding="utf-8") as f:
        json.dump(collections, f, ensure_ascii=False, indent=2)
    print(f"Exporté: {len(collections)} collections")

    cursor.execute("""
        SELECT a.*, c.title as collection_title, s.name_ar as scholar_name
        FROM audio_items a
        LEFT JOIN collections c ON a.collection_id = c.id
        LEFT JOIN scholars s ON a.scholar_id = s.id
    """)
    audio_items = [dict(row) for row in cursor.fetchall()]
    with open(JSON_DIR / "audio_items.json", "w", encoding="utf-8") as f:
        json.dump(audio_items, f, ensure_ascii=False, indent=2)
    print(f"Exporté: {len(audio_items)} audio items")

    cursor.execute("SELECT * FROM books")
    books = [dict(row) for row in cursor.fetchall()]
    with open(JSON_DIR / "books.json", "w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii=False, indent=2)
    print(f"Exporté: {len(books)} livres")

    cursor.execute("SELECT * FROM videos")
    videos = [dict(row) for row in cursor.fetchall()]
    with open(JSON_DIR / "videos.json", "w", encoding="utf-8") as f:
        json.dump(videos, f, ensure_ascii=False, indent=2)
    print(f"Exporté: {len(videos)} vidéos")


def main():
    print("=" * 60)
    print("Scraper Internet Archives - Collections Islamiques (étendu)")
    print("=" * 60)

    conn = init_db()

    # 1. Collections directes
    print("\n--- PHASE 1: Collections directes ---")
    total_audio = 0
    for collection in IA_COLLECTIONS:
        result = scrape_audio_collection(conn, collection)
        if result:
            total_audio += result

    # 2. Recherche de contenu supplémentaire
    print("\n--- PHASE 2: Recherche de contenu ---")
    for query_config in SEARCH_QUERIES:
        scrape_search_results(conn, query_config)

    # 3. Export
    print("\n--- PHASE 3: Export JSON ---")
    export_json(conn)

    conn.close()

    # Résumé
    conn2 = sqlite3.connect(DB_PATH)
    c = conn2.cursor()
    c.execute("SELECT COUNT(*) FROM audio_items")
    total = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM books")
    books_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM videos")
    videos_count = c.fetchone()[0]
    conn2.close()

    print(f"\n{'=' * 60}")
    print(f"TERMINÉ!")
    print(f"Audio: {total} fichiers | Livres: {books_count} | Vidéos: {videos_count}")
    print(f"Base: {DB_PATH}")
    print(f"JSON: {JSON_DIR}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
