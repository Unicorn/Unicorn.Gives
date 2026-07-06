# Open Decisions - Reviewer Checklist

The discovery doc's open questions (Doc 8) plus decisions surfaced by the codebase audit, split
into **Decided this revision** and **Still open**. Each open item needs an owner and a resolution.

## Decided this revision (with rationale)

- [x] **Chassis** -> **Scaffald (UNI-Construct)**, not Unicorn.Gives. First-party, owned, mature;
      already the identity/profile/portfolio/reputation spine. See [../audit/scaffald.md](../audit/scaffald.md).
- [x] **Payment processor** -> **Stripe** (Scaffald already integrates it). Unicorn.Gives' Square
      is single-merchant and not reusable. Multi-card/split-family billing is net-new on Stripe.
- [x] **Identity provider** -> **reuse Scaffald's OAuth2+PKCE** as the shared IdP.
- [x] **Where the youth profile lives** -> **in Scaffald from day one** (youth vertical), guardian-
      gated while minor. "Migrate at 18" = a claim/visibility flip, not a cross-system data move.
- [x] **Earn & Learn family vs. own brand** -> CYC is a **youth vertical on the Scaffald stack**,
      federated with Earn & Learn for the funder network (not shipped inside the E&L app).
- [x] **Kong + Temporal** -> **deferred** (absent in all three repos; Supabase edge functions + RLS
      carry Phase 0/MVP).
- [x] **Earn & Learn access** (the v0.1 top blocker) -> **resolved**; audited
      ([../audit/earnlearn.md](../audit/earnlearn.md)). Capabilities are real but mostly
      **rebuild-native references**, not code reuse.

## Still open (owner needed)

- [ ] **Final product name.**
- [ ] **App-in-monorepo vs. clean fork** of UNI-Construct for CYC (ownership / release cadence).
- [ ] **R3 - Earn & Learn federation:** wire Scaffald as a Supabase SSO provider on E&L's project?
      (Both are Supabase now; E&L has no partner API, so non-identity integration is data-level.)
- [ ] **Migration routing:** Antaris -> Scaffald direct, or Antaris -> Earn & Learn -> Scaffald
      (reuse E&L's existing Antaris importer)?
- [ ] **Split-family billing on Stripe:** Connect vs. multiple-customer-on-account (POS sizing).
- [ ] **Funder report as an early standalone slice** before full MVP?
- [ ] **Flag/incident taxonomy:** exact categories, color codes, banner hierarchy, time-decay
      (ref: E&L `banner-config` model).
- [ ] **Incident visibility:** how much prior-incident content (vs. count) each coach role sees.
- [ ] **Gamification scope** for v1 vs. later.
- [ ] **Migration trust threshold** + handling of the ~5% mismatch.
- [ ] **First open-source NPM packages:** which "build once" pieces ship first
      (completeness-gating, flag/incident taxonomy, funder-export, gamification), under what names?
- [ ] **Guardian/minor RBAC:** extend Scaffald's role enum in place, or a CYC-namespaced layer?

## Process (Doc 9)

1. Circulate this repo. 2. Comment pass (all stakeholders). 3. Revision pass + second comment pass.
4. Live walkthrough. 5. Lock MVP-to-replace-Antaris scope; size Phases 1-3. 6. Single group thread +
central repo as source of truth.
