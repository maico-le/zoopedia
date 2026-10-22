"""
Wikidata API Client for cross-identifiers, multilingual common names, and Wikimedia images.
"""
from .config import cached_get_json

WIKIDATA_SEARCH_URL = "https://www.wikidata.org/w/api.php"
WIKIDATA_ENTITY_URL = "https://www.wikidata.org/wiki/Special:EntityData/{qid}.json"

def fetch_wikidata_taxon(scientific_name: str) -> dict | None:
    """Searches Wikidata for the taxon item and extracts IDs, localized names, and Commons image."""
    search_params = {
        'action': 'wbsearchentities',
        'search': scientific_name,
        'language': 'en',
        'format': 'json',
        'limit': 5,
    }
    search_res = cached_get_json(WIKIDATA_SEARCH_URL, params=search_params)
    if not search_res or not search_res.get('search'):
        return None

    # Pick the best match
    best_item = None
    for item in search_res['search']:
        desc = (item.get('description') or '').lower()
        if any(term in desc for term in ['species', 'taxon', 'mammal', 'bird', 'fish', 'animal', 'insect']):
            best_item = item
            break
    if not best_item:
        best_item = search_res['search'][0]

    qid = best_item['id']
    entity_data = cached_get_json(WIKIDATA_ENTITY_URL.format(qid=qid))
    if not entity_data or 'entities' not in entity_data or qid not in entity_data['entities']:
        return None

    entity = entity_data['entities'][qid]
    claims = entity.get('claims', {})

    # Extract cross-identifiers:
    # P846 = GBIF taxon ID
    # P3151 = iNaturalist taxon ID
    # P627 = IUCN taxon ID
    # P830 = EOL ID
    inat_id = None
    if 'P3151' in claims:
        try:
            inat_id = int(claims['P3151'][0]['mainsnak']['datavalue']['value'])
        except Exception:
            pass

    iucn_id = None
    if 'P627' in claims:
        try:
            iucn_id = claims['P627'][0]['mainsnak']['datavalue']['value']
        except Exception:
            pass

    eol_id = None
    if 'P830' in claims:
        try:
            eol_id = claims['P830'][0]['mainsnak']['datavalue']['value']
        except Exception:
            pass

    # Extract Wikimedia Commons Image (P18)
    image_url = None
    image_name = None
    if 'P18' in claims:
        try:
            image_name = claims['P18'][0]['mainsnak']['datavalue']['value']
            # Wikimedia commons thumbnail URL
            image_url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{image_name.replace(' ', '_')}?width=1280"
        except Exception:
            pass

    # Multilingual labels and aliases
    labels = entity.get('labels', {})
    aliases = entity.get('aliases', {})

    names_vi = []
    if 'vi' in labels:
        names_vi.append(labels['vi']['value'].strip().capitalize())
    if 'vi' in aliases:
        for a in aliases['vi']:
            val = a['value'].strip().capitalize()
            if val not in names_vi:
                names_vi.append(val)

    names_en = []
    if 'en' in labels:
        names_en.append(labels['en']['value'].strip().capitalize())
    if 'en' in aliases:
        for a in aliases['en']:
            val = a['value'].strip().capitalize()
            if val not in names_en:
                names_en.append(val)

    sitelinks = entity.get('sitelinks', {})
    wiki_vi = sitelinks.get('viwiki', {}).get('url')
    wiki_en = sitelinks.get('enwiki', {}).get('url')

    return {
        'qid': qid,
        'inaturalist_id': inat_id,
        'iucn_id': iucn_id,
        'eol_id': eol_id,
        'image_url': image_url,
        'image_name': image_name,
        'names_vi': names_vi,
        'names_en': names_en,
        'wiki_vi': wiki_vi,
        'wiki_en': wiki_en,
    }
