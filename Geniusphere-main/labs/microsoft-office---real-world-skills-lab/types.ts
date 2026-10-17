
export enum OfficeApp {
  WORD = 'Word',
  EXCEL = 'Excel',
  POWERPOINT = 'PowerPoint',
  OUTLOOK = 'Outlook',
  REAL_LIFE = 'Real Life',
  MISTAKES = 'Common Mistakes',
  TIPS = 'Productivity Tips'
}

export interface Step {
  id: number;
  title: string;
  description: string;
  statusText: string;
}

export interface ModuleData {
  app: OfficeApp;
  color: string;
  steps: Step[];
}
