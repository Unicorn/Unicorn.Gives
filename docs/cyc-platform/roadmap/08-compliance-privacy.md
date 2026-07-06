# Compliance, Privacy & Risk

From Doc 7. These are funding and legal constraints, not nice-to-haves.

## Funding-driven reporting

- **Measure X / District 4:** ZIP-level reporting is a **funding requirement** and is
  **MVP-blocking** - the priority funder report is in MVP. Must prove CYC serves District 4
  residents (Doc 4 Funder, Doc 7).
- **WIOA / Workforce Board:** must capture referrals **out** and **disability status** (Doc 7).
  Referral-*out* capture is Phase 2 (mentoring), but the **demographic fields** behind the funder
  report are MVP.
- Demographic data is captured at registration (no separate survey): sex at birth vs.
  pronouns drives grant gender/sex reporting (Doc 4 Funder).
- **Build-native note:** Earn & Learn's compliance surface is **apprenticeship-grant-centric
  (CAI/RAPIDS)** and does **not** model WIOA/Measure-X participant demographics (race/ethnicity,
  disability, referral source, eligibility). CYC must **build this demographic data model and
  report engine natively** - it is the engine behind the MVP funder report, not something we
  inherit. Reuse E&L's regime + admin-review + auto-metric *pattern* only. See
  [../audit/earnlearn.md](../audit/earnlearn.md).

## Minor-safety

- Flag types needing strict permissioning + careful banner design: restraining order /
  safety (red), allergy, injury + return-to-sport, behavioral, developmental/diagnosis,
  pronouns/identity (protected) (Doc 5.6, Doc 7).
- RBAC governs who sees protected notes and how much incident **content** vs. count
  (Doc 5.7) - to manage bias.

## Consent & data ownership

- Parents own student/academic data and can refuse testing/sharing - **design for consent
  and waivers, never compulsion** (Doc 7). Expect stigma resistance in the population served.

## Jurisdiction risk

- **CCTV/AI presence (Phase 3):** legal in some states, **illegal in others (e.g. Colorado)**
  (Doc 7). Treat as R&D; gate by jurisdiction. The live Michigan site has different rules
  than the California CYC site.
- **Recording consent:** the discovery call itself was recorded without explicit prior
  consent (Doc 7) - standardize a consent practice going forward.

## Open questions for reviewers

1. Confirm the MVP-blocking set: ZIP/District-4 reporting + the registration-time demographic
   capture (sex-at-birth/pronouns, ethnicity, language, ZIP). Referral-out + CCTV/AI are later.
2. Where do consent/waiver records live (CYC guardian-consent tables, ref E&L's consent model),
   and how are they versioned for audit?
3. Who signs off on the jurisdiction gating logic for the CCTV/AI feature (Phase 3)?
