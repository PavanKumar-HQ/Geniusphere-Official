// ====================================================================
// Geniusphere Appearance & Theme Management Engine
// Supports 10 curated themes including Light, Dark, System, Sepia,
// High Contrast, OLED Dark, Midnight Blue, Monochrome, and Ocean.
// ====================================================================

export type ThemeId =
  | 'light'
  | 'dark'
  | 'system'
  | 'sepia'
  | 'high-contrast-light'
  | 'high-contrast-dark'
  | 'oled-dark'
  | 'midnight-blue'
  | 'monochrome'
  | 'ocean';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  subtitle: string;
  description: string;
  isDark: boolean;
  isHighContrast?: boolean;
  previewColors: {
    bg: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
  };
}

export const THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    id: 'light',
    name: 'Light (Default)',
    subtitle: 'Warm Ivory + Sage + Forest Green',
    description: 'Refined botanical palette inspired by natural ivory canvas and botanical flora.',
    isDark: false,
    previewColors: {
      bg: '#FAFAF4',
      surface: '#FFFFFF',
      primary: '#43A85B',
      accent: '#D9F477',
      text: '#26352A',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    subtitle: 'Charcoal + Deep Forest Green + Muted Lime',
    description: 'Sleek dark interface with deep charcoal tones and high-yield botanical accents.',
    isDark: true,
    previewColors: {
      bg: '#121914',
      surface: '#1B241E',
      primary: '#43A85B',
      accent: '#D9F477',
      text: '#F0FDF4',
    },
  },
  {
    id: 'system',
    name: 'System',
    subtitle: 'Automatically follows device appearance',
    description: 'Dynamically synchronizes with your operating system light/dark mode preference.',
    isDark: false,
    previewColors: {
      bg: '#E2E8F0',
      surface: '#FFFFFF',
      primary: '#43A85B',
      accent: '#10B981',
      text: '#0F172A',
    },
  },
  {
    id: 'sepia',
    name: 'Sepia',
    subtitle: 'Warm cream + parchment + olive',
    description: 'Gentle on eyes for long study sessions, reminiscent of academic manuscripts.',
    isDark: false,
    previewColors: {
      bg: '#FBF0D9',
      surface: '#FFF9ED',
      primary: '#687F3B',
      accent: '#D4DE85',
      text: '#332B1D',
    },
  },
  {
    id: 'high-contrast-light',
    name: 'High Contrast Light',
    subtitle: 'Bright background + strong dark text',
    description: 'Engineered for maximal visual accessibility and sharp contrast (WCAG AAA).',
    isDark: false,
    isHighContrast: true,
    previewColors: {
      bg: '#FFFFFF',
      surface: '#FFFFFF',
      primary: '#007A2B',
      accent: '#CCFF00',
      text: '#000000',
    },
  },
  {
    id: 'high-contrast-dark',
    name: 'High Contrast Dark',
    subtitle: 'Deep black background + bright text',
    description: 'Maximum contrast dark mode for visual accessibility with neon status indicators.',
    isDark: true,
    isHighContrast: true,
    previewColors: {
      bg: '#000000',
      surface: '#0A0A0A',
      primary: '#00FF66',
      accent: '#FFFF00',
      text: '#FFFFFF',
    },
  },
  {
    id: 'oled-dark',
    name: 'OLED Dark',
    subtitle: 'Pure black backgrounds for OLED displays',
    description: 'True pitch black `#000000` surfaces maximizing energy savings on OLED screens.',
    isDark: true,
    previewColors: {
      bg: '#000000',
      surface: '#0A0E0B',
      primary: '#10B981',
      accent: '#A7F3D0',
      text: '#F9FAFB',
    },
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    subtitle: 'Deep navy + cool blue accents',
    description: 'Deep celestial navy backgrounds with luminous electric cyan highlights.',
    isDark: true,
    previewColors: {
      bg: '#0A1128',
      surface: '#101F42',
      primary: '#38BDF8',
      accent: '#7DD3FC',
      text: '#F0F9FF',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    subtitle: 'Black, white, and grayscale',
    description: 'Distraction-free minimalist grayscale palette for pure technical focus.',
    isDark: false,
    previewColors: {
      bg: '#F8F9FA',
      surface: '#FFFFFF',
      primary: '#212529',
      accent: '#6C757D',
      text: '#212529',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    subtitle: 'Cool teal + deep blue + soft neutral backgrounds',
    description: 'Calming coastal palette with aquatic teals, deep blues, and crisp accents.',
    isDark: false,
    previewColors: {
      bg: '#F0FDF4',
      surface: '#FFFFFF',
      primary: '#0D9488',
      accent: '#5EEAD4',
      text: '#0F172A',
    },
  },
];

const STORAGE_KEY = 'geniusphere_theme_preference';

/**
 * Get stored theme ID or default to 'light'
 */
export function getStoredTheme(): ThemeId {
  try {
    const val = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (val && THEME_DEFINITIONS.some((t) => t.id === val)) {
      return val;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  return 'light';
}

/**
 * Apply selected theme to documentElement
 */
export function applyTheme(themeId: ThemeId): void {
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch (e) {
    // Ignore localStorage errors
  }

  const root = document.documentElement;

  if (themeId === 'system') {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    root.setAttribute('data-theme-setting', 'system');
  } else {
    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-theme-setting', themeId);
  }
}

/**
 * Initialize theme listener for system theme changes and on startup
 */
export function initThemeEngine(): () => void {
  const current = getStoredTheme();
  applyTheme(current);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemChange = () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system');
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleSystemChange);
  } else if ((mediaQuery as any).addListener) {
    (mediaQuery as any).addListener(handleSystemChange);
  }

  return () => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleSystemChange);
    } else if ((mediaQuery as any).removeListener) {
      (mediaQuery as any).removeListener(handleSystemChange);
    }
  };
}
