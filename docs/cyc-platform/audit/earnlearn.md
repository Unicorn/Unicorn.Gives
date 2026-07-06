# Audit - Earn & Learn (EarnLearn.us)

**Repo:** `github.com/bernierllc/EarnLearn` (private) · default branch `main`
**Audited:** 2026-06-29 (read-only via GitHub API) · **Status:** verified · last push 2026-06-10

## TL;DR for reviewers

This is the audit the v0.1 roadmap was missing - the one all the guardian/RBAC/WIOA/mentoring
reuse claims depended on. Findings change the posture from "Reuse/Leverage code" to mostly
**rebuild-native using Earn & Learn as a design reference**, plus a genuine **data/relationship
asset** (the Contra Costa school + employer network).

**Stack:** Next.js + React + **Supabase (Postgres) + Prisma** (97 models, ~75 migrations).
TypeScript, ~446 test files. Mid-maturity (beyond prototype; visible schema-drift/test-reliability
pain).

**Two corrections to earlier assumptions (important):**
1. **Earn & Learn migrated OFF Clerk to Supabase Auth** (migration `..._rename_clerkid_to_supabase_user_id`,
   Feb 2026). The Clerk webhook is dead code in `.backups/`. **No Stripe, no Square** anywhere
   (the lone "square" hit is a favicon). So Earn & Learn is on the **same Supabase/Postgres
   platform as Scaffald** - federation and data-sharing are *more* feasible than first thought.
2. **There is no external/partner API today.** The `app/api/v1/*` endpoints are gated by a
   logged-in **Supabase session**, not machine-callable. `ApprenticeshipAPIKey` / `Webhook` tables
   exist in the schema but are **unwired** (no key auth, no OpenAPI, no SDK). So **"Leverage via
   API" is not possible without Earn & Learn first building a partner API + service-auth layer.**

## 1. What's real (capability by capability)

### Guardian / minor model - [Confirmed] - excellent reference design
Tables `guardians`, `guardian_students`, `consent_requests`, `consent_responses`
(`migration 20260308000000_add_guardian_consent_system`); `lib/services/guardian-service.ts`;
routes `app/api/guardian/*`.
- Many-to-many `GuardianStudent` with `relationship` (parent/legal_guardian/foster_parent/
  case_worker/other), `relationshipLabel`, `isPrimary`, `delegatesConsent`, `status`,
  `verifiedAt`. Multiple guardians per student and multiple students per guardian.
- Student side: `birthDate`, `consentSelfManaged` (>=13), `publicityEnabled`.
- **Consent workflow** (request/response, multi-guardian approval, 14-day expiry) for
  `publicity_toggle` and `profile_edit`. **Not** legal-liability waivers / e-signatures.
- **No billing / split-pay** - guardians are consent + visibility actors, not payers.

### RBAC - [Confirmed] - code-level, not RLS
Six roles (`enum UserRole { ADMIN, EDUCATOR, EMPLOYER, STUDENT, GUARDIAN, COMMUNITY_CENTER }`).
Authorization is **per-route in-handler** (`getCurrentUser()` then `if userType !== X → 403`),
**not** Postgres RLS or a central policy engine. Multi-role per Supabase user via an `Auth` table
+ `activeRole` cookie + role-priority. (Contrast Scaffald, which enforces via RLS - so CYC follows
Scaffald's RLS model, using E&L only for the role taxonomy ideas.)

### Community-center module - [Confirmed] - rudimentary, ~25-30%
`CommunityCenter`, `CommunityCenterUser(+Assignment)`, `CheckIn`, `CheckInEvent`; staff app
`app/community-center/{dashboard,events,students,settings}`; `POST /api/community-center/checkin`
records manual attendance against events. Admin reporting returns **counts only** (totalStaff /
totalStudents / totalCheckIns). Has: center + event + manual check-in + student linkage. Lacks:
registration intake, enrollment, scheduling/capacity, demographics, recurring programs, outcomes,
parent-facing registration.

### WIOA / funder / compliance reporting - [Partial] - grant-centric, NOT WIOA-demographic
Strong **apprenticeship-grant** surface: a generic `ComplianceRegime` engine (RAPIDS / CA-DAS /
CAI) with `formSchema` JSON + admin review workflow, and **CAI grant** quarterly reports with
auto-calculated metrics (apprentices registered/retained/completed, avg wage, retention rate, PDF).
**But:** `Student`/`Enrollment` carry **no race/ethnicity, disability, referral source, or WIOA
eligibility columns.** ZIP is derivable (`Address`/`State`), age from `birthDate`. **There is no
WIOA / Measure-X demographic report generator.** CYC must model funder demographics natively.
*Reference value: the regime + admin-review + auto-metric report pattern.*

### School & employer network - [Confirmed] - strategic DATA asset
`School` (district->campus hierarchy, `Educator`, `isSchoolAdmin`), `Company` (hierarchy,
`verificationStatus`, domain-verified membership, merge/combine governance), `Intermediary`
(unions/JACs). School<->Company linked **bidirectionally via Postgres triggers**. This is the real
Contra Costa relationship asset (records + relationship logic), not portable code. **Note:** an
idempotent **"Antaris CSV -> CYC student import" already landed 2026-06-08** - CYC roster data is
already flowing into Earn & Learn.

### Mentoring - [Absent] - greenfield
**Zero** mentoring / mentor-match / referral capability anywhere. Nearest neighbors are
apprenticeship `supervisorId` and educator->opportunity referrals (marketing language, no table).
Pillar 8 mentoring is net-new with **no reference**.

### Other confirmed: `AuditLog`, `Notification(+Preference)`, `Address`/`State`, `Opportunity`/
`Experience`/`Event`, apprenticeship program/enrollment/milestone/progress/time-log.

## 2. Identity federation with Scaffald (R3) - feasible, not built

Earn & Learn is a **Supabase Auth consumer** (not an IdP). It could **trust Scaffald as an IdP by
configuring Scaffald as a Supabase SSO/OAuth provider** on Earn & Learn's Supabase project - a
config change, not app code; nothing does this today, and identities are keyed to `supabaseUserId`.
Because both platforms are Supabase, this is the cleanest of the federation options.

## 3. Posture recommendation per capability

| Capability | Posture | API exists today? |
| --- | --- | --- |
| Guardian / minor model | **Rebuild-native** in Supabase RLS, using E&L's schema as the blueprint | Internal session-only |
| RBAC | Use **Scaffald's RLS RBAC**; borrow E&L's role taxonomy ideas | n/a |
| Community-center | **Rebuild-native** (reference shape); E&L far short of CYC needs | Internal session-only |
| WIOA / funder reporting | **Build-native** demographic model + report engine; reuse E&L's regime/review *pattern* only | Session-gated, grant-scoped |
| School / employer network | **Strategic data asset** - sync/migrate records (Antaris import already lands here) | No external API |
| Mentoring | **Build greenfield** - nothing to reference | No |

**Cross-cutting:** any "Leverage via API" plan must first fund Earn & Learn building a partner API
+ key/OAuth auth. Until then, integration is **data-level** (shared Supabase / sync) or
**reference-level** (rebuild from design), not live API calls. The only external touchpoints today
are two narrow `app/api/public/*` features (public student resume if `publicityEnabled`;
token-gated external-experience submission).

## Open questions for reviewers

1. Is Earn & Learn willing/resourced to **build a partner API** (keys/OAuth) for CYC leverage, or
   do we integrate at the **shared-Supabase / data-sync** level instead?
2. Given the Antaris->CYC import already lives in Earn & Learn, does CYC migration data flow
   **Antaris -> Earn & Learn -> Scaffald**, or **Antaris -> Scaffald** directly? (See
   [07-data-migration](../roadmap/07-data-migration.md).)
3. Confirm Scaffald-as-Supabase-SSO-provider on Earn & Learn's project as the R3 federation path.
