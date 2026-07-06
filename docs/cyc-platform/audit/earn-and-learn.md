# Audit — `EarnLearn` reference repo

**Repo:** https://github.com/bernierllc/EarnLearn (cloned to `reference/earn-and-learn`)
**Cloned:** 2026-07-06 · **Auditor:** Kiran · **Status:** first pass
**Method:** findings are based on the repo's actual files (Prisma schema, README, package
manifest). Each is tagged **[Confirmed in code]**, **[Partial]**, or **[Absent]**, with the
`schema.prisma` model/field cited. Resolves the [Assumed] rows Matt flagged in the roadmap.

---

## TL;DR for reviewers

Earn & Learn is a **mature, production Next.js 15 + Prisma + Supabase/Postgres platform** —
100+ models — and it already models **community centers, guardians, consent, students,
check-ins, the WBL marketplace, apprenticeships, and grant reporting.** Nearly every
capability the roadmap credited to E&L as **[Assumed]** is **confirmed in the schema**, often
to the exact field.

**The reframe worth discussing:** the roadmap treated CYC as "new build on the Unicorn.Gives
chassis, borrowing bits from E&L." The reality is closer to the reverse — **E&L already owns
the CYC domain model.** CYC may be best understood as *a new front-end + configuration over
E&L's data model*, with Unicorn.Gives supplying the Expo / Square / AWS chassis. See "Open
questions."

---

## 1. Stack — [Confirmed in code]

| Aspect | Finding | Evidence |
| --- | --- | --- |
| Framework | Next.js 15 (App Router), React 18, TypeScript | `package.json`, `app/` |
| ORM / DB | **Prisma** over Supabase/Postgres (not raw SQL migrations) | `prisma/schema.prisma` (80KB), `@prisma/client` |
| Auth | Supabase SSR | `@supabase/ssr` |
| AI | Anthropic + OpenAI SDKs | `@anthropic-ai/sdk`, `openai` |
| Reporting | PPTX + charts | `pptxgenjs`, `recharts` |
| Reusable pkgs | **`@bernierllc/*`** (email, email-manager, logging, connection-parser) | `package.json` deps |
| Hosting | Vercel | `vercel.json` |
| Maturity | Playwright E2E, Jest, CI DB-safety scripts, deployment snapshots | file tree |

The `@bernierllc/*` packages in production are a live proof of the "build-once, reusable NPM
package" model the roadmap proposes — worth auditing that library (Matt's `bernierllc/tools`)
for pieces CYC can reuse directly.

## 2. Matt's confirmations — [Assumed] → [Confirmed in code]

| Roadmap capability | Prior tag | Now | Evidence (schema.prisma) |
| --- | --- | --- | --- |
| Multi-guardian access | [Assumed] | **[Confirmed]** | `Guardian`, `GuardianStudent` (many-to-many, `relationship`, `isPrimary`, `addedBy`, `verifiedAt`) |
| Minor consent / privacy lifecycle | [Assumed] | **[Confirmed]** | `ConsentRequest` (`type: publicity_toggle`, "Make profile public", 14-day expiry) + `ConsentResponse` |
| RBAC roles | [Assumed] | **[Confirmed]** | `enum UserType { educator, employee, student, guardian, admin, community_center }` |
| Community-center domain | [Assumed] | **[Confirmed]** | `CommunityCenter`, `CommunityCenterUser`, `CommunityCenterUserAssignment` (`role`) |
| Attendance / check-in | [Absent] (Unicorn) | **[Confirmed]** | `CheckIn` (student+center+`checkInTime`+`method`), `CheckInEvent` |
| WBL marketplace | [Assumed] | **[Confirmed]** | `Opportunity` → `Experience` → `Event` → `StudentExperience`; `Educator`/`Employer`/`Company` |
| WIOA / grant reporting | [Assumed] | **[Confirmed]** | `CAIGrantApplication`, `CAIGrantReport` (auto metrics, `reportingPeriod`, `reportPdfUrl`) |
| Compliance framework | (not in roadmap) | **[Confirmed]** | `ComplianceRegime`, `ComplianceRegimeJurisdiction`, `ProgramComplianceRecord`, `CaliforniaDASCompliance` |
| Apprenticeship engine | (not in roadmap) | **[Confirmed]** | ~15 `Apprenticeship*` models + RAPIDS / California DAS regimes |
| Audit log | [Assumed] | **[Confirmed]** | `AuditLog` |

## 3. Guardian + consent model — matches Matt's spec exactly

`GuardianStudent` is the many-to-many join Matt described, with:
- `relationship`: `parent, legal_guardian, foster_parent, case_worker, other` (+ `relationshipLabel`)
- `isPrimary`, `addedBy` (educator/admin/**guardian** who added — the invite-others mechanic),
  `verifiedAt` (guardian confirms the relationship), `delegatesConsent` (delegate vs. require agreement).

`ConsentRequest`/`ConsentResponse` implement the **minor privacy toggle with guardian
sign-off** — the roadmap's "turns 18 → claim → make private / consent to go public" lifecycle,
already built. **Gap:** no split-family **billing** exists here (no payment/POS tables) —
consistent with Matt's note. Split billing stays **[Build]**.

## 4. What's still [Partial] or [Absent] for CYC

- **Mentoring auto-match — [Partial].** The `Opportunity`/`Experience` foundation exists, but
  student→opportunity *matching* is not modeled (matches Matt: educators use E&L for reporting;
  only community centers use it for student management). Build the match layer.
- **Split-family billing / POS — [Absent]** here (comes from Unicorn.Gives Square + net-new).
- **Gamification, flag/incident taxonomy, kiosk e-sign — [Absent]** in E&L (net-new, per roadmap).

## 5. Reusable directly for CYC

`CommunityCenter*`, `Guardian*`, `ConsentRequest/Response`, `CheckIn*`, `Student`,
`Opportunity/Experience/Event`, `CAIGrant*`, `ComplianceRegime*`, and the `@bernierllc/*`
packages. Posture: **Reuse / Extend** — CYC configures and front-ends these rather than
rebuilding them.

---

## Open questions for reviewers

1. **The big reframe:** should CYC be built as *configuration + new front-end over E&L's data
   model* (which already has community centers, guardians, consent, check-ins, reporting),
   with Unicorn.Gives as the Expo/Square/deploy chassis — rather than new-build-on-Unicorn?
2. Does E&L's `CommunityCenter` + `CheckIn` model cover CYC's registration/attendance needs,
   or do we extend it (seat caps, drops, roll-call)?
3. Can `ConsentRequest` (publicity_toggle) be generalized to CYC's full disclosure/gating set?
4. Do we run CYC on E&L's Prisma/Postgres schema directly, or sync via the shared `person_id`
   (Scaffald IdP) federation model? (Ties to identity decision.)
5. Which `@bernierllc/*` packages do we adopt wholesale (email, logging) vs. rebuild?
