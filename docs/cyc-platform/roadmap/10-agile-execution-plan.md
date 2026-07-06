# Agile Execution Plan - GitHub Issues / Milestones / Labels / Project

Turns the CYC roadmap ([00](./00-overview.md)-[09](./09-open-decisions.md)) into an executable
Scrum backlog on GitHub. **Cadence:** 1-week sprints, Fibonacci story points (1/2/3/5/8/13).
**Milestones = phase releases; sprints = Iterations inside a GitHub Project (v2).**

> **Decision #0 - where this lives / access.** Target repo = the Unicorn.Gives roadmap repo (this
> one). Creating milestones/labels/issues/a Project needs **write/admin** on the canonical repo
> (`Kiran-dev-ui/unicorn-gives-roadmap`); we currently have only a fork (`thinkclay/...`). Options:
> (a) Kiran grants write, (b) transfer the repo to a shared org, (c) bootstrap on the fork now and
> re-point later. The executor script (below) takes the repo as a variable, so the structure is
> identical either way.

## 1. Label taxonomy

Colors are suggestions; the executor sets them. Status lives on the **Project board**, not labels.

| Group | Labels | Use |
| --- | --- | --- |
| **type** | `type:epic` `type:story` `type:task` `type:spike` `type:bug` `type:decision` | Issue kind. `decision` = human-in-the-loop call from [09](./09-open-decisions.md). |
| **pillar** | `pillar:foundation` `pillar:registration` `pillar:profiles` `pillar:privacy` `pillar:pos` `pillar:attendance` `pillar:notes-flags` `pillar:incident` `pillar:mentoring` `pillar:gamification` `pillar:reporting` `pillar:notifications` `pillar:kiosk` `pillar:migration` | Maps to the 13 pillars + foundation. |
| **posture** | `posture:reuse` `posture:adapt` `posture:leverage` `posture:build` `posture:reference` | Carries the reuse-matrix decision onto every issue. |
| **area** | `area:frontend` `area:backend` `area:data` `area:infra` `area:design` `area:compliance` | Skill routing. |
| **priority** | `P0-blocker` `P1-high` `P2-medium` `P3-low` | Backlog ranking. |
| **flags** | `needs-decision` `reusable-package` `good-first-issue` `security` `blocked` | `needs-decision` blocks work until a `type:decision` issue resolves. |

## 2. Milestones (phase releases)

| Milestone | = Roadmap | Goal |
| --- | --- | --- |
| `Phase 0 - Foundation & Migration` | [06](./06-phased-plan.md) Phase 0 | CYC vertical stood up on Scaffald; off Antaris cleanly. |
| `MVP - Replace Antaris` | [06](./06-phased-plan.md) MVP | Minimum to fully drop Antaris. |
| `Phase 1 - Operational Depth` | Phase 1 | Notes/flags, incident log, event check-in, notifications. |
| `Phase 2 - Engagement & Retention` | Phase 2 | Gamification, mentoring, portfolio view. |
| `Phase 3 - R&D` | Phase 3 | Academic-data integration, CCTV/AI (jurisdiction-gated). |

## 3. GitHub Project (v2) configuration

One Project, "CYC Platform Delivery". Custom fields:

- **Status** (single-select): `Backlog` -> `Ready` -> `In Progress` -> `In Review` -> `Blocked` -> `Done`
- **Sprint** (Iteration field): **1-week** iterations, generated ~12 ahead.
- **Story Points** (number): 1/2/3/5/8/13.
- **Posture** (single-select): mirrors the posture labels (for board grouping).
- **Epic** (single-select or the native **sub-issues** parent link): groups stories under a pillar epic.

**Views:**
1. **Current Sprint** - Board by Status, filtered to the active Sprint.
2. **Sprint Planning** - Table grouped by Sprint, showing Points (capacity per sprint).
3. **Epic Breakdown** - Board grouped by Epic.
4. **Roadmap** - Roadmap view laid out by Milestone.
5. **Decisions** - Table filtered to `type:decision` (the human-in-the-loop tracker).

## 4. Epics (one tracking issue per pillar + foundation)

Each epic is a `type:epic` issue holding a sub-issue checklist of its stories. `M` = milestone.

| Epic | Pillar | M | Posture summary |
| --- | --- | --- | --- |
| E-FND Foundation & Chassis | foundation | P0 | Reuse/Adapt Scaffald + Build guardian model |
| E-MIG Data Migration | migration | P0 | Build (+ maybe reuse E&L Antaris importer) |
| E-REG Registration & Scheduling | registration | MVP | Build |
| E-PRO Profiles & Data | profiles | MVP | Adapt + Build |
| E-PRV Privacy & Disclosures | privacy | MVP | Build (reusable pkg) |
| E-POS POS / Billing | pos | MVP | Build on Stripe |
| E-ATT Attendance & Drops | attendance | MVP | Build |
| E-REP Reporting & Exports | reporting | MVP | Build (reusable pkg) |
| E-KSK Kiosk / Paperless | kiosk | MVP | Build |
| E-NOT Notes & Flags | notes-flags | P1 | Build (reusable pkg) |
| E-INC Incident Log | incident | P1 | Build |
| E-NTF Notifications | notifications | P1 | Reuse Scaffald |
| E-MNT Mentoring & Referrals | mentoring | P2 | Build (greenfield) |
| E-GAM Gamification | gamification | P2 | Build (reusable pkg) |

Phase 1-3 epics are created as **stubs** now (title + description + milestone); their stories are
decomposed when those phases approach. Phase 0 + MVP epics get full stories below.

## 5. Phase 0 stories (full breakdown)

Format per issue: **[epic] Title** - _acceptance_ · `labels` · **pts**. Points are first-draft.

### E-FND Foundation & Chassis
- **[FND] Spike: CYC as app-in-monorepo vs. fork of UNI-Construct** - _decision recorded; repo layout chosen_ · `type:spike area:infra needs-decision` · **3**
- **[FND] Stand up CYC surface + Supabase project on the Scaffald chassis** - _CYC app builds & deploys; Supabase project wired_ · `type:story posture:reuse area:infra` · **8**
- **[FND] Define CYC RBAC roles (youth, guardian, coach, admin/super, funder)** - _roles extend Scaffald RBAC; super-admin acts across scopes; RLS enforced_ · `type:story posture:adapt area:backend` · **5**
- **[FND] Guardian + minor data model (guardians, guardian_student, consent) + RLS** - _multi-guardian per child; multiple children per guardian; separated permissions; ref E&L design_ · `type:story posture:build area:data reusable-package` · **8**
- **[FND] Consent workflow (publicity / profile-edit, multi-guardian approval)** - _request/response, expiry, >=13 self-manage; ref E&L_ · `type:story posture:build area:backend` · **5**
- **[FND] Minor->18 claim state machine (visibility flip, guardian detach)** - _at 18 user claims profile; guardian visibility toggles off_ · `type:story posture:build area:backend` · **5**

### E-MIG Data Migration
- **[MIG] Spike: obtain Antaris export + map fields to CYC schema** - _CA data-ownership request drafted; field map documented; transformation gaps noted_ · `type:spike area:data needs-decision` · **5**
- **[MIG] Decision: migration routing (Antaris->Scaffald vs. via E&L importer)** - _routing decided; see [07](./07-data-migration.md)_ · `type:decision area:data needs-decision` · **1**
- **[MIG] Import pipeline: Antaris export -> CYC profiles** - _idempotent import; dry-run report_ · `type:story posture:build area:data` · **8**
- **[MIG] "Claim your profile" email/SMS blast** - _carries email/phone from export; reuses Scaffald notifications_ · `type:story posture:reuse area:backend` · **5**
- **[MIG] Mismatch manual-review queue (~5%)** - _flagged records routed to a review UI; threshold configurable_ · `type:story posture:build area:frontend` · **5**
- **[MIG] First-login completeness-gating onboarding** - _collects missing required fields + disclosures on first login_ · `type:story posture:build area:frontend` · **5**

## 6. MVP stories (full breakdown)

### E-PRO Profiles & Data
- **[PRO] Student profile adapted for minors (DOB, guardian visibility)** - _Scaffald profile + minor fields; guardian-visible while <18_ · `type:story posture:adapt area:backend` · **5**
- **[PRO] Student<->guardian linking UI** - _attach multiple children; multiple guardians; relationship types_ · `type:story posture:build area:frontend` · **5**
- **[PRO] Completeness-gating engine (reusable package)** - _profile can't finalize until required fields set; config-driven_ · `type:story posture:build area:backend reusable-package` · **8**
- **[PRO] CYC required-field set + annual progressive update** - _school/language/ethnicity/etc.; yearly re-confirm on school-year boundary_ · `type:story posture:build area:backend` · **3**

### E-PRV Privacy & Disclosures
- **[PRV] Field -> report -> disclosure mapping config** - _each field declares why collected / who sees it_ · `type:story posture:build area:compliance reusable-package` · **5**
- **[PRV] (i) disclosure UI on profile fields** - _icon + explanation per field; who-can-see_ · `type:story posture:build area:frontend` · **3**
- **[PRV] Sensitive-field storage + RLS (sex-at-birth, pronouns, diagnoses)** - _column-level access; permitted roles only; always disclosed_ · `type:story posture:build area:data security` · **5**

### E-REG Registration & Scheduling
- **[REG] Class/program model + seat caps** - _programs, sessions, hard capacity_ · `type:story posture:build area:backend` · **5**
- **[REG] Timed registration window (open + auto-close on full)** - _staff sets open time; auto-closes at cap_ · `type:story posture:build area:backend` · **5**
- **[REG] First-come registration flow (concert-ticket)** - _guardian registers child when window opens; race-safe_ · `type:story posture:build area:frontend` · **8**
- **[REG] Waitlist on cancellation** - _seat frees -> next in line offered_ · `type:story posture:build area:backend` · **3**
- **[REG] Staff override / manual move + drop outside windows** - _admin shuffles enrollments any time_ · `type:story posture:build area:frontend` · **5**

### E-POS POS / Billing (on Stripe)
- **[POS] Decision: split-family billing model on Stripe (Connect vs. multi-customer)** - _approach chosen; fees compared_ · `type:decision area:backend needs-decision` · **2**
- **[POS] Multiple cards on file per account** - _add/remove cards; two emails per account_ · `type:story posture:extend area:backend` · **5**
- **[POS] Split-family billing (guardian claims payments)** - _different guardians pay for different classes; each can claim any payment for connected children_ · `type:story posture:build area:backend` · **8**
- **[POS] Two-guardian separated billing access** - _guardians see only their own payment methods_ · `type:story posture:build area:backend security` · **5**

### E-ATT Attendance & Drops
- **[ATT] Tablet roll-call UI (tap to mark present)** - _fast per-roster check-off on tablet/phone_ · `type:story posture:build area:frontend` · **5**
- **[ATT] Excused / unexcused tracking** - _mark + reason_ · `type:story posture:build area:backend` · **3**
- **[ATT] Configurable-N unexcused -> drop report** - _threshold configurable; flags at-risk_ · `type:story posture:build area:backend` · **3**
- **[ATT] One-click monthly missed-class list** - _per program/month export_ · `type:story posture:build area:frontend` · **2**

### E-REP Reporting & Exports (the priority win - sequence first)
- **[REP] Demographic capture model (sex-at-birth/pronouns, ethnicity, language, ZIP, age)** - _captured at registration; queryable; MVP-blocking per [08](./08-compliance-privacy.md)_ · `type:story posture:build area:data compliance` · **5**
- **[REP] Funder-export engine (arbitrary-field filter) (reusable package)** - _filter members by any field; CSV/PDF out_ · `type:story posture:build area:backend reusable-package` · **8**
- **[REP] Priority Workforce Board / Measure-X report template** - _District-4 ZIP + demographics; one-click; ref E&L regime pattern_ · `type:story posture:build area:compliance P1-high` · **5**

### E-KSK Kiosk / Paperless
- **[KSK] In-center kiosk registration flow** - _tablet mode for paper-preferring parents_ · `type:story posture:build area:frontend` · **5**
- **[KSK] E-signature + digital packet capture** - _sign consent/waivers on kiosk; stored + versioned_ · `type:story posture:build area:compliance` · **5**

## 7. Decision issues (human-in-the-loop, from [09](./09-open-decisions.md))

Created as `type:decision needs-decision`, assigned owners, and set as **blockers** on the stories
they gate (via sub-issue / "blocked by" references):

- App-in-monorepo vs. fork (blocks E-FND) · owner: Clay
- Spec divergence: youth profiles in Scaffald from day one · owner: Clay/Matt
- Earn & Learn integration depth (data-sync vs. build partner API) · owner: E&L team
- Migration routing (blocks E-MIG import) · owner: Clay
- Split-family billing model on Stripe (blocks E-POS) · owner: eng
- Funder report as an early standalone slice · owner: Matt
- Flag/incident taxonomy (blocks E-NOT/E-INC, Phase 1) · owner: Matt/Arti

## 8. Illustrative sprint sequence (1-week; refine at planning)

Assumes a small team; **illustrative**, gated on the decision issues and staffing. Points/sprint =
team capacity (TBD).

| Sprint | Focus | Representative stories |
| --- | --- | --- |
| S1 | Decisions + chassis spike | FND spike, MIG spike, POS/MIG decisions, stand up CYC surface |
| S2 | Foundation | RBAC roles, guardian data model + RLS |
| S3 | Foundation -> Migration | consent workflow, claim state machine, import pipeline (start) |
| S4 | Migration | import pipeline, claim blast, mismatch queue, first-login gating |
| S5 | **Funder report slice** | demographic model, export engine, Workforce Board template |
| S6 | Profiles | minor profile, guardian linking, completeness engine |
| S7 | Registration | class/seat model, timed window, first-come flow |
| S8 | Registration + Kiosk | waitlist, staff override, kiosk + e-sign |
| S9 | POS | multi-card, split-family billing, separated access |
| S10 | Attendance + hardening | roll-call, excused/unexcused, drop report, missed list |

Note the **funder report is pulled to S5** (before full registration/POS) as the fastest,
highest-relief win - it only needs the demographic capture + export engine.

## 9. Execution (how the structure gets created)

A single idempotent script (`scripts/bootstrap-github-agile.sh`, to be added) using `gh`:

1. `gh label create ...` for the taxonomy (§1).
2. `gh api repos/:owner/:repo/milestones` for the 5 milestones (§2).
3. `gh project create` + `gh api graphql` to create the Project, custom fields (Status, Sprint
   iteration, Story Points, Posture), and views (§3). *(Projects v2 = GraphQL only.)*
4. `gh issue create` for epics (§4), then stories (§5-6) with labels + milestone, linked to their
   epic via sub-issues; decision issues (§7) created and set as blockers.
5. Add every issue to the Project; set Points/Posture/Sprint fields.

The script takes `REPO=owner/name` so it runs against the canonical repo (post-access) or the fork.
Dry-run first (`--what-if`) to preview.

## Open questions for reviewers

1. Confirm Decision #0 (repo access) so the executor targets the canonical repo.
2. Team size / capacity per 1-week sprint - needed to turn §8 from illustrative into committed.
3. Story-point first-drafts (§5-6) - reviewed at the first backlog-refinement session.
