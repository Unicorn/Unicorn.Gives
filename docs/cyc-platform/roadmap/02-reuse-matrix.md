# Reuse / Build Matrix

The discovery doc's capability -> source -> posture table (Doc 3), re-tagged against
**audit reality** after all three first-party repos were inspected in code. Tags:
**[Confirmed]** present in the named repo, **[Reference]** real but on a different stack so the
design is reused, not the code, **[Build]** spec needs it and no repo provides it.

Posture legend: **Reuse**(Scaffald, as-is) · **Adapt**(Scaffald, modified) ·
**Leverage**(Earn & Learn API) · **Build**(net-new) · **Reference**(rebuild using E&L design).

| Capability needed at CYC | Source | Posture | Audit reality |
| --- | --- | --- | --- |
| Identity / SSO (OAuth2 + PKCE) | Scaffald | Reuse | **[Confirmed]** Scaffald is a working OAuth provider; becomes the shared IdP |
| Verified youth profile + portfolio | Scaffald | Adapt | **[Confirmed]** profiles, portfolio, skills, education, certs - adapt for minors |
| Reputation / progress score | Scaffald | Adapt | **[Confirmed]** community-reputation / ratings - re-theme to engagement |
| Bidirectional reviews -> mentor/student notes | Scaffald | Adapt | **[Confirmed]** reviews + review skill/soft-skill ratings |
| Notifications | Scaffald | Reuse | **[Confirmed]** Scaffald notifications |
| Payments | Scaffald (Stripe) | Extend | **[Confirmed]** Stripe in Scaffald; multi-card/split-family is net-new on top |
| Composable backend (Supabase + AI) | Scaffald | Reuse | **[Confirmed]** Supabase + AI present; Kong/Temporal absent everywhere (deferred) |
| Multi-guardian access, separated permissions | New (E&L guardian as ref) | Build / Reference | **[Reference]** excellent guardian+consent model in Earn & Learn, but separate Next.js/Prisma app w/ code-level authz - rebuild native in Supabase RLS |
| Split billing per guardian | New (on Stripe) | Build | **[Build]** not in any repo; design on Stripe (Connect / multi-payer) |
| WIOA / Measure-X funder reporting | New (E&L pattern ref) | Build | **[Build]** E&L has *grant* (CAI/RAPIDS) reporting but **no WIOA/demographic** columns and **no API**; build demographics native, reuse the regime/report pattern |
| Mentoring match | New | Build | **[Absent]** zero mentoring in any repo - greenfield |
| School & employer network (Contra Costa K-14) | Earn & Learn | Leverage (data) | **[Confirmed]** real relationship/data asset; integrate by **data-sync / shared Supabase** (no external API today; Antaris->CYC import already lands in E&L) |
| Career-navigation / WBL pathways | Earn & Learn | Leverage (data) | **[Confirmed]** E&L WBL rails - data-level integration, not live API (Phase 3 bridge) |
| Audit log (capture everything) | Scaffald / E&L | Reuse / Reference | **[Confirmed]** audit-log patterns exist in both; reuse Scaffald's |
| Profile-completeness gating + disclosures | New (reusable pkg) | Build | **[Build]** Scaffald `profile-completion` is a base; CYC field/disclosure logic is net-new |
| Registration & scheduling (seat caps, timed) | New | Build | **[Build]** absent in all three |
| Attendance & drops (tablet roll call) | New | Build | **[Build]** absent in all three |
| Notes & flags taxonomy + banner hierarchy | New (reusable pkg) | Build | **[Build]** absent (E&L has a banner-config model worth referencing) |
| Cross-program incident log | New | Build | **[Build]** absent; paper system today |
| Reporting & exports (arbitrary-field filter) | New (reusable pkg) | Build | **[Build]** absent; pairs with E&L compliance leverage |
| Badges, streaks, avatars, leaderboard | New (reusable pkg) | Build | **[Build]** absent in all three |
| Kiosk / paperless + e-signature | New | Build | **[Build]** absent in all three |

## Net

CYC is **the Scaffald identity/profile spine + a Stripe-backed billing/registration layer + a
set of net-new youth-operations pillars**, federated with Earn & Learn for funder reporting and
the Contra Costa network. The honest split:

- **Reuse/Adapt from Scaffald:** identity, profiles, portfolio, reputation, notifications, Stripe.
- **Leverage Earn & Learn at the data level:** the Contra Costa school/employer network + WBL data
  (shared Supabase / sync). **Not** a live partner API - E&L doesn't expose one yet.
- **Build net-new (reusable packages):** completeness-gating, flag/incident taxonomy, funder-report
  export engine, gamification - plus registration, split-billing, attendance, kiosk.
- **Reference, not copy:** Earn & Learn's guardian/RBAC model (rebuild native in Supabase because
  the stacks differ).

The v0.1 roadmap's biggest **[Assumed]** risk - "guardian/RBAC/WIOA/mentoring is credited to an
unaudited Earn & Learn" - is now **resolved**, and the answer is sobering: Earn & Learn was audited
([../audit/earnlearn.md](../audit/earnlearn.md)). The **guardian model + community-center** are real
(rebuild-native references); the **network** is a real data asset; but **mentoring is absent**,
**WIOA demographics are not modeled**, and **there is no external API**. So most of these
reclassify from "Reuse" to **Build-native (E&L as reference)** - more net-new work than v0.1 assumed.

## Open questions for reviewers

1. Which "build once" pieces ship first as open-source NPM packages, and under what names?
2. Does Earn & Learn expose a stable external API for the mentoring + compliance leverage, or do
   we need to build that surface with the Earn & Learn team? (See E&L audit, point 8.)
3. Split-family billing on Stripe: Connect vs. multiple-customer-on-account?
