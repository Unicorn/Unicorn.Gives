/**
 * UNI-Gives Design System Tokens
 *
 * Color roles:
 *   primary (green-teal) — interactive elements: buttons, links, checkboxes, radio, sliders
 *   gold — feature/status taxonomy chips: "Featured", "New", "Filling Up Fast"
 *   purple — date taxonomy chips: "Monday", "Oct 12", "This Weekend"
 *   neutral — all other text, headers, backgrounds
 *
 * Each palette is a monochromatic scale where 900 is the darkest anchor.
 * See DESIGN_SYSTEM.md at the project root for full rules.
 */

import { useColorScheme, Platform } from 'react-native';
import { createContext, useContext } from 'react';

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

export const fonts = {
  sans: 'Manrope_400Regular',
  sansMedium: 'Manrope_600SemiBold',
  sansBold: 'Manrope_700Bold',
  serif: 'Newsreader_400Regular',
  serifItalic: 'Newsreader_400Regular_Italic',
  serifBold: 'Newsreader_700Bold',
} as const;

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ---------------------------------------------------------------------------
// Radii
// ---------------------------------------------------------------------------

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

// ---------------------------------------------------------------------------
// Shadows
// ---------------------------------------------------------------------------

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
  }),
  button: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
  }),
} as const;

// ---------------------------------------------------------------------------
// Monochromatic Palettes
// ---------------------------------------------------------------------------
// 900 = darkest anchor value provided by design.
// Lighter steps are generated as tints toward white.

export const teal = {
  50:  '#e6f5f3',
  100: '#b3e3dd',
  200: '#80d0c8',
  300: '#4dbeb2',
  400: '#26b0a1',
  500: '#0a9f90',
  600: '#089285',
  700: '#078276',
  800: '#07877a', // anchor — also used as 800 for more usable mid-range
  900: '#045a52',
} as const;

export const gray = {
  50:  '#f0f0f2',
  100: '#d5d5d9',
  200: '#babac1',
  300: '#9f9fa8',
  400: '#8b8b96',
  500: '#787884',
  600: '#6a6a76',
  700: '#595964',
  800: '#4e4e5a', // anchor
  900: '#35353e',
} as const;

export const purple = {
  50:  '#f1edff',
  100: '#d6ccff',
  200: '#baabff',
  300: '#9e8aff',
  400: '#866bff', // anchor at 400 since it's a vibrant mid-tone
  500: '#7455f5',
  600: '#6344e0',
  700: '#5234c4',
  800: '#4125a8',
  900: '#2d1878',
} as const;

export const gold = {
  50:  '#fdf8e6',
  100: '#f8edb3',
  200: '#f3e180',
  300: '#eed64d',
  400: '#eacd26',
  500: '#d6bd3f', // anchor at 500 — it's a vivid mid-tone
  600: '#c1a82e',
  700: '#a58f1f',
  800: '#897614',
  900: '#5e500a',
} as const;

// ---------------------------------------------------------------------------
// Semantic color palettes (light / dark)
// ---------------------------------------------------------------------------

const lightColors = {
  // Primary (teal) — interactive elements only
  primary:              teal[900],
  primaryContainer:     teal[50],
  onPrimary:            '#ffffff',
  onPrimaryContainer:   teal[900],

  // Gold — feature/status taxonomy chips only
  gold:                 gold[800],
  goldContainer:        gold[50],
  onGold:               '#ffffff',

  // Purple — date taxonomy chips only
  purple:               purple[700],
  purpleContainer:      purple[50],
  onPurple:             '#ffffff',

  // Neutral — text, headers, general UI
  neutral:              gray[800],
  neutralVariant:       gray[600],
  onNeutral:            '#ffffff',

  // Surfaces
  surface:              '#ffffff',
  surfaceContainer:     gray[50],
  surfaceContainerHigh: gray[100],
  background:           gray[100],

  // Utility
  outline:              gray[200],
  outlineVariant:       gray[100],
  error:                '#dc2626',
  onError:              '#ffffff',
  errorContainer:       '#fef2f2',

  // Special
  heroBar:              gray[800],
  onHeroBar:            gray[50],
} as const;

const darkColors = {
  // Primary (teal)
  primary:              teal[300],
  primaryContainer:     teal[900],
  onPrimary:            teal[900],
  onPrimaryContainer:   teal[100],

  // Gold
  gold:                 gold[300],
  goldContainer:        gold[900],
  onGold:               gold[900],

  // Purple
  purple:               purple[200],
  purpleContainer:      purple[900],
  onPurple:             purple[900],

  // Neutral
  neutral:              gray[100],
  neutralVariant:       gray[400],
  onNeutral:            gray[800],

  // Surfaces
  surface:              gray[900],
  surfaceContainer:     gray[800],
  surfaceContainerHigh: gray[700],
  background:           gray[600],

  // Utility
  outline:              gray[600],
  outlineVariant:       gray[700],
  error:                '#f87171',
  onError:              gray[900],
  errorContainer:       '#451a1a',

  // Special
  heroBar:              gray[800],
  onHeroBar:            gray[50],
} as const;

export type ThemeColors = { [K in keyof typeof lightColors]: string };

// ---------------------------------------------------------------------------
// Typography presets
// ---------------------------------------------------------------------------

export function buildTypography(colors: ThemeColors) {
  return {
    display: {
      fontFamily: fonts.serifBold,
      fontSize: 30,
      lineHeight: 36,
      color: colors.neutral,
    },
    headline: {
      fontFamily: fonts.serifItalic,
      fontSize: 24,
      lineHeight: 30,
      color: colors.neutral,
    },
    title: {
      fontFamily: fonts.sansBold,
      fontSize: 18,
      lineHeight: 24,
      color: colors.neutral,
    },
    subtitle: {
      fontFamily: fonts.sansMedium,
      fontSize: 15,
      lineHeight: 20,
      color: colors.neutral,
    },
    body: {
      fontFamily: fonts.sans,
      fontSize: 14,
      lineHeight: 21,
      color: colors.neutral,
    },
    caption: {
      fontFamily: fonts.sans,
      fontSize: 12,
      lineHeight: 16,
      color: colors.neutralVariant,
    },
    eyebrow: {
      fontFamily: fonts.sansBold,
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as const,
      color: colors.neutralVariant,
    },
  } as const;
}

// ---------------------------------------------------------------------------
// Chip presets
// ---------------------------------------------------------------------------

export function buildChipTokens(colors: ThemeColors) {
  return {
    /** Feature/status taxonomy — "Featured", "New", "Filling Up Fast" */
    gold: {
      backgroundColor: colors.goldContainer,
      borderColor: colors.gold,
      color: colors.gold,
    },
    /** Date taxonomy — "Monday", "Oct 12", "This Weekend" */
    purple: {
      backgroundColor: colors.purpleContainer,
      borderColor: colors.purple,
      color: colors.purple,
    },
    /** Category filter (inactive) */
    filterInactive: {
      backgroundColor: colors.surface,
      borderColor: colors.outline,
      color: colors.neutralVariant,
    },
    /** Category filter (active) */
    filterActive: {
      backgroundColor: colors.heroBar,
      borderColor: colors.heroBar,
      color: colors.onHeroBar,
    },
  } as const;
}

// ---------------------------------------------------------------------------
// Theme override context (for styleguide local toggle)
// ---------------------------------------------------------------------------

export const ThemeOverrideContext = createContext<'light' | 'dark' | null>(null);

// ---------------------------------------------------------------------------
// useTheme hook
// ---------------------------------------------------------------------------

export function useTheme() {
  const systemScheme = useColorScheme();
  const override = useContext(ThemeOverrideContext);
  const scheme = override ?? systemScheme;
  const isDark = scheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  return {
    isDark,
    colors,
    fonts,
    spacing,
    radii,
    typography: buildTypography(colors),
    chips: buildChipTokens(colors),
  };
}

/** For static contexts where hooks can't be used */
export { lightColors, darkColors };
