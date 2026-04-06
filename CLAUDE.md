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


## Hosting & Deployment

- **Static site** hosted on **AWS S3 + CloudFront**
- S3 bucket: `unicorn-gives-web-391668783184-1774490745` (us-east-1)
- CloudFront distribution: `ER9WIPUKON9J3` → `unicorn.gives`
- AWS credentials are in the root `.env` (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)

### Build & deploy workflow

```bash
# 1. Build (generates sitemap + Expo web export)
pnpm nx run mobile:build

# 2. Deploy to S3 (source env for AWS creds)
source .env
aws s3 sync apps/mobile/dist/ s3://unicorn-gives-web-391668783184-1774490745 --delete

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id ER9WIPUKON9J3 --paths "/*"
```

### Environment variables

- **Root `.env`** — AWS creds, Supabase server-side keys (DB password, service role)
- **`apps/mobile/.env`** — `EXPO_PUBLIC_*` vars for local dev
- **`apps/mobile/.env.production.local`** — `EXPO_PUBLIC_*` vars baked into production builds (Expo loads this with highest priority during `expo export`)
- All `EXPO_PUBLIC_*` vars are inlined at build time — changes require a rebuild + redeploy

### Supabase

- Project ID: `kifhbevwmpqdeuxqnjxa`
- Migrations: `supabase/migrations/` (applied via `supabase db push` or `supabase migration up`)
- Check remote status: `supabase migration list --linked` (from `supabase/` dir)
- Supabase CLI is linked to the project (ref stored in `supabase/.temp/project-ref`)

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax


<!-- nx configuration end-->