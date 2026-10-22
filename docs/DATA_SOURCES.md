# Data Sources & Licensing Guide (DATA_SOURCES.md)

This document tracks all external sources, APIs, licensing terms, and usage guidelines for Zoopedia.

---

## 1. Taxonomic Backbone & Names

### 1.1 GBIF Backbone Taxonomy
- **API**: `https://api.gbif.org/v1/species`
- **Data License**: CC0 1.0 Universal / CC-BY 4.0
- **Usage**: Primary taxonomic backbone (Phylum -> Class -> Order -> Family -> Genus -> Species), scientific names, authorship, vernacular names in English (`eng`) and Vietnamese (`vie`).
- **Attribution**: GBIF Secretariat (2026). GBIF Backbone Taxonomy.

### 1.2 Catalogue of Life (COL / ChecklistBank)
- **API**: `https://api.checklistbank.org`
- **Data License**: CC-BY 4.0
- **Usage**: Secondary cross-referencing for synonyms, taxon status, and accepted scientific naming.

### 1.3 Wikidata (SPARQL & Entities API)
- **Endpoint**: `https://query.wikidata.org/sparql`
- **Data License**: CC0 1.0 (Public Domain Dedication)
- **Usage**: Mapping cross-identifiers (GBIF taxon key, IUCN assessment ID, iNaturalist taxon ID, EOL ID), vernacular names in Vietnamese (`label/alias[vi]`, P1843), Wikimedia Commons image links (P18).

### 1.4 Vietnamese Names Dictionary & Curated Sources
- **Location**: `data/manual/vi-names.csv`
- **Priority**: Highest priority for Vietnamese nomenclature.
- **Rule**: If a Vietnamese common name is machine-translated by LLM due to absence in Wikidata/iNat/Wikipedia, it MUST be marked with `"nameSource": { "vi": "machine_translated" }` and flagged with `"needsReview": true`.

---

## 2. Biological Knowledge & Descriptions

### 2.1 Wikipedia REST & Action APIs (vi & en)
- **API**: `https://en.wikipedia.org/api/rest_v1/`, `https://vi.wikipedia.org/api/rest_v1/`
- **License**: Creative Commons Attribution-ShareAlike 3.0 / 4.0 Unported (CC BY-SA).
- **Attribution Policy**:
  - All derived or summarized text retains CC BY-SA compliance.
  - Clear attribution links to the specific Wikipedia article revision are rendered in the species view and Credits page.

### 2.2 Trait Databases (Quantitative morphology, life cycle, reproduction)
- **AnAge (HAGR)**: Lifespan records. (Non-commercial / Educational use).
- **PanTHERIA / COMBINE**: Mammal life history traits (mass, gestation, litter size). Open access.
- **AVONET**: Comprehensive bird traits. CC-BY 4.0.
- **Amniote Life-History Database**: Reptile, avian, and mammalian life-history traits. CC0 / Open Data.

---

## 3. 3D Models & Anatomy

### 3.1 Smithsonian 3D Digitization (`3d.si.edu`)
- **License**: CC0 1.0 (Smithsonian Open Access)
- **Usage**: Digitized skeletal and anatomical specimens.

### 3.2 Sketchfab Open Content / CC-BY Models
- **Licenses allowed**: CC0, CC-BY 4.0.
- **Policy**: STRICT prohibition of non-commercial or restricted licenses without explicit legal clearance. Every model records `license`, `author`, `sourceUrl`.

### 3.3 Low-Poly Animal Templates (Tier B)
- **Quaternius / Poly Pizza / Kenney**: CC0 Public Domain.
- **Usage**: Outer shell and morphology templates for animal orders and phyla.
