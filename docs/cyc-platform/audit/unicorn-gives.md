# Audit - Unicorn.Gives reference repo

**Repo:** `../UNI-Gives` (github.com/Unicorn/Unicorn.Gives)
**Audited:** 2026-06-23 (Kiran), re-verified 2026-06-29 · **Status:** verified

## TL;DR for reviewers

Unicorn.Gives is NOT a youth / community-center platform. It is a civic / municipal site
builder currently deployed as the community hub for Clare County, Michigan (README:
"© 2024 Lincoln Township"), plus a local business, "the Horn," running subscriptions through it.

**Revised conclusion:** Unicorn.Gives is an **infrastructure / deploy reference**, *not* the CYC
chassis. The chassis is Scaffald (`../UNI-Construct`) - see [scaffald.md](./scaffald.md). Of the
discovery doc's 13 CYC pillars, **none** exist here. Reusable value is ~30%, all of it plumbing
patterns. Anything we'd want from here (the deploy pipeline, the Gemini AI pattern) also exists,
more maturely, in Scaffald.

## 1. What it actually is - [Confirmed in code]

- Purpose: Municipal / civic content hub for Clare County, MI + "the Horn" (migrations 028-047)
- App: Single Expo (expo-router) app, web + native (`apps/mobile`)
- Shared code: One UI package (`packages/ui`) - this is `@scaffald/ui`, but **orphaned**
  (`pnpm-workspace.yaml` only globs `apps/*`, so it is not a registered workspace package)
- Backend: Supabase (Postgres + edge functions + RLS)
- Payments: Square - integrated (019, 023, 027 + 7 `square-*` functions)
- AI layer: Gemini (OpenAI fallback) via `admin-ai` edge function
- Hosting: AWS S3 + CloudFront + Route 53 + ACM
- CI: GitHub Actions; Monorepo: Nx + pnpm

## 2. Reusable for CYC - [Confirmed in code]

- Full chassis pattern (Expo + Supabase + AWS + CI monorepo) - **but Scaffald has the same stack,
  more mature.** Reuse Scaffald's; keep this as a secondary reference.
- AI layer (`admin-ai`, Gemini primary + OpenAI fallback) - Reference. Matches the doc's AI layer.
- Audit log (014, 015) - Reference (Scaffald also has audit-log patterns; reuse Scaffald's).
- AWS deploy pipeline (S3/CloudFront/Route 53) - Reference.

## 3. NOT reusable - the Square blocker - [Confirmed in code]

Square is **single-merchant-per-partner** (`square-subscriptions/index.ts`, migration 023):
one merchant per partner (the Horn / the Mane), 1-to-1 user->customer linking, subscription
tiers (`individual`/`couple`/`family`) but **no split-family billing, no multi-payer, no
multi-card**. The CYC POS requirement (Doc 5.4) is a different shape entirely. **CYC standardizes
on Stripe** (Scaffald) - this Square integration is not carried forward.

## 4. Gaps - spec needs it, repo does NOT have it - [Confirmed absent]

None of the 45 migrations or 9 functions implement any youth pillar: multi-guardian + split
billing, youth profiles + minor->18 lifecycle, completeness gating, registration/seat-caps,
attendance/roll-call/drops, notes & flags, incident log, mentoring + WIOA referrals,
gamification, funder reporting, kiosk/paperless.

## 5. Architecture gaps vs. the doc - [Confirmed]

Doc target = Supabase + Kong + Temporal + AI (Doc 3). Supabase + AI present. **Kong and Temporal
absent** (also absent in Scaffald and Earn & Learn). Treat as deferred, not built.

## 6. Hygiene notes

- `pnpm-workspace.yaml` only globs `apps/*`, so `packages/ui` is not a registered workspace
  package. (Cosmetic; not our chassis anyway.)
- 45 migrations (the v0.1 audit said 47; corrected). Numbering skips 005/006 - cosmetic.

## Open questions for reviewers

1. Anything worth lifting from the Unicorn.Gives deploy pipeline that Scaffald's doesn't already
   cover? (Default assumption: no - reuse Scaffald's.)
2. Keep Unicorn.Gives in scope at all, or drop it from the CYC reference set?
