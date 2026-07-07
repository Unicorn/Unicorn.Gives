#!/usr/bin/env python3
"""
Create native GitHub sub-issue links from each story's "Epic: #N" body reference.

The agile bootstrap writes epic->story relationships as markdown task-lists, which do
NOT populate the Projects "Parent issue" field. This adds the *native* sub-issue links so
the "Epic Breakdown" project view (grouped by Parent issue) nests stories under epics and
epics show sub-issue progress. Idempotent: re-linking an existing pair is ignored.

Usage: REPO=Unicorn/Unicorn.Gives python3 scripts/cyc/link-sub-issues.py
"""
import json, os, re, subprocess

REPO = os.environ.get("REPO", "Unicorn/Unicorn.Gives")
def sh(a): return subprocess.run(a, capture_output=True, text=True)

issues = json.loads(sh(["gh","issue","list","--repo",REPO,"--state","all","--limit","300",
                        "--json","number,id,body"]).stdout)
by_num = {it["number"]: it for it in issues}
links = []
for it in issues:
    m = re.search(r"Epic:\s*#(\d+)", it.get("body") or "")
    if m and int(m.group(1)) in by_num:
        links.append((by_num[int(m.group(1))], it))

print(f"{len(links)} story->epic links")
ok = err = 0
for epic, story in links:
    q = ('mutation{addSubIssue(input:{issueId:"%s",subIssueId:"%s"})'
         '{subIssue{number}}}' % (epic["id"], story["id"]))
    r = sh(["gh","api","graphql","-f","query="+q])
    if r.returncode == 0 or "already" in (r.stderr + r.stdout).lower():
        ok += 1
    else:
        err += 1; print("  ERR:", (r.stderr or r.stdout)[:120])
print(f"linked: {ok}, errors: {err}")
