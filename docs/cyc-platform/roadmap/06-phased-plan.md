# Phased Plan

Phases from the discovery doc (Doc 6), with scope, dependencies, and rough sizing. Sizing is
**T-shirt** (S/M/L) and preliminary - to be refined with Clay + Matt. Postures: **R**euse(Scaffald)
/ **A**dapt(Scaffald) / **L**everage(E&L data) / **B**uild(net-new). The v0.1 "[Assumed] depends on
Earn & Learn access" caveat is retired - Earn & Learn was audited
([../audit/earnlearn.md](../audit/earnlearn.md)); the guardian model is a **net-new build** (E&L is
a design reference, not a code source).

## Phase 0 - Data Migration & Foundation

**Goal:** stand up the CYC vertical on the Scaffald chassis; get off Antaris cleanly.

| Workstream | Scope | Posture | Deps | Size |
| --- | --- | --- | --- | --- |
| Stand up CYC vertical | New app/surface + youth packages in the Scaffald monorepo; Supabase project, CYC RBAC roles | R/Adapt | Chassis decision (app-in-monorepo vs fork) | M |
| Guardian + minor model | `guardian`/`guardian_student`/consent tables + RLS (ref: E&L design) | B | CYC vertical | L |
| Antaris export | Invoke CA data-ownership right; request raw export; map fields (health-club semantics won't map 1:1) | B | CYC/legal | M |
| Claim-your-profile blast | Email/SMS to carry over contacts; ~5% mismatch -> manual-review queue | B | Export, notifications | M |
| First-login onboarding | Completeness-gating package collects required fields + disclosures | B | Gating pkg, guardian model | M |

**Migration routing decision:** an Antaris->CYC student CSV import **already exists inside Earn &
Learn** (landed 2026-06-08). Decide whether CYC data flows **Antaris -> Scaffald directly**, or
**Antaris -> Earn & Learn -> Scaffald** (reusing that importer + the shared Supabase). See
[07-data-migration](./07-data-migration.md).

## MVP - "Replace Antaris" baseline

**Goal:** the minimum to fully migrate off Antaris (discovery doc Doc 6 MVP).

| Workstream | Scope | Posture | Deps | Size |
| --- | --- | --- | --- | --- |
| Registration & scheduling | Online + kiosk, seat caps, timed openings, auto-close, waitlist, staff override (first-come parity) | B | CYC vertical, profiles | L |
| Student + guardian profiles + gating | Scaffald profiles adapted for minors; student<->guardian linking; completeness gating | A + B | Guardian model, gating pkg | M |
| POS / billing | Multiple cards on file, split-family billing, two-guardian access (on Stripe) | B on Stripe | Guardian model, Scaffald Stripe | L |
| Attendance & drops | Tablet roll call, excused/unexcused, configurable-N -> drop, monthly missed list | B | Profiles | M |
| Reporting + priority funder report | Arbitrary-field filter + the Workforce Board / Measure-X report from demographics captured at registration | B | Gating (captures demographics), export engine | M |
| Kiosk / paperless | In-center tablet registration + e-signature; digital packets | B | Registration | M |

**Sequence the funder report first.** Flagged on the call as the fastest, highest-relief win - and
it only needs the completeness-gating capture + the export engine, not the full POS/registration
stack. It is a candidate for an **early standalone slice** (see open question 3).

## Phase 1 - Operational depth

- Notes & flags taxonomy (color-coding + permission tiers; ref: E&L `banner-config`).
- Cross-program incident log (context + time decay) - paper system exists today, so not MVP.
- Event check-in (e.g. tonight's career-navigation check-ins in the AE room).
- Notifications (cancellations, school-transition prompts) - Reuse Scaffald notifications.

## Phase 2 - Engagement & retention

- Gamification engine (badges, streaks, avatar unlocks, TV leaderboard) - net-new reusable package.
- Mentoring auto-match + referral capture (incl. WIOA referral *out*, disability status) -
  **greenfield** (no mentoring exists in any repo).
- Portfolio / "what I've done" student view - Adapt Scaffald portfolio.

## Phase 3 - Ambitious / R&D

- Academic data integration ("LinkedIn for kids" via Clever / Infinite Campus, waiver-based) - the
  bridge into **Earn & Learn** WBL pathways (data-level integration; this is where the E&L network
  pays off for career navigation).
- Ethical attendance via CCTV/AI presence (offline, opt-in) - **jurisdiction-gated** (see [08](./08-compliance-privacy.md)).

## Critical path

CYC vertical on Scaffald -> **guardian + minor model (net-new)** -> profiles + gating ->
registration + POS -> reporting. The guardian model is the keystone dependency (everything attaches
to it), and it is a **net-new build** referencing Earn & Learn's design - not a dependency on
Earn & Learn access. Identity is **Reuse** (Scaffald is already the IdP).

## Open questions for reviewers

1. Confirm MVP scope - is this the true minimum to drop Antaris, or can it shrink?
2. Sizing reality check from Matt on the L items (registration, POS, guardian model).
3. Ship the **funder report as an early standalone slice** before full MVP, for fastest relief?
4. Migration routing: Antaris -> Scaffald direct, or via the existing Earn & Learn importer?
