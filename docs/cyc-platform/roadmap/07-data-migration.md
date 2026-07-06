# Data Migration

Detail for Phase 0 (Doc 6 Phase 0, Doc 5.13).

## 1. Antaris export

- Invoke the **California data-ownership right**; request a raw data export from Antaris.
- Map exported fields to the new (Scaffald-based) CYC schema.
- **Risk:** Antaris is a repurposed health-club system (Doc 2) - field semantics may not map
  cleanly. Budget time for transformation, not just import.
- **Reuse opportunity:** an idempotent **"Antaris CSV -> CYC student import" already exists in
  Earn & Learn** (landed 2026-06-08). Decide the routing: **Antaris -> Scaffald directly**, or
  **Antaris -> Earn & Learn -> Scaffald** (reuse that importer; both are Supabase). See
  [../audit/earnlearn.md](../audit/earnlearn.md) and [06-phased-plan](./06-phased-plan.md).

## 2. "Claim your profile" blast

- Carry over email/phone from the export; send an email/SMS blast inviting each family to
  claim their profile.
- **~5% mismatch expected** (Doc 6, Doc 8) - scrub for trust; define a handling path for the
  mismatched records (manual review queue).

## 3. First-login completeness gating

- On first login, collect missing required fields (school, language at home, ethnicity, etc.)
  and present disclosures explaining why each is collected (Doc 5.2, 5.3).
- This is where the **completeness-gating engine** first earns its keep - and where the
  funder-reporting data actually gets captured.

## Dependencies

- Completeness-gating package (cross-cutting, build once - see [05-feature-pillars](./05-feature-pillars.md)).
- Guardian model (net-new; so a claimed profile attaches to the right guardians).
- Notification layer for the blast (Scaffald notifications - Reuse).

## Open questions for reviewers

1. Who owns the Antaris export request legally - CYC, or us on their behalf?
2. What is the acceptable mismatch threshold before a record goes to manual review? (Doc 8)
3. Do we gate ALL required fields on first login, or allow a grace period to avoid drop-off?
4. Migration routing: Antaris -> Scaffald direct, or via the existing Earn & Learn importer?
