# Profiles & Portfolio

Covers the youth profile and its full lifecycle: minor -> turns 18 -> "claim your profile."
**Decision: the youth profile lives in Scaffald from day one** (CYC is a youth vertical within
Scaffald), so the lifecycle is a same-platform state change, not a cross-system migration.
(Doc 3, Doc 4 Student.)

## The core idea (Doc 3)

"Safe portfolio profiles for kids that become professional profiles as adults." The profile is a
**Scaffald profile** the whole time. While the user is a minor it is guardian-gated and CYC-scoped;
at 18 the user claims it and it becomes a self-owned professional Scaffald profile.

### Divergence from the discovery doc (noted)

Doc 3 literally envisions the youth profile living in **Earn & Learn** and *migrating* to Scaffald
at 18. We are deliberately simplifying: **the profile is a Scaffald profile from the start.**
Rationale: we own Scaffald; it is the chassis; and this avoids a cross-stack profile move (Earn &
Learn is a separate Next.js/Prisma app). Earn & Learn stays integrated at the **data level**
(shared Supabase / sync) for the school/employer network and, later, WBL pathways - it is just not
the profile's home, and it exposes no live partner API today. See [../audit/earnlearn.md](../audit/earnlearn.md).

## Source model

- **[Confirmed] Scaffald** exposes the adult shape natively (not just via the SDK): `core.users`,
  `core.profile`, portfolio, projects, experience, education, skills, certifications, reviews.
  Posture: **Adapt for minors** - add date-of-birth, guardian links, visibility state, claim state.
- **[Reference] Earn & Learn** youth-profile + guardian fields inform the minor-side extensions
  (it is a design reference, not a code source - different stack).

## The lifecycle (Doc 4 Student)

1. **Minor (< 18):** profile is CYC-scoped with **guardian-visibility ON** - the UI clearly states
   "your parents can see all information on your profile." Safe-reporting of personal info is
   allowed. Enforced by Supabase RLS + a `visibility`/`claimed` state on the profile.
2. **Turns 18:** the user gains the ability to **claim** the profile and switch guardian-visibility
   OFF (make it private).
3. **Claim:** a claim/visibility flip - **not** an API migration or schema copy. The profile is
   already a Scaffald profile; claiming detaches guardians and grants full self-ownership, opening
   the standard professional Scaffald surface.

**No cross-system migration design needed** (this resolves the v0.1 "call Scaffald API vs.
replicate + sync" open question). The remaining design work is the **minor->adult state machine**
(visibility, guardian detach, what stays CYC-scoped vs. becomes public professional data).

## Profile data + privacy (Doc 5.2, 5.3, Doc 7)

- Completeness gating on required fields (see [03-identity-and-sso](./03-identity-and-sso.md)).
- Privacy disclosures: (i) icons explain how/where/why each field is used and who can see it;
  driven by the field->report mapping (Doc 3).
- **Sensitive fields** - sex at birth, pronouns, diagnoses/developmental flags - are collected for
  funder gender/sex reporting (Doc 4) and minor-safety. Stored with column-level access via
  Supabase RLS + role checks; surfaced only to permitted roles; always disclosed (Doc 7).
  See [08-compliance-privacy](./08-compliance-privacy.md).

## Portfolio + engagement (Doc 5.9, Phase 2)

- Student portfolio = "what I've done across programs" - a single Scaffald profile across all CYC
  programs. Reuses Scaffald portfolio/experience/skills, re-themed for youth.
- Avatar creation; badges/streaks; unlock customization (gear per sport) - net-new gamification.
- Future: appear on CYC TV at check-in with achievements.

## Open questions for reviewers

1. The minor->adult **state machine**: at claim, what stays CYC-scoped vs. becomes public
   professional data? (curated subset vs. everything)
2. Exact storage + RLS policy for sensitive fields (sex at birth, pronouns, diagnoses).
3. Do guardians retain any read access after an 18-year-old claims (legal/relationship), or a hard cut?
