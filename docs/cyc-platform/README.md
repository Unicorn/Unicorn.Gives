\# Unicorn.Gives - CYC Platform Build Roadmap



This repository is the \*\*shareable planning deliverable\*\* for the CYC Community Center

Platform (working name; final product name TBD). It turns the v0.1 discovery doc into a

reviewable, comment-able build roadmap so senior engineers can sharpen the plan \*\*before\*\*

any code is written.



It contains \*\*no application source code\*\* - it is documentation only: specs, PRDs, and an

audit of the \*\*three first-party codebases\*\* we build from (Scaffald = chassis, Earn & Learn =

reference + funder network, Unicorn.Gives = infra reference).



\## What this is

\- \*\*Source of truth:\*\* the CYC Platform Roadmap v0.1 discovery doc.

\- \*\*Goal:\*\* build CYC as a youth vertical on the \*\*Scaffald\*\* chassis (identity/profiles/

&#x20; reputation), federated with \*\*Earn \& Learn\*\* for the funder network, with a well-scoped set of

&#x20; net-new youth pillars - then produce a phased plan to do it.

\- \*\*Status:\*\* living document - meant to be commented on and revised.



\## How it is organized

| Path | What is in it |

| --- | --- |

| roadmap/00-overview.md | Thesis, product framing, glossary of build-posture terms |

| roadmap/01-architecture.md | Target architecture; how the reference codebases slot in |

| roadmap/02-reuse-matrix.md | Capability to source to posture, annotated with audit findings |

| roadmap/03-identity-and-sso.md | SSO, federated identity, multi-guardian model, RBAC, gating |

| roadmap/04-profiles-and-portfolio.md | Youth profile + portfolio lifecycle (minor to 18 to claim to migrate) |

| roadmap/05-feature-pillars.md | The 13 pillars broken into buildable workstreams |

| roadmap/06-phased-plan.md | Phase 0 / MVP / Phases 1-3 with scope, deps, sizing |

| roadmap/07-data-migration.md | Antaris export, claim-your-profile blast, gating |

| roadmap/08-compliance-privacy.md | Measure X / WIOA / minor-safety / consent / CCTV-AI risk |

| roadmap/09-open-decisions.md | Reviewer checklist of open questions |

| roadmap/10-agile-execution-plan.md | GitHub issues/milestones/labels/Project + sprint plan |

| audit/scaffald.md | Audit of the Scaffald app (UNI-Construct) - the CYC chassis |

| audit/earnlearn.md | Audit of the Earn & Learn repo - reference design + funder network |

| audit/unicorn-gives.md | Audit of Unicorn.Gives - infra/deploy reference only |

| reference/ | Cloned reference repos - git-ignored, never committed |



\## How to review

1\. Start with roadmap/00-overview.md for the thesis and vocabulary.

2\. Each file ends with an "Open questions for reviewers" section - drop comments there.

3\. Everything traces back to a section of the discovery doc; citations are inline.



\## Conventions

\- Every claim is tagged \*\*Confirmed in code\*\* or \*\*Assumed / needs confirmation.\*\*

\- Nothing from reference/ is ever committed.

