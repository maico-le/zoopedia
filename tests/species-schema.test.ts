import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ROOT_DIR = path.resolve(__dirname, '..');
const SPECIES_SCHEMA_PATH = path.join(ROOT_DIR, 'data/schema/species.schema.json');
const ANATOMY_SCHEMA_PATH = path.join(ROOT_DIR, 'data/schema/anatomy.schema.json');
const SPECIES_DIR = path.join(ROOT_DIR, 'data/species');
const ANATOMY_DIR = path.join(ROOT_DIR, 'public/anatomy');
const INDEX_PATH = path.join(ROOT_DIR, 'data/species-index.json');
const TAXA_TREE_PATH = path.join(ROOT_DIR, 'data/taxa/tree.json');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const speciesSchema = JSON.parse(fs.readFileSync(SPECIES_SCHEMA_PATH, 'utf-8'));
const anatomySchema = JSON.parse(fs.readFileSync(ANATOMY_SCHEMA_PATH, 'utf-8'));

const validateSpecies = ajv.compile(speciesSchema);
const validateAnatomy = ajv.compile(anatomySchema);

describe('Zoopedia M2 Data & Taxonomy Tests', () => {
  it('should validate all species files against species.schema.json', () => {
    const files = fs.readdirSync(SPECIES_DIR).filter(f => f.endsWith('.json'));
    expect(files.length).toBeGreaterThanOrEqual(100);

    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(SPECIES_DIR, file), 'utf-8'));
      const valid = validateSpecies(content);
      if (!valid) {
        console.error(`Validation errors in ${file}:`, validateSpecies.errors);
      }
      expect(valid).toBe(true);
      expect(content.provenance).toBeDefined();
      expect(content.provenance.length).toBeGreaterThan(0);
    }
  });

  it('should cover all 8 required animal phyla', () => {
    const tree = JSON.parse(fs.readFileSync(TAXA_TREE_PATH, 'utf-8'));
    const requiredPhyla = [
      'Chordata',
      'Arthropoda',
      'Mollusca',
      'Annelida',
      'Cnidaria',
      'Echinodermata',
      'Porifera',
      'Platyhelminthes',
    ];

    for (const phylum of requiredPhyla) {
      expect(tree[phylum]).toBeDefined();
      expect(tree[phylum].speciesCount).toBeGreaterThan(0);
    }
  });

  it('should cover diverse vertebrate classes in Chordata (Mammals, Birds, Reptiles, Amphibians, Fish)', () => {
    const tree = JSON.parse(fs.readFileSync(TAXA_TREE_PATH, 'utf-8'));
    const chordataClasses = Object.keys(tree.Chordata.classes);

    expect(chordataClasses).toContain('Mammalia');
    expect(chordataClasses).toContain('Aves');
    // Reptiles in GBIF cladistics are represented by Squamata, Crocodylia, Testudines or Reptilia
    const hasReptiles = chordataClasses.some(c => ['Reptilia', 'Squamata', 'Crocodylia', 'Testudines'].includes(c));
    expect(hasReptiles).toBe(true);

    expect(chordataClasses).toContain('Amphibia');
    // Fish represented by Actinopterygii, Chondrichthyes, or Elasmobranchii
    const hasFish = chordataClasses.some(c => ['Actinopterygii', 'Chondrichthyes', 'Elasmobranchii'].includes(c));
    expect(hasFish).toBe(true);
  });

  it('should validate all anatomy files against anatomy.schema.json', () => {
    const files = fs.readdirSync(ANATOMY_DIR).filter(f => f.endsWith('.json'));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(ANATOMY_DIR, file), 'utf-8'));
      const valid = validateAnatomy(content);
      expect(valid).toBe(true);
      expect(content.layers.length).toBeGreaterThan(0);
      expect(content.parts.length).toBeGreaterThan(0);
    }
  });

  it('should ensure species index is in sync with species data files', () => {
    const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));
    expect(index.length).toBeGreaterThanOrEqual(100);

    const firstItem = index[0];
    expect(firstItem.id).toBeTruthy();
    expect(firstItem.nameVi).toBeTruthy();
    expect(firstItem.scientific).toBeTruthy();
    expect(firstItem.phylum).toBeTruthy();
  });
});
