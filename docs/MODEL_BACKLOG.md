# 3D Model & Anatomy Backlog (MODEL_BACKLOG.md)

This backlog tracks the status of 3D models for each species, categorizing them into Tier A, Tier B, or Tier C, and recording anatomical layer completeness.

---

## Model Tiers Overview
- **Tier A (Featured Custom Anatomy)**: Dedicated mesh with multi-layer anatomy (`skin_*`, `muscle_*`, `bone_*`, `organ_*`).
- **Tier B (Representative Group Template)**: Group archetype model (e.g. standard mammal, avian skeleton, teleost fish) mapped to related species with explicit UI indicator.
- **Tier C (2D Fallback)**: Photographic gallery, anatomical diagrams, and silhouette when no verified 3D model is available.

---

## Target Featured Species (Milestone M1 & M5 Candidates)

| Species Slug | Common Name (VI) | Common Name (EN) | Phylum / Class | Planned Tier | Status | Source / Notes |
|---|---|---|---|---|---|---|
| `panthera-tigris` | Hổ Đông Dương / Hổ | Bengal/Indochinese Tiger | Chordata / Mammalia | Tier A | Initial Seed | Low-poly sample + skeletal/organ map |
| `homo-sapiens` / `canis-lupus` | Chó sói xám | Gray Wolf | Chordata / Mammalia | Tier A | Planned | Smithsonian / Sketchfab CC-BY |
| `gallus-gallus` | Gà rừng / Gà nhà | Red Junglefowl / Chicken | Chordata / Aves | Tier A | Planned | Avian anatomy template |
| `salmo-salar` | Cá hồi Đại Tây Dương | Atlantic Salmon | Chordata / Actinopterygii | Tier A / B | Planned | Osteichthyes morphology |
| `rana-temporaria` | Ếch đồng / Ếch cỏ | Common Frog | Chordata / Amphibia | Tier A / B | Planned | Anuran anatomy |
| `danaus-plexippus` | Bướm vua | Monarch Butterfly | Arthropoda / Insecta | Tier B | Planned | Arthropod exoskeleton |
| `octopus-vulgaris` | Bạch tuộc thông thường | Common Octopus | Mollusca / Cephalopoda | Tier B | Planned | Cephalopod morphology |
| `asterias-rubens` | Sao biển thông thường | Common Starfish | Echinodermata / Asteroidea | Tier B | Planned | Radial symmetry template |

---

## Model Processing Guidelines
1. Verify license (CC0 or CC-BY only).
2. Run `scripts/models/inspect-glb.cjs` to inspect mesh hierarchy and node names.
3. Standardize node names to `skin_*`, `muscle_*`, `bone_*`, `organ_*`.
4. Optimize mesh with `gltf-transform`:
   - Deduplicate geometries & accessors
   - Prune unused nodes & textures
   - Weld vertices
   - Draco / meshopt compression (target GLB ≤ 3MB - 5MB max)
5. Generate corresponding `public/anatomy/<slug>.json` map.
