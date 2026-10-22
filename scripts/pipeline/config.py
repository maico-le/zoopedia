"""
Zoopedia Pipeline Configuration & HTTP Cache
"""
import os
import json
import hashlib
import time
import requests

CACHE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../.cache/http'))
os.makedirs(CACHE_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'ZoopediaAgent/1.0 (https://zoopedia.org; contact: dev@zoopedia.org) Python-Requests',
    'Accept': 'application/json',
}

def _cache_path(url: str, params: dict = None) -> str:
    key_str = url + (json.dumps(params, sort_keys=True) if params else '')
    hashed = hashlib.sha256(key_str.encode('utf-8')).hexdigest()
    return os.path.join(CACHE_DIR, f"{hashed}.json")

def cached_get_json(url: str, params: dict = None, delay: float = 0.05) -> dict | None:
    """Fetch URL with disk caching to avoid redundant requests."""
    c_path = _cache_path(url, params)
    if os.path.exists(c_path):
        try:
            with open(c_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            pass

    time.sleep(delay)
    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=12)
        if resp.status_code == 200:
            data = resp.json()
            with open(c_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return data
        else:
            return None
    except Exception as e:
        print(f"HTTP Error fetching {url}: {e}")
        return None
