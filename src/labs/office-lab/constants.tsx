
import { OfficeApp, ModuleData } from './types';

export const COLORS = {
  WORD: '#2B7FFF',
  EXCEL: '#00C853',
  POWERPOINT: '#FF9800',
  OUTLOOK: '#7C6BFF',
  SUCCESS: '#00FFA3',
  WARNING: '#FF4D4D',
  TEXT: '#E6E9F0',
  BG: '#070B1A'
};

export const MODULE_CONTENT: Record<string, ModuleData> = {
  [OfficeApp.WORD]: {
    app: OfficeApp.WORD,
    color: COLORS.WORD,
    steps: [
      { id: 1, title: 'NEW DOCUMENT', description: 'Start with a clean slate. Microsoft Word is the global standard for professional documents.', statusText: 'INITIALIZING_DOC' },
      { id: 2, title: 'FORMATTING', description: 'Use Headings and Styles. Formatting makes content readable, searchable, and professional.', statusText: 'STYLING_APPLIED' },
      { id: 3, title: 'SAVE & SHARE', description: 'Stop using USBs. Cloud storage (OneDrive) allows you to access and edit files anywhere safely.', statusText: 'DOCUMENT_READY' }
    ]
  },
  [OfficeApp.EXCEL]: {
    app: OfficeApp.EXCEL,
    color: COLORS.EXCEL,
    steps: [
      { id: 1, title: 'DATA ENTRY', description: 'Organize first. Excel uses rows and columns to turn messy numbers into structured information.', statusText: 'DATA_IMPORTED' },
      { id: 2, title: 'FORMULA POWER', description: 'Never calculate manually. Use formulas like =SUM() or =AVERAGE() to automate your work.', statusText: 'CALCULATION_COMPLETE' },
      { id: 3, title: 'CHART CREATION', description: 'Visualize your success. Transform raw data into charts to tell a story that people actually understand.', statusText: 'DATA_ANALYZED' }
    ]
  },
  [OfficeApp.POWERPOINT]: {
    app: OfficeApp.POWERPOINT,
    color: COLORS.POWERPOINT,
    steps: [
      { id: 1, title: 'SLIDE CREATION', description: 'One slide, one idea. PowerPoint is a visual aid, not a teleprompter for you to read from.', statusText: 'LAYOUT_STRUCTURED' },
      { id: 2, title: 'DESIGN & VISUALS', description: 'Engage your audience. High-quality images and consistent themes keep people looking at the screen.', statusText: 'VISUALS_OPTIMIZED' },
      { id: 3, title: 'PRESENT MODE', description: 'Showtime. Present mode transforms your slides into a professional, distraction-free experience.', statusText: 'PRESENTATION_READY' }
    ]
  },
  [OfficeApp.OUTLOOK]: {
    app: OfficeApp.OUTLOOK,
    color: COLORS.OUTLOOK,
    steps: [
      { id: 1, title: 'COMPOSE EMAIL', description: 'Be professional. A clear subject line and polite greeting are essential for business communication.', statusText: 'MESSAGE_DRAFTED' },
      { id: 2, title: 'ATTACHMENTS', description: 'Bridge the tools. Attach your Word or Excel files directly from the cloud for easy collaboration.', statusText: 'ASSETS_ATTACHED' },
      { id: 3, title: 'SEND & FOLLOW', description: 'Delivery confirmed. Outlook tracks your communication so you never miss a deadline.', statusText: 'EMAIL_SENT' }
    ]
  },
  [OfficeApp.REAL_LIFE]: {
    app: OfficeApp.REAL_LIFE,
    color: '#FFFFFF',
    steps: [
      { id: 1, title: 'THE WORKFLOW', description: 'Modern productivity is a loop: Write (Word), Analyze (Excel), Present (PPT), and Share (Outlook).', statusText: 'ECOSYSTEM_CONNECTED' }
    ]
  },
  [OfficeApp.MISTAKES]: {
    app: OfficeApp.MISTAKES,
    color: COLORS.WARNING,
    steps: [
      { id: 1, title: 'MISTAKE #1: UNNAMED FILES', description: 'Naming a file "document1" makes it impossible to find later. Always use descriptive names.', statusText: 'ORGANIZATION_ERROR' },
      { id: 2, title: 'MISTAKE #2: WALLS OF TEXT', description: 'People don\'t read walls of text. Use bullet points and bold keywords to highlight main ideas.', statusText: 'READABILITY_FAIL' },
      { id: 3, title: 'MISTAKE #3: NO BACKUP', description: 'Saving only to your computer is risky. Hardware fails; always use cloud syncing.', statusText: 'RISK_DETECTED' }
    ]
  },
  [OfficeApp.TIPS]: {
    app: OfficeApp.TIPS,
    color: '#FFD700',
    steps: [
      { id: 1, title: 'PRO TIP: SHORTCUTS', description: 'Master Ctrl+S (Save), Ctrl+Z (Undo), and Ctrl+K (Hyperlink) to save hours every week.', statusText: 'SPEED_OPTIMIZED' },
      { id: 2, title: 'PRO TIP: TEMPLATES', description: 'Don\'t reinvent the wheel. Use built-in templates to get a professional design in seconds.', statusText: 'EFFICIENCY_UP' },
      { id: 3, title: 'PRO TIP: COLLABORATE', description: 'Share a link instead of an attachment. This lets multiple people edit the same file at once.', statusText: 'TEAM_MODE_ON' }
    ]
  }
};

export const BEST_PRACTICES = [
  'Save work regularly (Ctrl+S)',
  'Use clear, searchable file names',
  'Master the "Undo" command (Ctrl+Z)',
  'Keep slides visually light',
  'Double-check email recipients'
];

export const DID_YOU_KNOW = [
  'Microsoft Office skills are required in almost every career.',
  'Over 1.2 billion people use Office worldwide.',
  'Excel can handle over 1 million rows of data!',
  'The cloud lets you edit on your phone and finish on PC.'
];
