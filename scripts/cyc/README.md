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
gh auth refresh -s project,read:project                                   # one-time
OWNER=Unicorn REPO=Unicorn/Unicorn.Gives bash scripts/cyc/bootstrap-github-project.sh
```

Creates the **CYC Platform Delivery** project, adds `Story Points` (number) and `Posture`
(single-select) fields, links the repo (new issues auto-add), and imports all current CYC
issues.

### Finish in the UI (not reliably API-creatable)

1. **Sprint** - add an *Iteration* field named `Sprint`, **1-week** duration.
2. **Status** - extend the default field to `Backlog / Ready / In Progress / In Review / Blocked / Done`.
3. **Views** -
   - *Current Sprint* - Board by Status, filtered to the active Sprint.
   - *Sprint Planning* - Table grouped by Sprint (shows Points capacity).
   - *Epic Breakdown* - Board grouped by parent issue (epic).
   - *Roadmap* - Roadmap layout by Milestone.
   - *Decisions* - Table filtered to `label:type:decision`.
4. Set **Story Points** / **Posture** per item (bulk-edit in the table view; points are in each issue body).
