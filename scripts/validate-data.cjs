/**
 * scripts/validate-data.cjs
 * Validates species and anatomy data against JSON Schemas,
 * verifies provenance rules, and computes completeness scores (0-100).
 */
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

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

/**
 * Computes a completeness score from 0 to 100 based on biological completeness.
 */
function calculateCompleteness(species) {
  let score = 0;
  const weights = {
    names: 15,
    taxonomy: 10,
    morphology: 10,
    habitat: 10,
    distribution: 5,
    diet: 10,
    behavior: 10,
    lifeCycle: 10,
    reproduction: 10,
    conservation: 5,
    media: 5,
  };

  if (species.names?.scientific && species.names?.vi?.length > 0 && species.names?.en?.length > 0) {
    score += weights.names;
  }
  if (species.taxonomy?.phylum && species.taxonomy?.class && species.taxonomy?.order && species.taxonomy?.family) {
    score += weights.taxonomy;
  }
  if (species.morphology?.description?.vi || species.morphology?.lengthCm || species.morphology?.weightKg) {
    score += weights.morphology;
  }
  if (species.habitat?.biomes?.length > 0 || species.habitat?.description?.vi) {
    score += weights.habitat;
  }
  if (species.distribution?.countries?.length > 0 || species.distribution?.text?.vi) {
    score += weights.distribution;
  }
  if (species.diet?.type) {
    score += weights.diet;
  }
  if (species.behavior?.activityPattern || species.behavior?.text?.vi) {
    score += weights.behavior;
  }
  if (species.lifeCycle?.stages?.length > 0 || species.lifeCycle?.lifespanYears) {
    score += weights.lifeCycle;
  }
  if (species.reproduction?.mode || species.reproduction?.text?.vi) {
    score += weights.reproduction;
  }
  if (species.conservation?.iucn) {
    score += weights.conservation;
  }
  if (species.media?.model3d?.glb || (species.media?.images && species.media.images.length > 0)) {
    score += weights.media;
  }

  return Math.min(100, Math.round(score));
}

function runValidation() {
  console.log('🔍 Running Zoopedia Data Validation...\n');
  let hasErrors = false;
  let totalSpecies = 0;
  let totalAnatomy = 0;
  const qualityReport = [];

  // 1. Validate Species
  if (fs.existsSync(SPECIES_DIR)) {
    const speciesFiles = fs.readdirSync(SPECIES_DIR).filter(f => f.endsWith('.json'));
    totalSpecies = speciesFiles.length;

    for (const file of speciesFiles) {
      const filePath = path.join(SPECIES_DIR, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const valid = validateSpecies(data);

        if (!valid) {
          hasErrors = true;
          console.error(`❌ Schema Error in ${file}:`);
          for (const err of validateSpecies.errors) {
            console.error(`   - ${err.instancePath || '/'}: ${err.message}`);
          }
        }

        // Provenance checks: must exist and have items
        if (!Array.isArray(data.provenance) || data.provenance.length === 0) {
          hasErrors = true;
          console.error(`❌ Provenance Error in ${file}: Provenance entries required for all species`);
        }

        const completeness = calculateCompleteness(data);
        qualityReport.push({
          id: data.id,
          nameVi: data.names?.vi?.[0] || 'Unknown',
          scientific: data.names?.scientific || 'Unknown',
          completeness: `${completeness}%`,
          tier: data.media?.model3d?.tier || 'C',
          has3D: !!data.media?.model3d?.glb,
        });
      } catch (err) {
        hasErrors = true;
        console.error(`❌ Parse Error reading ${file}:`, err.message);
      }
    }
  }

  // 2. Validate Anatomy Maps
  if (fs.existsSync(ANATOMY_DIR)) {
    const anatomyFiles = fs.readdirSync(ANATOMY_DIR).filter(f => f.endsWith('.json'));
    totalAnatomy = anatomyFiles.length;

    for (const file of anatomyFiles) {
      const filePath = path.join(ANATOMY_DIR, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const valid = validateAnatomy(data);

        if (!valid) {
          hasErrors = true;
          console.error(`❌ Anatomy Schema Error in ${file}:`);
          for (const err of validateAnatomy.errors) {
            console.error(`   - ${err.instancePath || '/'}: ${err.message}`);
          }
        }
      } catch (err) {
        hasErrors = true;
        console.error(`❌ Parse Error reading ${file}:`, err.message);
      }
    }
  }

  // 3. Summary Output
  console.log('----------------------------------------------------');
  console.log(`Summary: Validated ${totalSpecies} species, ${totalAnatomy} anatomy files.`);
  if (qualityReport.length > 0) {
    console.log('\nData Completeness Report:');
    console.table(qualityReport);
  }
  console.log('----------------------------------------------------');

  if (hasErrors) {
    console.error('❌ Validation FAILED with errors.');
    process.exit(1);
  } else {
    console.log('✅ All data and schema checks PASSED cleanly.\n');
    process.exit(0);
  }
}

runValidation();
