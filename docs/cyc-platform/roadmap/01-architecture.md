# Architecture

## Target architecture (Doc 3)

The discovery doc specifies a composable backend: **Supabase + Kong + Temporal + AI layer.**

**Audit reality check:** Kong (API gateway) and Temporal (orchestration) are **absent from all
three repos** - aspirational, not built. Supabase + an AI layer are present in both Scaffald and
Unicorn.Gives. **Decision: defer Kong/Temporal.** Supabase edge functions + RLS carry Phase 0 and
MVP; revisit orchestration only when a workflow actually needs it.

## The chassis: Scaffald (UNI-Construct)

The v0.1 roadmap nominated Unicorn.Gives as the chassis and treated Scaffald as an external API.
The audit reversed this. **Scaffald (`../UNI-Construct`, v1.12.0) is the chassis** because it
already *is* the identity + profile + portfolio + reputation spine of the CYC product, it is
first-party (Clay is `super_admin`), and it is the more mature codebase (90+ migrations, tests,
Expo iOS/Android/web). See [../audit/scaffald.md](../audit/scaffald.md).

CYC ships as a **new youth surface + reusable packages inside the Scaffald Nx/pnpm monorepo**
(or a clean fork of it - see open question 1).

**Reuse directly from Scaffald (Reuse / Adapt):**
- Profiles, user-profiles, portfolio, projects, experience, education, skills, certifications
- Reviews / community-reputation / ratings (the "Scaffold Score" analog)
- **OAuth 2.0 + PKCE identity provider** (CYC's shared IdP)
- RBAC (platform / org / team scopes) + Supabase RLS
- Stripe billing, notifications, Expo app shell + `@scaffald/ui` component library

**From Earn & Learn - reference design + data asset (NOT live API today):**
- Earn & Learn is Next.js + Prisma + Supabase (migrated off Clerk). Its guardian/consent model and
  community-center shape are **rebuild-native references** (we copy the design into Supabase RLS,
  not the code). Its Contra Costa **school/employer network is a strategic data asset** (an
  Antaris->CYC import already lands there). It has **no external partner API**, **no mentoring**,
  and **no WIOA/Measure-X demographics** - so mentoring and funder-demographic reporting are
  net-new. Integration is data-level (shared Supabase / sync), not API calls, until E&L builds a
  partner API. See [../audit/earnlearn.md](../audit/earnlearn.md).

**Reference only from Unicorn.Gives:**
- AWS deploy pattern (S3/CloudFront/Route 53), Gemini `admin-ai` edge-function pattern. Its
  civic domain and single-merchant Square integration are **not** reused.

## Proposed CYC architecture

| Layer | Choice | Source | Posture |
| --- | --- | --- | --- |
| Monorepo / app shell | Scaffald Nx + pnpm + Expo (web + native) | Scaffald (UNI-Construct) | Reuse |
| Backend | Supabase (Postgres + RLS + edge functions) | Scaffald | Reuse |
| Identity / SSO | Scaffald OAuth 2.0 + PKCE as shared IdP | Scaffald | Reuse |
| Profiles / portfolio / reputation | Scaffald model, adapted for minors | Scaffald | Adapt |
| Guardian + minor lifecycle | Net-new in Supabase (RLS) | New (E&L as reference) | Build |
| Payments | **Stripe** (multi-card/split-family net-new on top) | Scaffald | Extend |
| WIOA / funder demographic reporting | Net-new (E&L lacks demographics + API) | New (E&L pattern ref) | Build |
| Mentoring & referrals | Net-new (absent in all repos) | New | Build |
| School / employer network | Data-sync / shared Supabase | Earn & Learn | Leverage (data) |
| AI | Scaffald AI layer; Gemini `admin-ai` as pattern ref | Scaffald / Unicorn.Gives | Reuse |
| Orchestration | Kong/Temporal deferred | Doc (not built) | Defer |

## Identity federation note (R3)

Goal: "one person, one identity" across CYC / Scaffald / Earn & Learn. Scaffald is an OAuth
provider; **Earn & Learn now runs on Supabase Auth** (migrated off Clerk). Federation path:
configure Scaffald as a Supabase SSO/OAuth provider on Earn & Learn's project. Feasible (both are
Supabase), not built yet - **open decision R3**, see [03-identity-and-sso](./03-identity-and-sso.md).

## Open questions for reviewers

1. CYC as a **new app inside** the UNI-Construct monorepo, or a **clean fork**?
2. Confirm Kong/Temporal stay **deferred** for MVP.
3. R3: federate Earn & Learn (Supabase Auth) with the Scaffald OAuth IdP via Supabase SSO?
