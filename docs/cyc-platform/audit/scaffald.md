# Audit - Scaffald (UNI-Construct) - the CYC chassis

**Repo:** `../UNI-Construct` (Scaffald app, SDK, and UI as submodules)
**Audited:** 2026-06-29 · **Status:** verified · **App version:** v1.12.0 (production)

## TL;DR for reviewers

The v0.1 roadmap audited only the published **`@scaffald/sdk` client** and concluded Scaffald was
an *external* platform to "leverage via API." That was the key error. The **full first-party
Scaffald application is checked out locally** at `../UNI-Construct` - a mature, production
job/skills platform (v1.12.0, 2+ releases/month) that Clay **owns** (hardcoded `super_admin`:
`clay@unicorn.love`, `clay@scaffald.com`, plus zach/marc/vince@unicorn.love).

Scaffald already *is* the identity + profile + portfolio + reputation spine that the CYC product
is mostly made of. **It is the CYC chassis.** CYC ships as a youth vertical inside this monorepo.

## 1. What it actually is - [Confirmed in code]

- Monorepo: Nx + pnpm. Apps: `apps/scaffald` (Expo iOS/Android/web), `apps/web`,
  `apps/ui-storybook-native`.
- Packages: `packages/sdk` (`@scaffald/sdk`, submodule), `packages/ui` (`@scaffald/ui`, submodule),
  `packages/scf-core` (shared features/hooks/components), `packages/scf-schemas` (Zod),
  `packages/scf-trpc` (internal API), `packages/supabase` (DB + edge functions, 90+ migrations),
  plus `beyond-ui`, `compliance`, `insurance`, `ai-pipeline`, `tasks`, `scaffald-cli`.
- Backend: Supabase (Postgres 14 + Auth + RLS), Edge Functions (Deno), tRPC (internal) + REST
  (external/third-party).
- Frontend: React Native 0.85 + Expo SDK 54, Expo Router, React 19, Beyond UI + Scaffald UI.
- Payments: Stripe. Testing: Vitest + Playwright. Release: semantic-release.

## 2. Reusable for CYC (the spine) - [Confirmed in code]

- **Profiles + portfolio** (`core.users`, `core.profile`, `experience`, `education`,
  `certifications`, `skills`, portfolio) - Adapt for minors. (`migrations/001_schema.sql`,
  `013_portfolio.sql`)
- **Reputation / reviews** (unified reviews + `review_skill_ratings` + soft-skill votes +
  category ratings) - Adapt to a youth "engagement / progress score."
- **Skills taxonomy** - hierarchical, O*NET-seeded (1,016 occupations) + 24-item soft-skills
  catalog. Re-themable to youth/life skills.
- **Organizations / teams** - org + team model, members, invitations, roles. Maps to
  CYC programs / cohorts.
- **Social graph** - connections + polymorphic follows.

## 3. Identity / SSO - [Confirmed in code] - resolves a major open decision

Scaffald is a **full OAuth 2.0 provider with PKCE**, not just an auth consumer:
- Supabase Auth (email/password, Google/Apple, magic links, PKCE for native).
- OAuth app registration, authorization consent screen
  (`app/(admin)/oauth/consent`), token minting, scope validation
  (`core.validate_oauth_scope()`, `migrations/220_oauth_helper_functions.sql`).
- RBAC: roles `user` / `moderator` / `admin` / `super_admin`, with platform-, org-, and
  team-scoped role assignments; RLS on sensitive tables.

**Consequence:** Scaffald = the shared IdP for CYC (and the federation target for Earn & Learn).
This closes the v0.1 "reuse Scaffald OAuth vs. dedicated IdP" question - **reuse it.**

## 4. Gaps - youth pillars Scaffald does NOT have - [Confirmed absent]

Scaffald is an **adult, professional, single-identity** platform. Absent (net-new for CYC):
guardian / multi-guardian + minor model; youth <18 privacy lifecycle (parents see all until 18,
then claim & privatize); attendance / roll-call; notes & flags; incident log; registration /
seat-caps; gamification; funder/WIOA reporting; kiosk. These are built net-new in this monorepo.

## 5. Why this is the chassis (not "an API to leverage")

It is first-party source we own (not a third-party client SDK), it shares the exact target stack
(Expo + Supabase + RLS), it is the most mature of the three repos, and the CYC minor->18
"graduate to Scaffald" lifecycle collapses to a **same-platform claim/visibility flip** when the
youth profile already lives in Scaffald. The `@scaffald/sdk` (MIT) remains useful as the typed
client surface for any out-of-monorepo consumers.

## Open questions for reviewers

1. CYC = a new app inside this monorepo (`apps/cyc`), or a clean fork? (ownership / release)
2. Which Scaffald tables get youth extensions in place vs. CYC-namespaced new tables?
3. How much of the skills/O*NET taxonomy do we keep vs. re-theme for youth/community programs?
