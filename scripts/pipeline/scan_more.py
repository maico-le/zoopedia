import urllib.request

names = [
    'African_elephant', 'african_elephant', 'Asian_elephant', 'asian_elephant',
    'Blue_whale', 'blue_whale', 'Humpback_whale', 'humpback_whale',
    'Killer_whale', 'killer_whale', 'Bottlenose_dolphin', 'bottlenose_dolphin',
    'Dolphin', 'dolphin', 'Koala', 'koala', 'Kangaroo', 'kangaroo',
    'Red_kangaroo', 'red_kangaroo', 'Giraffe', 'giraffe',
    'Hippopotamus', 'hippopotamus', 'White_rhinoceros', 'white_rhinoceros',
    'Rhinoceros', 'rhinoceros', 'Platypus', 'platypus',
    'Common_octopus', 'common_octopus', 'Octopus', 'octopus',
    'Chameleon', 'chameleon', 'Komodo_dragon', 'komodo_dragon',
    'Great_horned_owl', 'great_horned_owl', 'Snowy_owl', 'snowy_owl',
    'Barn_owl', 'barn_owl', 'Mallard', 'mallard',
    'Canada_goose', 'canada_goose', 'Mute_swan', 'mute_swan',
    'Channel_catfish', 'channel_catfish', 'Clownfish', 'clownfish',
    'Monarch_butterfly', 'monarch_butterfly', 'Honeybee', 'honeybee',
    'Scorpion', 'scorpion', 'Tarantula', 'tarantula', 'Frog', 'frog',
    'Bullfrog', 'bullfrog', 'Axolotl', 'axolotl', 'Red_fox', 'red_fox',
    'Arctic_fox', 'arctic_fox', 'Fennec_fox', 'fennec_fox',
    'RedPanda', 'red_panda', 'Giant_panda', 'giant_panda',
    'Duck', 'MallardDuck', 'Peregrine_falcon'
]

base = 'https://storage.googleapis.com/ar-answers-in-search-models/static'

for n in names:
    try:
        req = urllib.request.Request(f'{base}/{n}/model.glb', method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=2) as resp:
            sz = int(resp.headers.get("Content-Length", 0)) / (1024 * 1024)
            print(f"FOUND: {n} ({sz:.2f} MB)")
    except Exception:
        pass
