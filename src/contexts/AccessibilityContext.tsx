'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type FontSize = 'sm' | 'md' | 'lg' | 'xl';
type Zoom = 'normal' | 'lg' | 'xl' | 'xxl';

interface AccessibilityState {
  theme: Theme;
  fontSize: FontSize;
  zoom: Zoom;
  highContrast: boolean;
  reduceMotion: boolean;
  highlightLinks: boolean;
}

interface AccessibilityContextType extends AccessibilityState {
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setZoom: (zoom: Zoom) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleHighlightLinks: () => void;
  reset: () => void;
}

const DEFAULT_STATE: AccessibilityState = {
  theme: 'dark',
  fontSize: 'md',
  zoom: 'normal',
  highContrast: false,
  reduceMotion: false,
  highlightLinks: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const STORAGE_KEY = 'santiago-a11y-preferences';

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccessibilityState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...DEFAULT_STATE, ...parsed });
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }

    const root = document.documentElement;

    root.classList.toggle('light', state.theme === 'light');
    root.classList.toggle('dark', state.theme === 'dark');
    root.setAttribute('data-font-size', state.fontSize);
    root.setAttribute('data-zoom', state.zoom);
    root.classList.toggle('high-contrast', state.highContrast);
    root.classList.toggle('reduce-motion', state.reduceMotion);
    root.classList.toggle('highlight-links', state.highlightLinks);
  }, [state, hydrated]);

  const setTheme = (theme: Theme) => setState((s) => ({ ...s, theme }));
  const setFontSize = (fontSize: FontSize) => setState((s) => ({ ...s, fontSize }));
  const setZoom = (zoom: Zoom) => setState((s) => ({ ...s, zoom }));
  const toggleHighContrast = () => setState((s) => ({ ...s, highContrast: !s.highContrast }));
  const toggleReduceMotion = () => setState((s) => ({ ...s, reduceMotion: !s.reduceMotion }));
  const toggleHighlightLinks = () =>
    setState((s) => ({ ...s, highlightLinks: !s.highlightLinks }));

  const reset = () => setState(DEFAULT_STATE);

  return (
    <AccessibilityContext.Provider
      value={{
        ...state,
        setTheme,
        setFontSize,
        setZoom,
        toggleHighContrast,
        toggleReduceMotion,
        toggleHighlightLinks,
        reset,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe usarse dentro de AccessibilityProvider');
  }
  return context;
}