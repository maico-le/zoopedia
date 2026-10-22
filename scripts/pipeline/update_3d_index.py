import os
import sys
import json

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

SPECIES_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'species')
INDEX_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'species-index.json')

NEW_3D_SPECIES = {
    'panthera-tigris': 'models/panthera-tigris.glb',
    'panthera-leo': 'models/panthera-leo.glb',
    'canis-lupus': 'models/canis-lupus.glb',
    'ursus-arctos': 'models/ursus-arctos.glb',
    'ailuropoda-melanoleuca': 'models/ailuropoda-melanoleuca.glb',
    'carcharodon-carcharias': 'models/carcharodon-carcharias.glb',
    'chelonia-mydas': 'models/chelonia-mydas.glb',
    'crocodylus-siamensis': 'models/crocodylus-siamensis.glb',
    'python-bivittatus': 'models/python-bivittatus.glb',
    'ara-macao': 'models/ara-macao.glb',
    'acinonyx-jubatus': 'models/acinonyx-jubatus.glb',
}

def update_models():
    for slug, glb in NEW_3D_SPECIES.items():
        fp = os.path.join(SPECIES_DIR, f"{slug}.json")
        if os.path.exists(fp):
            with open(fp, 'r', encoding='utf-8') as f:
                data = json.load(f)
            data['media']['model3d'] = {
                'glb': glb,
                'tier': 'A',
                'hasAnimations': True,
                'source': 'Google Search AR Open Assets',
                'sourceUrl': 'https://arvr.google.com/scene-viewer',
                'license': 'Educational-Fair-Use',
                'author': 'Google AR Research',
                'isRepresentative': False
            }
            with open(fp, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"Updated 3D model for {slug}")

    # Update species-index.json
    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        index_data = json.load(f)

    for item in index_data:
        if item['id'] in NEW_3D_SPECIES:
            item['has3D'] = True
            item['tier'] = 'A'

    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)

    print("✅ All species records and species-index updated!")

if __name__ == '__main__':
    update_models()
