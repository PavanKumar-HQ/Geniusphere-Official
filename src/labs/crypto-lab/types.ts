
export interface Step {
  id: number;
  title: string;
  description: string;
  status?: string;
}

export enum SimulationState {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  RESET = 'RESET'
}
