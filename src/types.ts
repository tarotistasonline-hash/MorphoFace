export interface ZoneAnalysis {
  score: number;
  interpretation: string;
}

export interface FeatureAnalysis {
  style: string;
  interpretation: string;
}

export interface Landmark {
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface MorphoReport {
  faceShape: string;
  overallType: string; // "Dilatado", "Concentrado", "Mixto"
  temperament: string; // Sanguine, Phlegmatic, Choleric, Melancholic
  zones: {
    intellectual: ZoneAnalysis;
    emotional: ZoneAnalysis;
    instinctive: ZoneAnalysis;
  };
  features: {
    eyes: FeatureAnalysis;
    nose: FeatureAnalysis;
    mouthAndJaw: FeatureAnalysis;
  };
  landmarks: Landmark[];
  strengths: string[];
  growthAreas: string[];
  pastIns: string;
  presentIns: string;
  futureIns: string;
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'other';
  imagePlaceholder: string; // SVG seed or stylized color/shape representation
  mockResult: MorphoReport;
}

export interface AnalyzeRequest {
  image?: string; // base64 encoded image
  profileId?: string; // if using a demo profile
}

export interface AnalyzeResponse {
  success: boolean;
  error?: string;
  report?: MorphoReport;
}
