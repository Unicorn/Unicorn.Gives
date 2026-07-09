\# Antaris → CYC Field Map \& Transformation Gaps



\*\*Ticket:\*\* #42 (Spike: obtain Antaris export + map fields to CYC schema)

\*\*Status:\*\* DRAFT v1 — built from Antaris public product documentation + the E\&L schema audit.

Actual export not yet received; every row below is \*\*\[Pending verification]\*\* against the real

export. Mapping confidence is marked per row.

\*\*Author:\*\* Kiran · 2026-07-09



\## What we learned about Antaris (research findings)



\- \*\*Exports exist:\*\* Antaris advertises 100+ real-time reports importable into spreadsheets —

&#x20; i.e., CSV/Excel export is a first-class feature CYC staff can likely run today.

\- \*\*An API exists:\*\* Antaris provides an API "so outside parties can easily access your

&#x20; club's data" — a programmatic extraction route beyond manual report exports.

\- \*\*Two extraction paths, in preference order:\*\*

&#x20; 1. \*\*API pull\*\* (complete, repeatable — ideal for migration + a final delta sync at cutover)

&#x20; 2. \*\*Staff report exports\*\* (available immediately, good for early field discovery)

&#x20; The formal export-request letter (see `antaris-export-request.md`) remains the umbrella ask.

\- \*\*Vendor profile:\*\* Antaris Technologies, Toronto (Canadian vendor — contract is the legal

&#x20; lever, not CA statute), \~11–50 people, founded 2008. Built for \*\*gyms/health clubs and

&#x20; medical wellness centers\*\*: memberships, EFT dues, classes, events, programs, locker

&#x20; rentals, POS/collections, payroll, marketing, kiosks, waitlists, custom questionnaires.

\- \*\*Two CYC-relevant surprises:\*\*

&#x20; - \*\*Waitlists are an Antaris feature\*\* → historical waitlist data may exist; request it.

&#x20; - \*\*Custom questionnaires/surveys\*\* → CYC may have collected demographic answers here;

&#x20;   explicitly request questionnaire definitions + responses in the export.



\## Entity-level map (Antaris domain → CYC target)



Target models are E\&L's Prisma schema (per `audit/earn-and-learn.md`), the presumed CYC data

model. Confidence: \*\*H\*\* (near-certain), \*\*M\*\* (probable), \*\*L\*\* (speculative until export).



| Antaris domain | Likely contents | CYC target (E\&L model) | Type | Conf. | Notes |

| --- | --- | --- | --- | --- | --- |

| Members | name, DOB, contact, status, join date | `Student` (minors) / `Guardian` (adults) | \*\*Split\*\* | H | Gym "member" conflates kid + payer. Adult vs. minor must be derived (DOB) and routed to different models. |

| Member ↔ family links | emergency contacts, family membership grouping | `GuardianStudent` (relationship, isPrimary) | \*\*Translate + Split\*\* | M | Gym systems model "family memberships," not guardianship. Relationship semantics (parent vs. emergency contact) need rules + likely manual review. |

| Memberships / dues | membership type, tier, billing schedule, EFT status | `Student.program` (partial) + billing (net-new) | \*\*Translate / Drop\*\* | M | Tiers → CYC programs needs a CYC-provided decoder. EFT billing details likely \*\*Drop\*\* (new POS is net-new build). |

| Classes / group classes | class name, schedule, instructor, capacity | `Opportunity` / `Event` | \*\*Translate\*\* | M | Maps to E\&L's opportunity→event flow; CYC seat-caps/timed-openings are Extend. |

| Class bookings + waitlists | member↔class registrations, waitlist entries | `StudentExperience` / registration (Extend) | \*\*Translate\*\* | M | Waitlist history exists in Antaris — request it; informs CYC waitlist feature. |

| Attendance / check-ins | check-in timestamps (door/kiosk) | `CheckIn` (studentId, centerId, checkInTime, method) | \*\*Direct-ish\*\* | H | E\&L's CheckIn matches gym check-in shape closely. Method mapping (door/kiosk/manual) trivial. |

| Payments / collections | transactions, balances, NSF/rebills | reporting archive only | \*\*Drop (archive)\*\* | M | New POS decision pending (processor TBD). Keep history as read-only archive for disputes/reporting; do not migrate into live billing. |

| Questionnaires / surveys | custom question definitions + member answers | `Student` profile fields + gating answers | \*\*Split/Translate\*\* | L | Unknown until export. Could pre-fill required demographic fields → shrinks first-login gating burden. High value; explicitly request. |

| Locker rentals, payroll, marketing | gym-ops data | — | \*\*Drop\*\* | H | Health-club leftovers; no CYC home. Document as intentionally dropped. |



\## Transformation gaps (acceptance criterion 3)



\*\*A. Semantic gaps — data exists but means the wrong thing:\*\*

1\. \*\*Member ≠ Student/Guardian.\*\* The single biggest transformation: one gym "member" table

&#x20;  must split into `Student` + `Guardian` + `GuardianStudent` links. DOB-based routing + a

&#x20;  manual-review queue for ambiguous records.

2\. \*\*Family membership ≠ guardianship.\*\* Antaris family groupings carry no relationship

&#x20;  type, no isPrimary, no consent semantics. Mapping rules + CYC staff review required —

&#x20;  this feeds the \~5% mismatch expectation in the roadmap.

3\. \*\*Membership tiers ≠ programs.\*\* Requires a CYC-provided decoder table (ask Arti/ops).



\*\*B. Absence gaps — CYC needs it, Antaris never had it (→ first-login gating list):\*\*

\- School attended, grade level

\- Language spoken at home

\- Ethnicity (unless captured in questionnaires — verify)

\- Sex at birth + pronouns (funder reporting; sensitive, disclosure-gated)

\- ZIP/district validation for Measure X reporting (address exists; district derivation is ours)

\- Guardian relationship type + consent preferences (net-new at claim time)

These become the \*\*completeness-gating field set\*\* — direct input to #52 (disclosure UI) and

the claim-your-profile flow.



\*\*C. Process gaps:\*\*

\- \*\*Delta problem:\*\* CYC keeps operating in Antaris during migration → plan a final

&#x20; delta export (API preferred) at cutover.

\- \*\*Questionnaire unknowns:\*\* definitions/answers could pre-fill gating fields — or be empty.

&#x20; Priority item to verify the moment export access exists.



\## Open items to close this spike



1\. \*\*CYC contact\*\* for the Antaris account + contract copy (asked in #42 comment — blocking

&#x20;  letter send + API-access question).

2\. \*\*Sample report exports\*\* from CYC staff (any member list / class roster CSV) — upgrades

&#x20;  this map from entity-level to field-level.

3\. \*\*API docs/credentials\*\* from Antaris — determines the extraction route.

4\. \*\*Tier→program decoder\*\* from CYC ops.

