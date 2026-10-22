import { describe, it, expect } from 'vitest';
import { searchSpecies, getRandomSpecies } from '../src/lib/search-engine';

describe('Zoopedia Search Engine (MiniSearch + Vietnamese)', () => {
  it('should find species with Vietnamese accents (e.g. "Hổ", "Chó sói")', () => {
    const results = searchSpecies('Hổ');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((s) => s.id === 'panthera-tigris')).toBe(true);

    const wolfResults = searchSpecies('Chó sói');
    expect(wolfResults.some((s) => s.id === 'canis-lupus')).toBe(true);
  });

  it('should find species without accents (e.g. "ho", "cho soi", "bach tuoc")', () => {
    const results = searchSpecies('ho');
    expect(results.some((s) => s.id === 'panthera-tigris')).toBe(true);

    const octopusResults = searchSpecies('bach tuoc');
    expect(octopusResults.some((s) => s.id === 'octopus-vulgaris')).toBe(true);
  });

  it('should find species by scientific genus or species name', () => {
    const panthera = searchSpecies('Panthera');
    expect(panthera.length).toBeGreaterThanOrEqual(3); // Tiger, Lion, Leopard

    const delphinus = searchSpecies('Delphinus');
    expect(delphinus.some((s) => s.id === 'delphinus-delphis')).toBe(true);
  });

  it('should find species by English name', () => {
    const tigers = searchSpecies('Tiger');
    expect(tigers.some((s) => s.id === 'panthera-tigris')).toBe(true);

    const sharks = searchSpecies('Shark');
    expect(sharks.length).toBeGreaterThan(0);
  });

  it('should filter correctly by phylum, IUCN status, and 3D availability', () => {
    const chordates = searchSpecies('', { phylum: 'Chordata' });
    expect(chordates.every((s) => s.phylum === 'Chordata')).toBe(true);

    const endangered = searchSpecies('', { iucn: 'EN' });
    expect(endangered.every((s) => s.iucn === 'EN')).toBe(true);

    const tierA = searchSpecies('', { tierAOnly: true });
    expect(tierA.every((s) => s.tier === 'A')).toBe(true);
  });

  it('should return a random valid species', () => {
    const random = getRandomSpecies();
    expect(random).toBeDefined();
    expect(random.id).toBeTruthy();
    expect(random.nameVi).toBeTruthy();
  });
});
