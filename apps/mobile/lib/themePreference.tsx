import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

export type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

export function ThemePreferenceProvider({
  value,
  children,
}: {
  value: ThemePreferenceContextValue;
  children: ReactNode;
}) {
  return (
    <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>
  );
}

export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) throw new Error('useThemePreference must be used within ThemePreferenceProvider');
  return ctx;
}
