# CYC Platform (working name) - Build Roadmap: Overview

**Source of truth:** CYC Platform Roadmap v0.1 discovery doc (the Google Doc - *not* the
rendered PDF in this repo, which is an earlier draft of this roadmap).
**Status:** living document - revised after a code-level audit of all three first-party repos.

## Thesis (Doc 1)

One proven, composable infrastructure stack, deployed across multiple ventures, taking
time-to-launch from months to weeks. CYC is the **third** real-world deployment, alongside
two sibling portfolio companies: **Earn & Learn** and **Scaffald**.

## Product framing (Doc 2, Doc 8)

- CYC = community center, District 4, California; ~2,600 active youth (grew from 1,400 in 6 years).
- Today it runs on **Antaris** (a repurposed health-club system) + Google Forms/Sheets/paper.
- The bar to clear: a single **system of record** that eliminates the manual back-and-forth.
- Working name "CYC Platform"; final product name TBD.
- This is largely **assembly + configuration** of existing components, *plus* a well-scoped
  set of net-new youth-specific pillars (see the reuse matrix for the honest split).

## The three first-party assets we build from (revised after audit)

The v0.1 roadmap framed this as "Unicorn.Gives = the chassis, Scaffald = an external API."
The code audit showed both framings were wrong. There are **three first-party repos**, each
verified in code, and the right chassis is **Scaffald**, not Unicorn.Gives:

| Asset | Reality (verified in code) | Role for CYC |
| --- | --- | --- |
| **Scaffald** (`../UNI-Construct`) | First-party production app **v1.12.0**; Clay is a hardcoded `super_admin`. Profiles, portfolio, skills, education, certs, reviews/reputation, **OAuth2+PKCE identity provider**, RBAC + RLS, 90+ migrations, tests, Stripe, Expo (iOS/Android/web). | **Chassis + identity/profile spine.** CYC is a youth vertical here. |
| **Earn & Learn** (`github.com/bernierllc/EarnLearn`) | Real, auditable. **Next.js + Prisma + Supabase** (migrated off Clerk; no Stripe). Guardian + consent model, students, RBAC, apprenticeship-grant (CAI/RAPIDS) reporting, school/employer network, a rudimentary `community-center` module. **No external API; no mentoring; no WIOA demographics.** | **Reference design + strategic data asset.** Different app stack (Next/Prisma) - rebuild native, don't copy. Same Supabase platform, so data-sync/federation is feasible. |
| **Unicorn.Gives** (`../UNI-Gives`) | Civic CMS for Clare County MI + "the Horn". Expo+Supabase+Square+Gemini+AWS; **45** migrations, **zero** youth/guardian/profile domain; Square is single-merchant. | **Infra/deploy reference only.** Demoted from "chassis." |

## Decisions locked (this revision)

1. **Chassis = Scaffald (UNI-Construct).** Build CYC's identity + profile + portfolio +
   reputation on the first-party Scaffald monorepo; youth-specific pillars are net-new.
2. **CYC = a youth vertical *within* Scaffald** from day one. Minor profiles are Scaffald
   profiles with guardian-gated visibility; "migrate to Scaffald at 18" becomes a
   **claim / visibility flip**, not a cross-system data move.
3. **Identity provider = Scaffald OAuth2+PKCE**, the shared IdP across all three platforms.
4. **Payments = Stripe** (Scaffald already integrates it). Multi-card / split-family billing
   is net-new on top of Stripe; Unicorn.Gives' single-merchant Square is not reusable.

## Glossary - build-posture vocabulary (Doc 3)

- **Reuse** - extract existing code (open-source or via API) and use as-is.
- **Adapt** - adjust existing functionality to fit a new use.
- **Leverage** - call an existing API for data/functionality as an add-on.
- **Extend** - take current functionality and add to it.
- **Configure** - reconfigure existing functionality via settings/setup.
- **Open-sourced** - made public, owned by no entity, to remove ownership/dependency issues.

## How to read this roadmap

| File | Covers |
| --- | --- |
| [00-overview](./00-overview.md) | This file - thesis, three-asset model, locked decisions |
| [01-architecture](./01-architecture.md) | Target architecture on the Scaffald chassis |
| [02-reuse-matrix](./02-reuse-matrix.md) | Capability -> source -> posture, audit-verified |
| [03-identity-and-sso](./03-identity-and-sso.md) | Scaffald IdP, multi-guardian, RBAC, gating |
| [04-profiles-and-portfolio](./04-profiles-and-portfolio.md) | Youth profile lifecycle, in-Scaffald |
| [05-feature-pillars](./05-feature-pillars.md) | The 13 pillars as buildable workstreams |
| [06-phased-plan](./06-phased-plan.md) | Phase 0 / MVP / Phases 1-3 |
| [07-data-migration](./07-data-migration.md) | Antaris export, claim-your-profile, gating |
| [08-compliance-privacy](./08-compliance-privacy.md) | Measure X / WIOA / minor-safety / consent |
| [09-open-decisions](./09-open-decisions.md) | Reviewer checklist - decided vs. still open |
| [10-agile-execution-plan](./10-agile-execution-plan.md) | GitHub issues/milestones/labels/Project; sprints |

See also: [../audit/scaffald.md](../audit/scaffald.md),
[../audit/earnlearn.md](../audit/earnlearn.md),
[../audit/unicorn-gives.md](../audit/unicorn-gives.md).

## Conventions

- Every claim is tagged **Confirmed in code** or **Assumed / needs confirmation.**

## Open questions for reviewers

1. CYC as a **new app inside** the Scaffald (UNI-Construct) monorepo, or a **clean fork**?
   (ownership / release-cadence trade-off)
2. What is the final product name?
3. How does Earn & Learn federate / share data with Scaffald? Both run on Supabase (E&L migrated
   off Clerk), so the path is Supabase SSO + data-sync, not a partner API (which E&L lacks today).
   See [03-identity-and-sso](./03-identity-and-sso.md) (R3) and [../audit/earnlearn.md](../audit/earnlearn.md).
