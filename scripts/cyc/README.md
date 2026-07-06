# CYC Platform - GitHub agile bootstrap

Scripts that turn `docs/cyc-platform/roadmap/10-agile-execution-plan.md` into a live
GitHub backlog on this repo. Both are **idempotent** and take the repo/owner as env vars.

## 1. Issues, milestones, labels (done)

```bash
REPO=Unicorn/Unicorn.Gives python3 scripts/cyc/bootstrap-github-agile.py --what-if   # preview
REPO=Unicorn/Unicorn.Gives python3 scripts/cyc/bootstrap-github-agile.py             # apply
```

Creates: 38 labels (type / pillar / posture / area / priority / flags), 5 phase
milestones, 14 pillar/foundation epics, 34 Phase 0 + MVP stories (acceptance, labels,
points, epic + decision back-refs), and 7 human-in-the-loop decision issues. Epics carry
a linked task-list of their stories. Re-running matches existing issues by title (no dupes).

To decompose Phase 1-3 later, add stories to the `STORIES` list under their epic key and
re-run.

## 2. Project v2 board (needs a one-time scope grant)

```bash
gh auth refresh -s project,read:project                                    # one-time
OWNER=Unicorn REPO=Unicorn/Unicorn.Gives python3 scripts/cyc/bootstrap-github-project.py
```

Applied: created **CYC Platform Delivery** (org project #8), added `Story Points` (number),
`Posture` (single-select), and `Sprint` (iteration) fields, set `Status` to
`Backlog / Ready / In Progress / In Review / Blocked / Done`, linked the repo (new issues
auto-add), imported all 57 issues, and back-filled **Story Points** (from each issue body),
**Posture** (from the `posture:*` label), and `Status = Backlog` on every item. Idempotent:
re-run to re-sync after adding issues.

### Finish in the UI (iteration config + views are not API-creatable)

1. **Sprint** - open the Sprint field settings, set duration to **1 week**, and generate
   iterations (~12 ahead). The field already exists; it just needs a duration.
2. **Views** (New view -> configure -> Save):
   - *Current Sprint* - Board, group by **Status**, filter to the current **Sprint**.
   - *Sprint Planning* - Table, group by **Sprint**, show **Story Points** (capacity).
   - *Epic Breakdown* - Board, group by **Parent issue**.
   - *Roadmap* - Roadmap layout, marker/field = **Milestone**.
   - *Decisions* - Table, filter `label:type:decision`.
