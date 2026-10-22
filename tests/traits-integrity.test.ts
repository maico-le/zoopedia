import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Milestone M4: Biological Traits & Content Integrity', () => {
  const speciesDir = path.resolve(__dirname, '../data/species');
  const files = fs.readdirSync(speciesDir).filter((f) => f.endsWith('.json'));

  it('should verify all catalogued species files exist', () => {
    expect(files.length).toBeGreaterThanOrEqual(106);
  });

  it('should verify each species has valid morphology length and weight', () => {
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(speciesDir, file), 'utf-8'));
      expect(data.morphology, `Missing morphology in ${file}`).toBeDefined();
      expect(data.morphology.lengthCm, `Missing lengthCm in ${file}`).toBeInstanceOf(Array);
      expect(data.morphology.lengthCm.length).toBe(2);
      expect(data.morphology.lengthCm[0]).toBeGreaterThan(0);
      expect(data.morphology.lengthCm[1]).toBeGreaterThanOrEqual(data.morphology.lengthCm[0]);
    }
  });

  it('should verify each species has detailed life cycle stages', () => {
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(speciesDir, file), 'utf-8'));
      expect(data.lifeCycle, `Missing lifeCycle in ${file}`).toBeDefined();
      expect(data.lifeCycle.stages.length, `Expected stages in ${file}`).toBeGreaterThanOrEqual(2);
      for (const stage of data.lifeCycle.stages) {
        expect(stage.key).toBeTruthy();
        expect(stage.name.vi).toBeTruthy();
        expect(stage.name.en).toBeTruthy();
      }
    }
  });

  it('should verify each species has dietary classification and prey/food list', () => {
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(speciesDir, file), 'utf-8'));
      expect(data.diet, `Missing diet in ${file}`).toBeDefined();
      expect(data.diet.type).toBeTruthy();
      expect(data.diet.preyOrFood.length).toBeGreaterThan(0);
    }
  });

  it('should verify each species has scientific fun facts with bilingual texts', () => {
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(speciesDir, file), 'utf-8'));
      expect(data.funFacts.length, `Expected funFacts in ${file}`).toBeGreaterThanOrEqual(1);
      expect(data.funFacts[0].vi).toBeTruthy();
      expect(data.funFacts[0].en).toBeTruthy();
    }
  });

  it('should verify provenance contains all mandatory fields and valid methods', () => {
    const validMethods = ['extracted', 'curated', 'llm_summarized', 'machine_translated', 'database_import'];
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(speciesDir, file), 'utf-8'));
      expect(data.provenance.length).toBeGreaterThanOrEqual(4);
      for (const prov of data.provenance) {
        expect(prov.field).toBeTruthy();
        expect(prov.source).toBeTruthy();
        expect(prov.license).toBeTruthy();
        expect(validMethods).toContain(prov.method);
      }
    }
  });
});
