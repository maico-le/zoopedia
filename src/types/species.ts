export type IucnStatus = 'EX' | 'EW' | 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD' | 'NE';

export interface LocalizedString {
  vi: string;
  en: string;
}

export interface TaxonKey {
  gbif?: number | null;
  col?: string | null;
  wikidata?: string | null;
  inaturalist?: number | null;
  eol?: number | string | null;
  [key: string]: unknown;
}

export interface SpeciesNames {
  scientific: string;
  authorship?: string | null;
  en: string[];
  vi: string[];
  otherLocal?: Record<string, string[]>;
  nameSource?: {
    vi?: 'wikidata' | 'inat' | 'wikipedia-vi' | 'gbif' | 'manual' | 'machine_translated';
    en?: string;
    [key: string]: string | undefined;
  };
}

export interface SpeciesTaxonomy {
  kingdom: string;
  phylum: string;
  class: string;
  order: string;
  family: string;
  genus: string;
  subspecies?: string[];
}

export interface SpeciesMorphology {
  lengthCm?: number[] | null;
  weightKg?: number[] | null;
  description?: {
    vi?: string | null;
    en?: string | null;
  } | null;
  sexualDimorphism?: string | null;
}

export interface SpeciesHabitat {
  biomes?: string[];
  realm?: string[];
  description?: {
    vi?: string | null;
    en?: string | null;
  } | null;
}

export interface SpeciesDistribution {
  countries?: string[];
  text?: {
    vi?: string | null;
    en?: string | null;
  } | null;
  gbifOccurrenceMapUrl?: string | null;
}

export interface SpeciesDiet {
  type?: 'carnivore' | 'herbivore' | 'omnivore' | 'insectivore' | 'piscivore' | 'frugivore' | 'detritivore' | 'filter_feeder' | 'other' | null;
  preyOrFood?: string[];
  feedingBehavior?: {
    vi?: string | null;
    en?: string | null;
  } | null;
}

export interface SpeciesBehavior {
  activityPattern?: 'diurnal' | 'nocturnal' | 'crepuscular' | 'cathemeral' | null;
  social?: 'solitary' | 'pairs' | 'gregarious' | 'eusocial' | 'colonial' | null;
  communication?: { vi?: string | null; en?: string | null } | null;
  migration?: { vi?: string | null; en?: string | null } | null;
  defense?: { vi?: string | null; en?: string | null } | null;
  text?: { vi?: string | null; en?: string | null } | null;
}

export interface LifeStage {
  key: string;
  name: LocalizedString;
  description?: { vi?: string | null; en?: string | null } | null;
  durationDays?: number[] | null;
}

export interface SpeciesLifeCycle {
  stages?: LifeStage[];
  lifespanYears?: {
    wild?: number[] | null;
    captivity?: number[] | null;
  } | null;
}

export interface SpeciesReproduction {
  mode?: 'viviparous' | 'oviparous' | 'ovoviviparous' | 'asexual' | null;
  matingSystem?: string | null;
  season?: string | null;
  gestationDays?: number[] | null;
  clutchOrLitterSize?: number[] | null;
  parentalCare?: { vi?: string | null; en?: string | null } | null;
  text?: { vi?: string | null; en?: string | null } | null;
}

export interface SpeciesConservation {
  iucn?: IucnStatus | null;
  populationTrend?: 'increasing' | 'decreasing' | 'stable' | 'unknown' | null;
  threats?: string[];
  assessmentYear?: number | null;
}

export interface SpeciesEcology {
  predators?: string[];
  symbiosis?: string[];
  ecosystemRole?: { vi?: string | null; en?: string | null } | null;
}

export interface SpeciesHumanRelations {
  uses?: string[];
  conflicts?: string[];
  culturalNotes?: { vi?: string | null; en?: string | null } | null;
}

export interface FunFact {
  vi: string;
  en: string;
}

export interface Model3DMetadata {
  glb: string;
  anatomy?: string | null;
  license: string;
  author?: string | null;
  sourceUrl: string;
  tier?: 'A' | 'B' | 'C';
  isRepresentative?: boolean;
  representativeFor?: string | null;
}

export interface SpeciesImage {
  url: string;
  license: string;
  author?: string | null;
  sourceUrl: string;
  caption?: { vi: string; en: string } | null;
}

export interface SpeciesMedia {
  model3d?: Model3DMetadata | null;
  images?: SpeciesImage[];
  silhouette?: {
    svg: string;
    license: string;
    sourceUrl?: string | null;
  } | null;
}

export interface ProvenanceRecord {
  field: string;
  source: string;
  url?: string | null;
  license: string;
  retrievedAt: string;
  method: 'extracted' | 'curated' | 'llm_summarized' | 'machine_translated' | 'database_import';
  needsReview?: boolean;
}

export interface Species {
  id: string;
  taxonKey?: TaxonKey;
  names: SpeciesNames;
  taxonomy: SpeciesTaxonomy;
  morphology?: SpeciesMorphology | null;
  habitat?: SpeciesHabitat | null;
  distribution?: SpeciesDistribution | null;
  diet?: SpeciesDiet | null;
  behavior?: SpeciesBehavior | null;
  lifeCycle?: SpeciesLifeCycle | null;
  reproduction?: SpeciesReproduction | null;
  conservation?: SpeciesConservation | null;
  ecology?: SpeciesEcology | null;
  humanRelations?: SpeciesHumanRelations | null;
  funFacts?: FunFact[];
  media: SpeciesMedia;
  provenance: ProvenanceRecord[];
}
