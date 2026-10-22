"""
GBIF Backbone Taxonomy API Client
"""
from .config import cached_get_json

GBIF_MATCH_URL = "https://api.gbif.org/v1/species/match"
GBIF_SPECIES_URL = "https://api.gbif.org/v1/species/{key}"
GBIF_VERNACULAR_URL = "https://api.gbif.org/v1/species/{key}/vernacularNames"

def fetch_gbif_taxonomy(scientific_name: str) -> dict | None:
    """Matches scientific name against GBIF Backbone Taxonomy and returns full classification."""
    match_data = cached_get_json(GBIF_MATCH_URL, params={'name': scientific_name, 'strict': 'true'})
    if not match_data or match_data.get('matchType') == 'NONE':
        # Try non-strict
        match_data = cached_get_json(GBIF_MATCH_URL, params={'name': scientific_name})

    if not match_data or not match_data.get('usageKey'):
        return None

    usage_key = match_data['usageKey']
    species_details = cached_get_json(GBIF_SPECIES_URL.format(key=usage_key))
    vernacular_data = cached_get_json(GBIF_VERNACULAR_URL.format(key=usage_key), params={'limit': 100})

    eng_names = []
    vie_names = []
    if vernacular_data and 'results' in vernacular_data:
        for item in vernacular_data['results']:
            lang = (item.get('language') or '').lower()
            name = (item.get('vernacularName') or '').strip()
            if not name:
                continue
            if lang in ['eng', 'en'] and name not in eng_names:
                eng_names.append(name.capitalize())
            elif lang in ['vie', 'vi'] and name not in vie_names:
                vie_names.append(name.capitalize())

    taxonomy = {
        'kingdom': match_data.get('kingdom') or 'Animalia',
        'phylum': match_data.get('phylum') or 'Unknown',
        'class': match_data.get('class') or 'Unknown',
        'order': match_data.get('order') or 'Unknown',
        'family': match_data.get('family') or 'Unknown',
        'genus': match_data.get('genus') or 'Unknown',
        'subspecies': []
    }

    return {
        'usageKey': usage_key,
        'scientificName': match_data.get('scientificName') or scientific_name,
        'canonicalName': match_data.get('canonicalName') or scientific_name,
        'authorship': species_details.get('authorship') if species_details else None,
        'taxonomy': taxonomy,
        'vernacular_en': eng_names,
        'vernacular_vi': vie_names,
    }
