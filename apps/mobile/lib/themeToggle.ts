import { createContext, useContext } from 'react';

/** Global context for toggling light/dark mode from anywhere */
export const ThemeToggleContext = createContext<() => void>(() => {});
export const useThemeToggle = () => useContext(ThemeToggleContext);
