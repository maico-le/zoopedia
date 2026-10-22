import MiniSearch from 'minisearch';
import speciesIndexData from '../../data/species-index.json';
import { removeVietnameseAccents } from './normalize-vi';

export interface SearchableSpecies {
  id: string;
  nameVi: string;
  nameEn: string;
  scientific: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  iucn: string;
  tier: string;
  has3D: boolean;
  thumbnail?: string | null;
}

const speciesList: SearchableSpecies[] = speciesIndexData as SearchableSpecies[];

/**
 * Custom tokenizer that indexes both normalized (unaccented) and original tokens.
 */
function customTokenizer(text: string): string[] {
  if (!text) return [];
  const words = text.toLowerCase().split(/[\s,\-_./()]+/).filter(Boolean);
  const normalizedWords = words.map(removeVietnameseAccents);
  return Array.from(new Set([...words, ...normalizedWords]));
}

// Initialize MiniSearch engine with multi-lingual indexing
export const searchEngine = new MiniSearch<SearchableSpecies>({
  fields: ['nameVi', 'nameEn', 'scientific', 'phylum', 'class', 'order', 'family', 'id'],
  storeFields: ['id', 'nameVi', 'nameEn', 'scientific', 'phylum', 'class', 'order', 'iucn', 'tier', 'has3D', 'thumbnail'],
  tokenize: customTokenizer,
  processTerm: (term) => removeVietnameseAccents(term.toLowerCase()),
  searchOptions: {
    boost: { nameVi: 3, scientific: 2.5, nameEn: 2, phylum: 1 },
    fuzzy: 0.2,
    prefix: true,
  },
});

// Index all species
searchEngine.addAll(speciesList);

export interface FilterOptions {
  phylum?: string;
  class?: string;
  diet?: string;
  iucn?: string;
  has3DOnly?: boolean;
  tierAOnly?: boolean;
}

/**
 * Searches species with keyword query and filters.
 */
export function searchSpecies(
  query: string,
  filters?: FilterOptions
): SearchableSpecies[] {
  let results: SearchableSpecies[] = [];

  const trimmed = query.trim();
  if (trimmed) {
    const searchResults = searchEngine.search(trimmed);
    const idMap = new Map(speciesList.map((s) => [s.id, s]));
    results = searchResults
      .map((r) => idMap.get(r.id))
      .filter((s): s is SearchableSpecies => Boolean(s));
  } else {
    results = [...speciesList];
  }

  // Apply filters
  if (filters) {
    if (filters.phylum && filters.phylum !== 'ALL') {
      results = results.filter((s) => s.phylum === filters.phylum);
    }
    if (filters.class && filters.class !== 'ALL') {
      results = results.filter((s) => s.class === filters.class);
    }
    if (filters.iucn && filters.iucn !== 'ALL') {
      results = results.filter((s) => s.iucn === filters.iucn);
    }
    if (filters.has3DOnly) {
      results = results.filter((s) => s.has3D);
    }
    if (filters.tierAOnly) {
      results = results.filter((s) => s.tier === 'A');
    }
  }

  return results;
}

export function getRandomSpecies(): SearchableSpecies {
  const index = Math.floor(Math.random() * speciesList.length);
  return speciesList[index];
}

export function getAllPhylaList(): string[] {
  return Array.from(new Set(speciesList.map((s) => s.phylum))).sort();
}

export function getAllClassesList(phylum?: string): string[] {
  let list = speciesList;
  if (phylum && phylum !== 'ALL') {
    list = list.filter((s) => s.phylum === phylum);
  }
  return Array.from(new Set(list.map((s) => s.class))).sort();
}
