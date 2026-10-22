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

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const speciesSchema = JSON.parse(fs.readFileSync(SPECIES_SCHEMA_PATH, 'utf-8'));
const anatomySchema = JSON.parse(fs.readFileSync(ANATOMY_SCHEMA_PATH, 'utf-8'));

const validateSpecies = ajv.compile(speciesSchema);
const validateAnatomy = ajv.compile(anatomySchema);

describe('Zoopedia Data & Schema Tests', () => {
  it('should validate all species files against species.schema.json', () => {
    const files = fs.readdirSync(SPECIES_DIR).filter(f => f.endsWith('.json'));
    expect(files.length).toBeGreaterThan(0);

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

  it('should validate all anatomy files against anatomy.schema.json', () => {
    const files = fs.readdirSync(ANATOMY_DIR).filter(f => f.endsWith('.json'));
    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(ANATOMY_DIR, file), 'utf-8'));
      const valid = validateAnatomy(content);
      if (!valid) {
        console.error(`Validation errors in ${file}:`, validateAnatomy.errors);
      }
      expect(valid).toBe(true);
      expect(content.layers.length).toBeGreaterThan(0);
      expect(content.parts.length).toBeGreaterThan(0);
    }
  });

  it('should ensure every species has Vietnamese and English common names', () => {
    const files = fs.readdirSync(SPECIES_DIR).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const content = JSON.parse(fs.readFileSync(path.join(SPECIES_DIR, file), 'utf-8'));
      expect(content.names.scientific).toBeTruthy();
      expect(content.names.vi.length).toBeGreaterThan(0);
      expect(content.names.en.length).toBeGreaterThan(0);
    }
  });
});
