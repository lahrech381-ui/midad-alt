#!/usr/bin/env python3
"""
Scraper Internet Archives - Collections Islamiques
Récupère les métadonnées audio depuis archive.org
"""

import requests
import json
import sqlite3
import os
from pathlib import Path

BASE_URL = "https://archive.org/metadata"
SCRIPT_DIR = Path(__file__).parent
DATA_DIR = SCRIPT_DIR.parent / "data"
DB_PATH = DATA_DIR / "islam.db"
JSON_DIR = DATA_DIR / "json"

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
        print(f"  Erreur: {e}")
        return None


def extract_mp3_files(data, identifier):
    mp3_files = []
    for f in data.get("files", []):
        if f.get("format") in ["VBR MP3", "MP3"] or f["name"].endswith(".mp3"):
            mp3_files.append({
                "name": f["name"],
                "title": f.get("title", f["name"].replace(".mp3", "").replace("_", " ")),
                "size": int(f.get("size", 0)),
                "url": f"https://archive.org/download/{identifier}/{f['name']}",
            })
    return mp3_files


def scrape_collection(conn, config):
    identifier = config["identifier"]
    print(f"Scraping: {config['name']} ({identifier})")

    data = fetch_item(identifier)
    if not data:
        return

    metadata = data.get("metadata", {})
    mp3_files = extract_mp3_files(data, identifier)

    cursor = conn.cursor()

    cursor.execute(
        "INSERT OR IGNORE INTO scholars (name_ar, name_en, ia_identifier) VALUES (?, ?, ?)",
        (config["scholar_name_ar"], config["scholar_name_en"], identifier),
    )
    cursor.execute("SELECT id FROM scholars WHERE ia_identifier = ?", (identifier,))
    scholar_id = cursor.fetchone()[0]

    cursor.execute(
        """INSERT OR IGNORE INTO collections
           (title, description, category, scholar_id, ia_identifier, item_count)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (
            metadata.get("title", config["name"]),
            metadata.get("description", ""),
            config["category"],
            scholar_id,
            identifier,
            len(mp3_files),
        ),
    )
    cursor.execute("SELECT id FROM collections WHERE ia_identifier = ?", (identifier,))
    collection_id = cursor.fetchone()[0]

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
    print(f"  -> {len(mp3_files)} fichiers MP3 ajoutés")


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


def main():
    print("=" * 50)
    print("Scraper Internet Archives - Collections Islamiques")
    print("=" * 50)

    conn = init_db()

    for collection in IA_COLLECTIONS:
        scrape_collection(conn, collection)

    print("\nExport vers JSON...")
    export_json(conn)

    conn.close()
    print(f"\nTerminé! Base: {DB_PATH}, JSON: {JSON_DIR}")


if __name__ == "__main__":
    main()
