
export enum LabStep {
  ACTIVATION = 1,
  DATA_COLLECTION = 2,
  CONNECTIVITY = 3,
  CLOUD_PROCESSING = 4,
  AUTOMATION = 5,
  SMART_HOME = 6,
  SECURITY_RISK = 7,
  SECURITY_DEFENSE = 8
}

export interface StepInfo {
  id: LabStep;
  title: string;
  description: string;
  statusText?: string;
  statusColor?: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'gateway';
  status: 'idle' | 'active' | 'transmitting' | 'risk' | 'secured';
}
