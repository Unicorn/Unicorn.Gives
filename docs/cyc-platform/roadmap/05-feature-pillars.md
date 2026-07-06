# Feature Pillars -> Workstreams

The discovery doc's 13 core pillars (Doc 5) as buildable workstreams, each tagged with build
posture and audit reality. Phase mapping (MVP vs. later) lives in
[06-phased-plan](./06-phased-plan.md).

Posture: **Reuse**(Scaffald) · **Adapt**(Scaffald) · **Leverage**(Earn & Learn API) ·
**Build**(net-new) · **Reference**(rebuild using Earn & Learn design).

| # | Pillar (Doc 5) | Workstream summary | Posture | Audit reality |
| --- | --- | --- | --- | --- |
| 1 | Registration & Scheduling | Timed class openings, seat caps, auto-close, waitlist on cancel, staff override outside public windows | Build | **[Build]** absent in all three repos |
| 2 | Profiles & Data | Student-guardian linking, completeness gating, disclosures | Adapt + Build | Scaffald profiles to adapt; guardian link + gating net-new |
| 3 | Privacy & Disclosures | (i) icons; field-to-report mapping; who-sees-what | Build | **[Build]** cross-cutting new (pairs with gating pkg) |
| 4 | POS / Billing | Multiple cards, split-family billing, two-guardian access, card-on-file, lower fees | Extend (Stripe) | Stripe in Scaffald; split-family/multi-payer net-new on top |
| 5 | Attendance & Drops | Tablet roll call, excused/unexcused, configurable-N -> drop, monthly missed list | Build | **[Build]** absent in all three |
| 6 | Notes & Flags | Permissioned staff notes, category + color taxonomy, banner hierarchy (1-2 critical flags) | Build | **[Build]** absent (E&L `banner-config` model is a reference) |
| 7 | Incident Log | Cross-program, profile-attached, prior context, time-decay, super-admin clear, RBAC | Build | **[Build]** absent; paper system today |
| 8 | Mentoring & Referrals | Auto-match on flags/struggles; academic referrals; WIOA capture (parents can decline) | Build | **[Absent]** no mentoring in any repo - greenfield (E&L WBL is a Phase-3 data bridge only) |
| 9 | Gamification | Badges, streaks, avatars, pixel-art unlocks, TV display; drives profile completion | Build | **[Build]** absent in all three |
| 10 | Reporting & Exports | Arbitrary-field filtering; pre-built funder report templates | Build | **[Build]** export engine + demographic capture net-new; reuse E&L's regime/auto-metric *pattern* (E&L lacks WIOA demographics + has no API) |
| 11 | Notifications | Cancellations, school-transition prompts, card-on-file links | Reuse | **[Confirmed]** Scaffald notifications |
| 12 | Kiosk / Paperless | In-office tablet flow + e-signature; fully digital packets | Build | **[Build]** absent in all three |
| 13 | Migration | Antaris export, claim-your-profile, first-login gating | Build | See [07-data-migration](./07-data-migration.md) |

## Reusable-package candidates (Doc 3 "build once, reusable")

The genuinely new work is built as **open-source NPM packages** in the Scaffald monorepo, not
one-offs:
- Completeness-gating engine (pillars 2/3) - also drives first-login migration onboarding.
- Flag/incident taxonomy + banner hierarchy (pillars 6/7).
- Funder-report export engine (pillar 10) - arbitrary-field filter + templates.
- Gamification engine (pillar 9).

Plus net-new application workstreams that are CYC-shaped (less obviously reusable): registration/
seat-caps, split-family billing on Stripe, attendance/roll-call, kiosk/e-signature, and the
guardian/minor model.

## Open questions for reviewers

1. Which pillars are truly MVP vs. deferrable? (locked in [06-phased-plan](./06-phased-plan.md))
2. Which "build once" pieces get open-sourced first, and under what package names?
3. Earn & Learn has **no external API today** and **no mentoring / WIOA-demographics**. Confirm
   pillars 8 and 10 are net-new builds (E&L provides the funder-network data + report *patterns*
   only). See [../audit/earnlearn.md](../audit/earnlearn.md).
