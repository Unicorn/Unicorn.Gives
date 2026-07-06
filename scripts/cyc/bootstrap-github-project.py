#!/usr/bin/env python3
"""
Create + configure the "CYC Platform Delivery" GitHub Project (v2) via GraphQL.

Does: create project; add Story Points (number), Posture (single-select), and Sprint
(iteration) fields; set Status to Backlog/Ready/In Progress/In Review/Blocked/Done; link
the repo (future issues auto-add); import all CYC issues; back-fill Points (from issue
body) + Posture (from label) + default Status=Backlog per item.

PREREQ: gh auth refresh -s project,read:project
Usage:  OWNER=Unicorn REPO=Unicorn/Unicorn.Gives python3 scripts/cyc/bootstrap-github-project.py
Idempotent-ish: re-uses a project of the same title; re-adding items/values is safe.
"""
import json, os, re, subprocess, sys

OWNER = os.environ.get("OWNER", "Unicorn")
REPO  = os.environ.get("REPO", "Unicorn/Unicorn.Gives")
TITLE = "CYC Platform Delivery"

def gql(query, **vars):
    args = ["gh","api","graphql","-f",f"query={query}"]
    for k,v in vars.items(): args += ["-F", f"{k}={v}"]
    r = subprocess.run(args, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip())
    return json.loads(r.stdout)["data"]

def try_gql(query, **vars):
    try: return gql(query, **vars), None
    except RuntimeError as e: return None, str(e)

# -- owner id
oid = gql('query($l:String!){organization(login:$l){id}}', l=OWNER)["organization"]["id"]

# -- find or create project
projs = gql('query($l:String!){organization(login:$l){projectsV2(first:50){nodes{id number title}}}}',
            l=OWNER)["organization"]["projectsV2"]["nodes"]
proj = next((p for p in projs if p["title"] == TITLE), None)
if proj:
    print(f"Reusing project #{proj['number']}")
    pid, pnum = proj["id"], proj["number"]
else:
    d = gql('mutation($o:ID!,$t:String!){createProjectV2(input:{ownerId:$o,title:$t})'
            '{projectV2{id number url}}}', o=oid, t=TITLE)["createProjectV2"]["projectV2"]
    pid, pnum = d["id"], d["number"]
    print(f"Created project #{pnum}: {d['url']}")

# -- existing fields
def fields():
    q = ('query($p:ID!){node(id:$p){... on ProjectV2{fields(first:50){nodes{'
         '__typename ... on ProjectV2FieldCommon{id name} '
         '... on ProjectV2SingleSelectField{id name options{id name}}}}}}}')
    return gql(q, p=pid)["node"]["fields"]["nodes"]
F = {f["name"]: f for f in fields() if f}

# -- Story Points (NUMBER)
if "Story Points" not in F:
    gql('mutation($p:ID!){createProjectV2Field(input:{projectId:$p,dataType:NUMBER,'
        'name:"Story Points"}){projectV2Field{... on ProjectV2FieldCommon{id name}}}}', p=pid)
    print("  + field Story Points")

# -- Posture (SINGLE_SELECT)
if "Posture" not in F:
    opts = ",".join(f'{{name:"{n}",color:{c},description:""}}' for n,c in
        [("reuse","GREEN"),("adapt","BLUE"),("extend","PURPLE"),
         ("leverage","YELLOW"),("build","ORANGE"),("reference","GRAY")])
    gql('mutation($p:ID!){createProjectV2Field(input:{projectId:$p,dataType:SINGLE_SELECT,'
        'name:"Posture",singleSelectOptions:['+opts+']}){projectV2Field{... on '
        'ProjectV2SingleSelectField{id name}}}}', p=pid)
    print("  + field Posture")

# -- Sprint (ITERATION) — may be unsupported via API
if "Sprint" not in F:
    _, err = try_gql('mutation($p:ID!){createProjectV2Field(input:{projectId:$p,'
        'dataType:ITERATION,name:"Sprint"}){projectV2Field{... on ProjectV2IterationField{id name}}}}', p=pid)
    print("  + field Sprint (iteration)" if not err else
          "  ! Sprint iteration field must be added in the UI (API: %s)" % err.splitlines()[0][:80])

# -- Status: set the 6-column set (replaces default Todo/In Progress/Done)
F = {f["name"]: f for f in fields() if f}
status = F.get("Status")
if status and {o["name"] for o in status.get("options",[])} != \
   {"Backlog","Ready","In Progress","In Review","Blocked","Done"}:
    opts = ",".join(f'{{name:"{n}",color:{c},description:""}}' for n,c in
        [("Backlog","GRAY"),("Ready","BLUE"),("In Progress","YELLOW"),
         ("In Review","PURPLE"),("Blocked","RED"),("Done","GREEN")])
    _, err = try_gql('mutation{updateProjectV2Field(input:{fieldId:"'+status["id"]+
        '",singleSelectOptions:['+opts+']}){projectV2Field{... on ProjectV2SingleSelectField{id}}}}')
    print("  ~ Status columns set" if not err else "  ! Status update: "+err.splitlines()[0][:80])

# -- refresh field ids/options
F = {f["name"]: f for f in fields() if f}
pts_fid = F["Story Points"]["id"]
pos_fid = F["Posture"]["id"]; pos_opt = {o["name"]:o["id"] for o in F["Posture"].get("options",[])}
st = F.get("Status"); st_fid = st["id"] if st else None
st_opt = {o["name"]:o["id"] for o in st.get("options",[])} if st else {}

# -- link repo so future issues auto-add
subprocess.run(["gh","project","link",str(pnum),"--owner",OWNER,"--repo",REPO],
               capture_output=True, text=True)

# -- issues -> items, back-fill fields
issues = json.loads(subprocess.run(
    ["gh","issue","list","--repo",REPO,"--state","all","--limit","300",
     "--json","number,title,body,labels,id"], capture_output=True, text=True).stdout)
print(f"Adding {len(issues)} issues + setting fields...")
n_pts = 0
def set_val(item, fid, valexpr):
    gql('mutation{updateProjectV2ItemFieldValue(input:{projectId:"'+pid+'",itemId:"'+item+
        '",fieldId:"'+fid+'",value:'+valexpr+'}){projectV2Item{id}}}')
for it in issues:
    item = gql('mutation{addProjectV2ItemById(input:{projectId:"'+pid+'",contentId:"'+
               it["id"]+'"}){item{id}}}')["addProjectV2ItemById"]["item"]["id"]
    # points
    m = re.search(r"\*\*Points:\*\*\s*(\d+)", it.get("body") or "")
    if m:
        set_val(item, pts_fid, "{number:"+m.group(1)+"}"); n_pts += 1
    # posture from label
    pl = next((l["name"].split(":")[1] for l in it.get("labels",[])
               if l["name"].startswith("posture:")), None)
    if pl and pl in pos_opt:
        set_val(item, pos_fid, '{singleSelectOptionId:"'+pos_opt[pl]+'"}')
    # default Status = Backlog
    if st_fid and "Backlog" in st_opt:
        set_val(item, st_fid, '{singleSelectOptionId:"'+st_opt["Backlog"]+'"}')
print(f"  set points on {n_pts} items; posture + Status=Backlog on all.")

print(f"\nDone. Project #{pnum}. Finish in the UI:")
print("  - Sprint: set the iteration field to 1-week duration (or add it if the API skipped it).")
print("  - Create views: Current Sprint (board by Status) · Sprint Planning (table by Sprint) ·")
print("    Epic Breakdown (board by parent) · Roadmap (by Milestone) · Decisions (filter label:type:decision).")
