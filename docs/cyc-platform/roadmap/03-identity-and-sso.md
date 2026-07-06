# Identity, SSO & Access Control

Priority deliverable (Doc 3, Doc 4). Covers how a CYC user authenticates, how identity is shared
across the sibling platforms, the multi-guardian model, RBAC, and profile-completeness gating.

## Federated identity across the siblings (Doc 1, Doc 3) - DECIDED

Goal: one person, one identity, usable across Scaffald, CYC, and Earn & Learn.

**Decision: Scaffald is the shared identity provider.** Scaffald (`../UNI-Construct`) is a full
**OAuth 2.0 + PKCE provider** - it registers OAuth apps, shows a consent screen, mints tokens, and
validates scopes against RBAC (`core.validate_oauth_scope()`,
`migrations/220_oauth_helper_functions.sql`). CYC authenticates against it natively (CYC lives
inside the Scaffald monorepo). This closes the v0.1 "reuse Scaffald OAuth vs. dedicated IdP"
question - **[Confirmed in code]**, reuse it.

### R3 - Earn & Learn federation (OPEN)

Earn & Learn **migrated off Clerk to Supabase Auth** (Feb 2026) - so it is a Supabase Auth
*consumer*, on the same platform as Scaffald. Federation path: **configure Scaffald as a Supabase
SSO / OAuth provider on Earn & Learn's Supabase project** (a config change, not app code). This is
the cleanest option precisely because both are Supabase; nothing wires it today and identities are
keyed to `supabaseUserId`. Note: Earn & Learn exposes **no external partner API**, so any
cross-platform data integration is **data-level (shared Supabase / sync)**, not service API calls,
until E&L builds one. See [../audit/earnlearn.md](../audit/earnlearn.md).

## How a CYC user authenticates

- **Student (youth):** logs in with school OR personal email (Doc 4 Student).
- **Parent / Guardian:** completes profile once, online or on an in-center kiosk, e-signs (Doc 4 Parent).
- **Staff (Admin/Coach):** role-based login; super-admin (Matt) can do any job without switching
  roles - Scaffald RBAC already supports a `super_admin` acting across scopes (Doc 4 Admin).

## Multi-guardian model (Doc 4 Parent, Doc 5.4) - BUILD (reference: Earn & Learn)

Requirements straight from the doc:
- More than one guardian per child.
- Multiple children attached to one guardian profile.
- Separated permissions between guardians.
- Split billing: different guardians pay for different classes; each guardian can claim any
  available payment for children they are connected to.

**Audit reality:** Earn & Learn **has** an excellent guardian model to learn from -
`guardians` / `guardian_students` (relationship types, `isPrimary`, multi-guardian) +
`consent_requests` / `consent_responses` (a real consent workflow for publicity/profile-edit,
>=13 self-manage). But it is on a **Next.js + Prisma** stack with **code-level role checks (not
RLS)** and **no billing** - so it cannot be lifted into the Scaffald (Supabase/RLS) chassis.
Posture: **rebuild native in Supabase RLS, using E&L's guardian + consent schema as the reference
design**, and add the split-billing layer (absent in E&L). Net-new code, not reuse. (Scaffald has
no guardian/minor concept - [Confirmed absent].) See [../audit/earnlearn.md](../audit/earnlearn.md).

## RBAC (Doc 4) - Adapt Scaffald + extend

Roles in the doc: Super-admin (Matt), Operations (Arti), Coach, Guardian, Student,
Funder/Compliance (read/report). Scaffald already ships RBAC (`user`/`moderator`/`admin`/
`super_admin`, platform/org/team scopes, RLS). **Posture: Adapt** - add `guardian`, `youth`,
`coach`, `funder` roles and the CYC scopes. RBAC must gate **protected notes** and incident
visibility (Doc 5.6, 5.7) via Supabase RLS to manage bias.

## Profile-completeness gating (Doc 5.2) - BUILD (reusable package)

A profile cannot finalize until required fields are entered (school, language at home, ethnicity,
etc.), with disclosures shown for why each is collected (Doc 5.3).

- Scaffald has a `profile-completion` concept as a **base**, but it is tuned to professional
  fields. CYC's required-field set + the field->report->disclosure mapping (Doc 3) is net-new.
- Build as a **reusable completeness-gating package** (it also powers first-login migration
  onboarding - see [07-data-migration](./07-data-migration.md)).

## Open questions for reviewers

1. **R3:** wire Scaffald as a Supabase SSO/OAuth provider on Earn & Learn's Supabase project
   (both are Supabase now), or use an identity-link mapping? Owner: needs Earn & Learn team.
2. Do the new `guardian`/`youth`/`coach`/`funder` roles extend Scaffald's role enum in place, or
   live in a CYC-namespaced RBAC layer?
3. Does Supabase RLS fully cover protected-notes / incident-visibility, or do we need an
   application-layer policy on top?
