
export enum SimulationStep {
  USER_ONLINE = 1,
  FOOTPRINT_CREATED = 2,
  ACTIVE_VS_PASSIVE = 3,
  DATA_TRACKING = 4,
  PERMISSIONS = 5,
  PRIVACY_RISK = 6,
  DATA_MISUSE = 7,
  DEFENSE_ACTIVATION = 8
}

export interface Topic {
  id: SimulationStep;
  label: string;
}

export interface LabState {
  currentStep: SimulationStep;
  isPlaying: boolean;
  isSimplified: boolean;
}
