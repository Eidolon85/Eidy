export interface ImageAsset {
  id: string;
  url: string;
  isPreset?: boolean;
}

export enum AppStep {
  SELECT_PERSON = 1,
  SELECT_CLOTHES = 2,
  RESULT = 3,
}

export interface GenerationHistoryItem {
  id: string;
  personUrl: string;
  clothesUrl: string;
  resultUrl: string;
  timestamp: number;
}
