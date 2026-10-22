# Architecture & Project Decisions (DECISIONS.md)

This log documents architectural decisions, tradeoffs, deviations from default recommendations, and legal/licensing choices made throughout the development of Zoopedia.

---

## ADR-001: Root Directory Layout & Vite + React 19 Stack
- **Date**: 2026-10-22
- **Status**: Accepted
- **Context**: The project was requested under the workspace `animals-web`. Prompt suggested structure `zoopedia/src/...`.
- **Decision**: Keep the project root directly inside `animals-web` (containing `src/`, `data/`, `public/`, `scripts/`, `docs/`, `package.json`) to keep CI/CD, local npm commands, and deployment scripts simple without nested root indirection.
- **Dependencies**: React 19, `@react-three/fiber` v9, `@react-three/drei` v10, Three.js r173, Tailwind CSS v3.4, Zustand v5, React Router v7, MiniSearch v7.
- **Consequences**: Standard npm scripts (`npm run dev`, `npm run build`, `npm run test`, `npm run validate-data`) execute directly at repository root.

---

## ADR-002: Static Client-Side Data Architecture & Provenance Enforcement
- **Date**: 2026-10-22
- **Status**: Accepted
- **Context**: The MVP must run without a mandatory backend server and be deployable to static hosts (Cloudflare Pages, GitHub Pages).
- **Decision**: 
  - Species files are stored in `data/species/<slug>.json` conforming strictly to `data/schema/species.schema.json`.
  - Every text field, image, and 3D model contains structured `provenance` tracking (source, license, method, retrievedAt, needsReview).
  - Data validation is enforced via an Ajv script (`npm run validate-data`) executed locally and in CI workflows.
  - Completeness scores (0–100) are computed deterministically based on key taxonomic, morphological, ecological, reproductive, and anatomical fields.
- **Consequences**: Clean separation between data collection pipelines (Python/Node) and client runtime. Ready for future migration to SQLite/Postgres.

---

## ADR-003: 3-Tier Strategy for 3D Models & WebGL Graceful Fallback
- **Date**: 2026-10-22
- **Status**: Accepted
- **Context**: Comprehensive, multi-layer anatomical 3D models for every individual animal species are exceedingly rare and difficult to acquire under open licenses.
- **Decision**:
  - **Tier A (Featured Species)**: Custom/high-fidelity multi-layer models (skin, muscle, skeleton, organs) with standardized node names (`skin_*`, `muscle_*`, `bone_*`, `organ_*`).
  - **Tier B (Class/Order Representatives)**: Representative anatomical models (e.g., standard bony fish, anuran amphibian, bird, carnivore, herbivore) mapped to species of the same group with explicit UI disclaimer: *"Mô hình đại diện cho nhóm, không phải chính xác loài này"*.
  - **Tier C (Fallback / Media Gallery)**: High-resolution photographic galleries + 2D anatomical/silhouette diagrams with full textual biological data when no suitable 3D model exists.
  - Robust WebGL fallback: detects WebGL support and performance capability; falls back to 2D view and provides quality toggles (pixel ratio, shadows).

---

## ADR-004: Python 3.11+ for Data Pipeline & Node/Ajv for Schema Validation
- **Date**: 2026-10-22
- **Status**: Accepted
- **Context**: Need reliable data extraction pipeline from GBIF, Wikidata, Wikipedia, and trait databases, as well as fast CI data validation.
- **Decision**:
  - Pipeline scripts use Python 3.11 (`requests`, `tqdm`, caching to `.cache/`).
  - Schema validation script uses Node.js with `ajv` and `ajv-formats` for lightning-fast CI integration in `npm test` and `npm run validate-data`.
