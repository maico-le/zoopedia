import { LocalizedString } from './species';

export interface AnatomyLayer {
  id: string;
  name: LocalizedString;
  default?: boolean;
}

export interface AnatomyPart {
  node: string;
  layer: string;
  name: {
    vi: string;
    en: string;
    latin?: string;
  };
  function?: LocalizedString | null;
  description?: LocalizedString | null;
  explodeVector?: [number, number, number];
  labelAnchor?: [number, number, number];
  relatedParts?: string[];
}

export interface AnatomyData {
  model: string;
  layers: AnatomyLayer[];
  parts: AnatomyPart[];
}
