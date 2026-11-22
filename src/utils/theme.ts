export type ThemeMode = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'deepscript_theme';
export const LEGACY_THEME_STORAGE_KEY = 'theme';
export const THEME_EVENT_NAME = 'deepscript_theme_changed';

/**
 * Retrieves the currently saved theme from browser storage.
 * Defaults to 'dark' if nothing has been saved yet.
 */
export function getSavedTheme(): ThemeMode {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 'dark';
    }
    const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch (_e) {
    // Fallback if localStorage access is blocked
  }
  return 'dark';
}

/**
 * Synchronously applies the given theme mode across the document (documentElement and body),
 * updates data attributes and colorScheme, writes to localStorage, and emits an event.
 */
export function applyTheme(mode: ThemeMode): void {
  try {
    const isLight = mode === 'light';

    if (typeof document !== 'undefined') {
      // 1. Root <html> element
      if (document.documentElement) {
        document.documentElement.classList.toggle('light-theme', isLight);
        document.documentElement.setAttribute('data-theme', mode);
        document.documentElement.style.colorScheme = mode;
      }

      // 2. <body> element
      if (document.body) {
        document.body.classList.toggle('light-theme', isLight);
        document.body.setAttribute('data-theme', mode);
        document.body.style.colorScheme = mode;
      }
    }

    // 3. Persist to storage across both keys for maximum resilience
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
      localStorage.setItem(LEGACY_THEME_STORAGE_KEY, mode);
    }

    // 4. Dispatch custom event for cross-component sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(THEME_EVENT_NAME, { detail: mode }));
    }
  } catch (_err) {
    console.warn('DeepScript: Could not apply theme to DOM or localStorage:', _err);
  }
}

/**
 * Toggles or sets theme explicitly.
 */
export function toggleTheme(targetMode?: ThemeMode): ThemeMode {
  const current = getSavedTheme();
  const nextMode: ThemeMode = targetMode || (current === 'dark' ? 'light' : 'dark');
  applyTheme(nextMode);
  return nextMode;
}
