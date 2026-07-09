# Product & Delivery Tracks - Backlog Structure

Restructures the CYC backlog so **non-technical SMEs (Gina, Sarah, operations, funders) can
inform the product** in parallel with engineering **building** it. One board (org Project #8),
two tracks, a clean epic -> user-story -> technical-task hierarchy.

## The problem (audit)

The original backlog was 100% engineer-facing: 16 epics, 34 "stories" that were all really
technical tasks (schemas, engines, pipelines, UI), and 7 decisions. There were **no user-facing
stories** and **no surface for domain experts** - yet SME knowledge is needed across ~10 of 14
pillars (flag taxonomy, funder fields, attendance rules, billing rules, consent content, ...).

## The model: two tracks on one board

```
Epic  (pillar - plain-language framing: what / who / why)
 ├─ Discovery track  [track:product]  ── SMEs live here
 │   ├─ User Story        type:story      "As a <persona>, I can <goal> so that <value>"
 │   └─ Define issue      type:discovery  open domain question SMEs answer (taxonomy, rules, fields)
 └─ Delivery track   [track:engineering] ── engineers live here
     └─ Technical Task    type:task       schema / engine / UI / pipeline (sub-issue of a story)
```

- **User stories & Define issues** are written in **plain language**, persona-tagged, and carry
  `sme-review`. They are the SME's job: validate the need, supply domain rules, sign off.
- **Technical tasks** are the engineer's job, linked as **sub-issues** of the user story they serve.
- **Define issue -> informs -> its tasks** (blocking): a task can't be "Ready" until its Define
  issue is resolved. This is the parallelism engine - SMEs define ahead of the build.

### Parallelization

- **Foundation & migration plumbing are SME-independent** -> engineers start immediately.
- **Every feature pillar gets its Define issue now** (all phases, including Phase 1-3) so SMEs can
  **inform later features today**, ahead of engineering reaching them. Discovery runs continuously;
  delivery pulls a pillar only once its Define issue is answered.

## Label scheme (additions)

| Group | Labels | Purpose |
| --- | --- | --- |
| **track** | `track:product` `track:engineering` | Which track an issue belongs to |
| **type** (new) | `type:discovery` | SME domain-definition issue (joins existing epic/story/task/spike/decision) |
| **persona** | `persona:admin` `persona:coach` `persona:parent` `persona:student` `persona:funder` | Whose need a story serves (from discovery-doc JTBD) |
| **flag** | `sme-review` | SME input wanted (on stories, Define issues, decisions) |

`type:story` now means a **real user story**; the 34 existing technical items are re-typed
`type:task` + `track:engineering`. Existing `pillar:` / `area:` / `priority:` labels are unchanged.

## SME ownership (proposed - correct as needed)

| SME | Domains (pillars) |
| --- | --- |
| **Gina** | Attendance, Notes & Flags, Incident Log, Mentoring (coaching / safety / youth) |
| **Sarah** | Reporting & funder, Privacy & Disclosures, Demographics (compliance / funder) |
| **Operations (Arti / Matt)** | Registration, POS / Billing, Kiosk, Notifications |
| **Guardian / legal** | Consent workflow, sensitive-field policy, e-sign packets |
| **Program / youth** | Gamification |

## Epic -> story -> task map

Legend: **US** = user story (`type:story`, persona), **Def** = Define issue (`type:discovery`),
task numbers are the existing issues re-typed to `type:task`.

### Phase 0

**E-FND Foundation & Chassis** — mostly delivery-only.
- Def: Role & permission matrix — who sees protected notes / incidents / PII (SME: Operations)
- Tasks: #37 stand-up, #38 RBAC impl, #39 guardian data model, #40 consent workflow, #41 claim state machine

**E-MIG Data Migration**
- Def: Migration trust threshold & mismatch handling (SME: Operations)
- Tasks: #42 spike, #43 import, #44 claim blast, #45 mismatch queue, #46 first-login gating

### MVP

**E-REG Registration & Scheduling**
- US (parent): register my child first-come when a class opens
- US (admin): open a class at a set time with a hard seat cap that auto-closes; shuffle/drop outside windows
- Def: Registration rules — seat caps, window timing, waitlist, override policy (SME: Operations)
- Tasks: #54 class/seat model, #55 timed window, #56 first-come flow, #57 waitlist, #58 staff override

**E-PRO Profiles & Data**
- US (parent): complete my child's profile once and link multiple children/guardians
- US (student): one profile across all programs
- Def: Required fields + annual progressive-update cadence (SME: Operations / Compliance)
- Tasks: #47 minor profile, #48 guardian linking UI, #49 completeness engine, #50 required-field set

**E-PRV Privacy & Disclosures**
- US (family): see (i) why each field is collected and who can see it
- Def: Field -> report -> disclosure mapping + sensitive-field access policy (SME: Sarah)
- Tasks: #51 mapping config, #52 disclosure UI, #53 sensitive-field RLS

**E-POS POS / Billing**
- US (parent): keep cards on file; different guardians pay for different classes and claim their own payments
- Def: Split-family billing rules — who claims what, card mgmt, fees (SME: Operations / Finance; see decision #20)
- Tasks: #59 multi-card, #60 split-billing, #61 two-guardian separation

**E-ATT Attendance & Drops**
- US (coach): take roll on a tablet with one tap; mark excused/unexcused
- US (admin): monthly missed-class list + auto-drop after N unexcused
- Def: Attendance rules — excused vs unexcused, drop threshold N, cadence (SME: Gina)
- Tasks: #62 roll-call UI, #63 excused/unexcused, #64 drop report, #65 monthly list

**E-REP Reporting & Exports**
- US (funder): pull the Measure-X / Workforce Board report by ZIP + demographics without hand-compiling
- US (admin): filter members by any field
- Def: Funder report fields + demographic taxonomy — Measure-X, WIOA, gender/sex (SME: Sarah)
- Tasks: #66 demographic model, #67 export engine, #68 report template

**E-KSK Kiosk / Paperless**
- US (parent): complete registration + e-sign on an in-center kiosk
- Def: Kiosk flow + digital packet / e-signature content (SME: Operations / Legal)
- Tasks: #69 kiosk flow, #70 e-sign packet

### Phase 1-3 — Define issues now (SME informs ahead), tasks decomposed at phase start

| Epic | User story (persona) | Define issue (SME) |
| --- | --- | --- |
| **E-NOT** Notes & Flags | (coach) see the 1-2 critical flags on a student; leave permissioned notes | Flag/incident taxonomy - categories, colors, banner hierarchy, permissions (Gina) — *supersedes decision #22* |
| **E-INC** Incident Log | (coach) log an incident that travels with the student, with prior context | Incident categories, visibility (content vs count per role), time-decay (Gina / safety) |
| **E-NTF** Notifications | (parent) be notified of cancellations, school-transition prompts, card links | Notification triggers & timing (Operations) |
| **E-MNT** Mentoring & Referrals | (coach) struggling students auto-match to a mentor; capture referrals incl. WIOA | Mentor-match triggers + referral/WIOA capture (Gina / Compliance) |
| **E-GAM** Gamification | (student) earn badges/streaks, unlock avatar gear, appear on CYC TV | Reward model - what earns badges, unlock tree (Program / youth) |
| **E-ACA** Academic Data | (student) connect school data into my profile (waiver-based) | Consent/waiver model + which data (Compliance / Legal) |
| **E-CTV** CCTV/AI Attendance | (admin) ethical presence check-in | Jurisdiction gating + consent policy (Compliance / Legal) |

## Views (added for the Product track)

Keep the 5 engineering views. Add:
1. **Product / SME Review** — Board, filter `track:product`, grouped by **Pillar**. SMEs' home.
2. **Discovery by Owner** — Table, filter `type:discovery`, grouped by **Assignee** (per-SME worklist).
3. *(optional)* **My Stories** — filter `sme-review assignee:@me` for each SME.

## Execution

`scripts/cyc/restructure-tracks.py` (idempotent):
1. Create the new labels.
2. Create user-story + Define issues (skip if title exists); assign SME owners; label
   `track:product` + `sme-review` + `persona:*` + `pillar:*`; set milestone.
3. Re-type the 34 existing items: remove `type:story`, add `type:task` + `track:engineering`.
4. Link each task as a **sub-issue** of its user story; link each Define issue as a blocker of its tasks.
5. Reframe the 16 epic bodies (plain-language: What / Who informs / SME asks / stories list).
6. Preserve Sprint 1 (existing assignees + iteration untouched).

Then build the two Product views in the UI (grouping/filter aren't API-creatable).

## Open questions

1. Confirm the SME ownership table (esp. who covers Operations - Arti vs Matt).
2. Do SMEs get `write` on the board (comment + edit fields) or just triage/comment?
3. Should decision #22 be closed in favor of the E-NOT Define issue, or kept and linked?
