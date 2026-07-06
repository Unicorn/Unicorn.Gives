#!/usr/bin/env bash
# Create the "CYC Platform Delivery" GitHub Project (v2), add fields, link the repo,
# and pull in all CYC issues. Iteration (Sprint) field + saved Views are created in the
# UI afterward (not reliably API-creatable) — see scripts/cyc/README.md.
#
# PREREQ (one-time): gh auth refresh -s project,read:project
# Usage: OWNER=Unicorn REPO=Unicorn/Unicorn.Gives bash scripts/cyc/bootstrap-github-project.sh
set -euo pipefail
OWNER="${OWNER:-Unicorn}"
REPO="${REPO:-Unicorn/Unicorn.Gives}"
TITLE="CYC Platform Delivery"

if ! gh auth status 2>&1 | grep -q "project"; then
  echo "Missing 'project' scope. Run:  gh auth refresh -s project,read:project" >&2; exit 1
fi

echo "Creating project '$TITLE' under @$OWNER ..."
NUM=$(gh project create --owner "$OWNER" --title "$TITLE" --format json | python3 -c 'import sys,json;print(json.load(sys.stdin)["number"])')
echo "Project #$NUM"

echo "Custom fields ..."
gh project field-create "$NUM" --owner "$OWNER" --name "Story Points" --data-type NUMBER >/dev/null || true
gh project field-create "$NUM" --owner "$OWNER" --name "Posture" --data-type SINGLE_SELECT \
  --single-select-options "reuse,adapt,extend,leverage,build,reference" >/dev/null || true
# The built-in "Status" field starts with Todo/In Progress/Done; extend it in the UI to
# Backlog / Ready / In Progress / In Review / Blocked / Done.

echo "Linking repo $REPO (new issues auto-add) ..."
gh project link "$NUM" --owner "$OWNER" --repo "$REPO" >/dev/null || true

echo "Adding existing CYC issues ..."
for n in $(gh issue list --repo "$REPO" --state open --limit 300 --json number --jq '.[].number'); do
  gh project item-add "$NUM" --owner "$OWNER" --url "https://github.com/$REPO/issues/$n" >/dev/null || true
done

echo "Done. Finish in the UI (see scripts/cyc/README.md):"
echo "  1) Add an Iteration field named 'Sprint' (1-week duration)."
echo "  2) Extend Status -> Backlog/Ready/In Progress/In Review/Blocked/Done."
echo "  3) Create the 5 views: Current Sprint (board), Sprint Planning (table by Sprint),"
echo "     Epic Breakdown (board by parent), Roadmap (by Milestone), Decisions (filter type:decision)."
echo "  4) Set Story Points / Posture per item (or bulk-edit in the table view)."
