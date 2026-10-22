"""
Download authentic, realistic Google 3D AR animal models for Zoopedia.
"""
import os
import sys
import urllib.request

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

MODEL_MAP = {
    'Tiger': 'panthera-tigris.glb',
    'Lion': 'panthera-leo.glb',
    'TimberWolf': 'canis-lupus.glb',
    'GiantPanda': 'ailuropoda-melanoleuca.glb',
    'BrownBear': 'ursus-arctos.glb',
    'Cheetah': 'acinonyx-jubatus.glb',
    'Alligator': 'crocodylus-siamensis.glb',
    'GreatWhiteShark': 'carcharodon-carcharias.glb',
    'GreenSeaTurtle': 'chelonia-mydas.glb',
    'BallPython': 'python-bivittatus.glb',
    'Macaw': 'ara-macao.glb',
}

BASE_URL = 'https://storage.googleapis.com/ar-answers-in-search-models/static'

def main():
    print("🚀 Downloading photorealistic 3D animal models...")
    for source_name, target_file in MODEL_MAP.items():
        target_path = os.path.join(MODELS_DIR, target_file)
        url = f"{BASE_URL}/{source_name}/model.glb"
        print(f"📥 Downloading {source_name} -> {target_file}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp, open(target_path, 'wb') as out:
                out.write(resp.read())
            size_mb = os.path.getsize(target_path) / (1024 * 1024)
            print(f"   ✅ Done! Size: {size_mb:.2f} MB")
        except Exception as e:
            print(f"   ❌ Failed: {e}")

    # Remove temporary file if exists
    if os.path.exists('google_tiger.glb'):
        os.remove('google_tiger.glb')
    if os.path.exists('temp_tiger.glb'):
        os.remove('temp_tiger.glb')

    print("🎉 All realistic 3D models downloaded and ready!")

if __name__ == '__main__':
    main()
