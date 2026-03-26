/**
 * Stitch comp–inspired tokens for the home screen (React Native, not Tailwind).
 * Font family strings must match keys passed to useFonts in app/_layout.tsx.
 */

export const homeFonts = {
  sans: 'Manrope_400Regular',
  sansMedium: 'Manrope_600SemiBold',
  sansBold: 'Manrope_700Bold',
  serif: 'Newsreader_400Regular',
  serifItalic: 'Newsreader_400Regular_Italic',
  serifBold: 'Newsreader_700Bold',
} as const;

export const homeColors = {
  background: '#fbf8ff',
  surface: '#ffffff',
  surfaceContainer: '#eeecfb',
  surfaceContainerHigh: '#e9e6f5',
  primary: '#00685d',
  primaryContainer: '#008376',
  primaryFixed: '#b8f0e8',
  onPrimary: '#ffffff',
  onSurface: '#1a1b25',
  onSurfaceVariant: '#3d4947',
  outline: '#bdc9c6',
  secondary: '#5e3fd4',
  onSecondary: '#ffffff',
  secondaryContainer: '#775bef',
  onSecondaryContainer: '#fffbff',
  tertiary: '#6d5e00',
  accent: '#c3ab2e',
  heroBar: '#0b3d38',
  muted: '#6d7a77',
} as const;

export const homeRadii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;
