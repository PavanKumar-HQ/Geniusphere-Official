
export enum PlatformPurpose {
  LEARNING = 'Learning',
  CREATIVITY = 'Creativity',
  NETWORKING = 'Networking',
  NONE = 'Random'
}

export enum StepStatus {
  PROFESSIONAL = 'PROFESSIONAL_IMPRESSION',
  NEGATIVE = 'NEGATIVE_SIGNAL',
  UPDATED = 'DIGITAL_FOOTPRINT_UPDATED',
  READY = 'RESPONSIBLE_PROFILE_READY'
}

export interface ProfileData {
  purpose: PlatformPurpose;
  photo: string | null;
  bio: string;
  skills: string[];
  posts: string[];
  interactions: string[];
  privacyPrivate: boolean;
  score: {
    professionalism: number;
    safety: number;
    authenticity: number;
    growthPotential: number;
  };
}

export interface SimulationStep {
  id: number;
  title: string;
  description: string;
  lesson: string;
  statusLabel?: StepStatus;
}
