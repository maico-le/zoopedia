"""
Zoopedia Data Pipeline Orchestrator (Milestone M2)
Executes taxonomy retrieval from GBIF and Wikidata across ~100 species in 8 Phyla.
Uses ThreadPoolExecutor for fast concurrent processing.
"""
import os
import sys
import csv
import json
import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from tqdm import tqdm
from .gbif_client import fetch_gbif_taxonomy
from .wikidata_client import fetch_wikidata_taxon
from .species_builder import build_species_record, to_slug

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
CSV_PATH = os.path.join(ROOT_DIR, 'data/manual/vi-names.csv')
SPECIES_DIR = os.path.join(ROOT_DIR, 'data/species')
INDEX_PATH = os.path.join(ROOT_DIR, 'data/species-index.json')
TAXA_TREE_PATH = os.path.join(ROOT_DIR, 'data/taxa/tree.json')

os.makedirs(SPECIES_DIR, exist_ok=True)
os.makedirs(os.path.dirname(TAXA_TREE_PATH), exist_ok=True)

def load_seed_list(csv_path: str) -> list[dict]:
    seeds = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            seeds.append(row)
    return seeds

def process_single_species(row: dict) -> dict:
    sci_name = row['scientific_name']
    slug = to_slug(sci_name)

    gbif_info = fetch_gbif_taxonomy(sci_name)
    wiki_info = fetch_wikidata_taxon(sci_name)

    record = build_species_record(
        scientific_name=sci_name,
        manual_vi=row.get('name_vi', ''),
        manual_en=row.get('name_en', ''),
        gbif_info=gbif_info,
        wiki_info=wiki_info,
        phylum_fallback=row.get('phylum', 'Chordata'),
        class_fallback=row.get('class', 'Mammalia'),
    )

    out_file = os.path.join(SPECIES_DIR, f"{slug}.json")
    if os.path.exists(out_file) and slug == 'panthera-tigris':
        try:
            with open(out_file, 'r', encoding='utf-8') as f:
                existing = json.load(f)
                if existing.get('morphology', {}).get('lengthCm'):
                    record['morphology'] = existing['morphology']
                    record['habitat'] = existing['habitat']
                    record['diet'] = existing['diet']
                    record['behavior'] = existing['behavior']
                    record['lifeCycle'] = existing['lifeCycle']
                    record['reproduction'] = existing['reproduction']
                    record['conservation'] = existing['conservation']
                    record['funFacts'] = existing['funFacts']
        except Exception:
            pass

    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(record, f, ensure_ascii=False, indent=2)

    m3d = record['media'].get('model3d')
    return {
        'id': slug,
        'nameVi': record['names']['vi'][0],
        'nameEn': record['names']['en'][0],
        'scientific': sci_name,
        'phylum': record['taxonomy']['phylum'],
        'class': record['taxonomy']['class'],
        'order': record['taxonomy']['order'],
        'family': record['taxonomy']['family'],
        'iucn': record['conservation']['iucn'],
        'tier': m3d.get('tier', 'C') if m3d else 'C',
        'has3D': bool(m3d and m3d.get('glb')),
        'thumbnail': record['media']['images'][0]['url'] if record['media'].get('images') else None,
    }

def main():
    parser = argparse.ArgumentParser(description="Zoopedia M2 Data Pipeline")
    parser.add_argument('--limit', type=int, default=None, help="Limit number of species")
    parser.add_argument('--slug', type=str, default=None, help="Process single species")
    parser.add_argument('--workers', type=int, default=6, help="Worker threads")
    args = parser.parse_args()

    seeds = load_seed_list(CSV_PATH)
    if args.slug:
        seeds = [s for s in seeds if to_slug(s['scientific_name']) == args.slug or s['scientific_name'].lower() == args.slug.lower()]
    if args.limit:
        seeds = seeds[:args.limit]

    print(f"🚀 Launching Zoopedia Concurrent Pipeline for {len(seeds)} species ({args.workers} workers)...")

    species_index = []
    taxa_tree = {}

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        future_to_seed = {executor.submit(process_single_species, s): s for s in seeds}
        for future in tqdm(as_completed(future_to_seed), total=len(seeds), desc="Processing"):
            try:
                item = future.result()
                species_index.append(item)

                p = item['phylum']
                c = item['class']
                o = item['order']

                if p not in taxa_tree:
                    taxa_tree[p] = {'classes': {}, 'speciesCount': 0}
                taxa_tree[p]['speciesCount'] += 1

                if c not in taxa_tree[p]['classes']:
                    taxa_tree[p]['classes'][c] = {'orders': {}, 'speciesCount': 0}
                taxa_tree[p]['classes'][c]['speciesCount'] += 1

                if o not in taxa_tree[p]['classes'][c]['orders']:
                    taxa_tree[p]['classes'][c]['orders'][o] = []
                taxa_tree[p]['classes'][c]['orders'][o].append(item['id'])
            except Exception as e:
                print(f"Error processing species: {e}")

    # Sort index by phylum, class, scientific name
    species_index.sort(key=lambda x: (x['phylum'], x['class'], x['scientific']))

    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
        json.dump(species_index, f, ensure_ascii=False, indent=2)

    with open(TAXA_TREE_PATH, 'w', encoding='utf-8') as f:
        json.dump(taxa_tree, f, ensure_ascii=False, indent=2)

    print("\n✅ M2 Pipeline Run Completed!")
    print(f"📊 Processed {len(species_index)} species across {len(taxa_tree)} phyla.")
    print(f"📄 Species index saved to: {INDEX_PATH}")
    print(f"🌳 Taxa tree saved to: {TAXA_TREE_PATH}")

if __name__ == '__main__':
    main()
