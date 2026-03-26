# UNI-Gives — Claude Code Rules

## Project

Expo Router React Native app (monorepo at `apps/mobile/`). File-based routing, custom StyleSheet styling (no Tailwind/NativeWind), TypeScript strict mode.

## Design System

**Read `DESIGN_SYSTEM.md` before creating or modifying any UI component.**

Token file: `apps/mobile/constants/theme.ts`

### Key rules

- Always use `useTheme()` hook for colors, fonts, spacing, radii — never hardcode hex values
- **Primary (teal 800)** — buttons, links, checkboxes, radios, sliders, toggles, focus rings
- **Gold** — feature/status taxonomy chips only ("Featured", "New", "Filling Up Fast")
- **Purple** — date taxonomy chips only ("Monday", "Oct 12")
- **Gray/neutral** — everything else: text, headings, borders, backgrounds, header bars
- Chip pattern: `{color}Container` bg, 1px `{color}` border, `{color}` text
- Event card date boxes: transparent bg, neutral border, neutral text (no fill)
- `heroBar` = `gray[800]` — used for active category filters and nav bars
- Never import from `constants/homeTheme.ts` or `constants/Colors.ts` — these are deprecated
- Use `fonts.*` tokens, not inline font family strings
- Use `spacing.*` and `radii.*` tokens, not arbitrary pixel values

### Anti-patterns

- Never use primary teal for taxonomy chips
- Never use gold or purple for buttons or interactive elements
- Never use more than neutral + one accent per card
- Never hardcode colors — always reference theme tokens
