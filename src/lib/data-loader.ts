import speciesIndexData from '../../data/species-index.json';
import taxaTreeData from '../../data/taxa/tree.json';
import { Species } from '../types/species';

export interface SpeciesIndexItem {
  id: string;
  nameVi: string;
  nameEn: string;
  scientific: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  iucn: string;
  tier: 'A' | 'B' | 'C';
  has3D: boolean;
  thumbnail?: string | null;
}

export function getAllSpeciesIndex(): SpeciesIndexItem[] {
  return (speciesIndexData as unknown) as SpeciesIndexItem[];
}

export function getTaxaTree(): Record<string, unknown> {
  return taxaTreeData;
}

/**
 * Dynamically loads a species data file by its slug ID.
 */
export async function loadSpeciesBySlug(slug: string): Promise<Species | null> {
  try {
    // Dynamic import for client lazy-loading
    const module = await import(`../../data/species/${slug}.json`);
    return module.default as Species;
  } catch (err) {
    console.error(`Failed to load species data for ${slug}:`, err);
    return null;
  }
}
