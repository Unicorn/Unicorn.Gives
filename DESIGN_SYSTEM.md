# UNI-Gives Design System Rules

These rules govern all UI work in the project. Follow them when creating or modifying components.

Token file: `apps/mobile/constants/theme.ts`

---

## Monochromatic Palettes

Each color family has a 50–900 scale. The 900 value is the darkest anchor.

### Teal (Primary) — anchor `#07877a`
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#e6f5f3` | `#b3e3dd` | `#80d0c8` | `#4dbeb2` | `#26b0a1` | `#0a9f90` | `#089285` | `#078276` | `#07877a` | `#045a52` |

### Gray (Neutral) — anchor `#4e4e5a`
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#f0f0f2` | `#d5d5d9` | `#babac1` | `#9f9fa8` | `#8b8b96` | `#787884` | `#6a6a76` | `#595964` | `#4e4e5a` | `#35353e` |

### Purple (Date Taxonomy) — anchor `#866bff`
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#f1edff` | `#d6ccff` | `#baabff` | `#9e8aff` | `#866bff` | `#7455f5` | `#6344e0` | `#5234c4` | `#4125a8` | `#2d1878` |

### Gold (Feature Taxonomy) — anchor `#d6bd3f`
| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| `#fdf8e6` | `#f8edb3` | `#f3e180` | `#eed64d` | `#eacd26` | `#d6bd3f` | `#c1a82e` | `#a58f1f` | `#897614` | `#5e500a` |

---

## Color Roles

### Primary (Green-Teal)
- **Use for:** Buttons, text links, checkbox fill, radio fill, range slider track, toggle on-state, active tab/nav indicators, focus rings
- **Never use for:** Taxonomy chips, backgrounds, decorative elements

### Gold
- **Use for:** Feature/status taxonomy chips exclusively — labels like "Featured", "New", "Filling Up Fast", "Limited", "Popular"
- **Chip style:** `goldContainer` background, 1px `gold` border, `gold` text. In dark mode the container and text colors invert automatically via the dark palette.
- **Never use for:** Buttons, links, headings, or any interactive element

### Purple
- **Use for:** Date-oriented taxonomy chips exclusively — labels like "Monday", "October 12", "This Weekend", "Ends Soon"
- **Chip style:** `purpleContainer` background, 1px `purple` border, `purple` text. Dark mode inverts via palette.
- **Never use for:** Buttons, links, headings, or any interactive element

### Neutral (Gray)
- **Use for:** Body text, headings, header backgrounds, card borders, dividers, muted/secondary text
- **This is the default.** When in doubt, use neutral tones.

### Error (Red)
- **Use for:** Validation errors, destructive action buttons, error states

---

## Chip Styling Rules

All taxonomy chips follow the same structural pattern:

```
paddingHorizontal: 10
paddingVertical:   4
borderRadius:      radii.pill (999)
borderWidth:       1
```

| Chip Type | Background | Border | Text | When to Use |
|-----------|------------|--------|------|-------------|
| Gold | `goldContainer` | `gold` | `gold` | Feature/status labels |
| Purple | `purpleContainer` | `purple` | `purple` | Date/time labels |
| Filter (inactive) | `surface` | `outline` | `neutralVariant` | Category filter chips |
| Filter (active) | `heroBar` | `heroBar` | `onHeroBar` | Selected category filter |

---

## Typography Scale

| Name | Font | Size | Weight | Use For |
|------|------|------|--------|---------|
| display | Newsreader Bold | 30px | 700 | Hero headings, page titles |
| headline | Newsreader Italic | 24px | 400 | Section headings, card titles |
| title | Manrope Bold | 18px | 700 | Card titles, section headers |
| subtitle | Manrope SemiBold | 15px | 600 | Sub-headers, emphasis text |
| body | Manrope Regular | 14px | 400 | Paragraph text, descriptions |
| caption | Manrope Regular | 12px | 400 | Timestamps, metadata, secondary info |
| eyebrow | Manrope Bold | 11px | 700 | Category labels, uppercase overlines (letterSpacing: 1.5) |

---

## Spacing Scale

```
xs:   4px    — tight gaps (inline icon padding)
sm:   8px    — chip gaps, small margins
md:   12px   — card padding, list item gaps
lg:   16px   — section padding, card gaps
xl:   20px   — container padding (mobile)
xxl:  24px   — container padding (tablet)
xxxl: 32px   — large section margins
```

---

## Border Radii

```
sm:   8px    — buttons, tags, small cards
md:   12px   — cards, inputs
lg:   16px   — large cards, modals
pill: 999px  — chips, pills, avatars
```

---

## Dark Mode

- Use `useTheme()` hook — it returns the correct palette for the current color scheme
- Never hardcode hex colors in components; always reference theme tokens
- The dark palette inverts surfaces (dark bg, light text) and adjusts accent colors for contrast
- `heroBar` is `gray[800]` in both modes — used for category filter active state and nav bars
- Event card date boxes use transparent bg with `neutral` border and text (no fill)

---

## Anti-Patterns

- Do NOT use `primary` (teal) for taxonomy chip backgrounds or text
- Do NOT use `gold` or `purple` for buttons or interactive elements
- Do NOT use more than neutral + one accent color on any single card (keeps pages from looking like a rainbow)
- Do NOT hardcode color hex values — always import from `theme.ts`
- Do NOT use inline `fontFamily` strings — use `fonts.*` tokens
- Do NOT create one-off spacing values — use the spacing scale
