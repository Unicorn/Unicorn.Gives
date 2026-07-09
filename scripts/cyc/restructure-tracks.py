#!/usr/bin/env python3
"""
Restructure the CYC backlog into Product (SME) + Delivery (engineering) tracks.

Implements docs/cyc-platform/roadmap/11-product-delivery-tracks.md. Idempotent.

  - new labels: track:*, type:discovery, persona:*, sme-review
  - create user-story (type:story) + Define (type:discovery) issues, plain-language, SME-tagged
  - re-type the 34 existing items -> type:task (+ keep spike) + track:engineering
  - re-parent feature tasks under their user story (sub-issues); stories under their epic
  - cross-reference Define issues <-> their tasks in bodies

Usage: REPO=Unicorn/Unicorn.Gives python3 scripts/cyc/restructure-tracks.py [--what-if]
"""
import json, os, re, subprocess, sys
REPO=os.environ.get("REPO","Unicorn/Unicorn.Gives"); OWNER="Unicorn"
WHATIF="--what-if" in sys.argv
def sh(a):
    r=subprocess.run(a,capture_output=True,text=True); return r
def gql(q):
    r=sh(["gh","api","graphql","-f","query="+q])
    if r.returncode!=0: raise RuntimeError(r.stderr)
    return json.loads(r.stdout)["data"]

P0,MVP,P1,P2,P3=("Phase 0 - Foundation & Migration","MVP - Replace Antaris",
    "Phase 1 - Operational Depth","Phase 2 - Engagement & Retention","Phase 3 - R&D")
PMS={"foundation":P0,"migration":P0,"registration":MVP,"profiles":MVP,"privacy":MVP,"pos":MVP,
     "attendance":MVP,"reporting":MVP,"kiosk":MVP,"notes-flags":P1,"incident":P1,"notifications":P1,
     "mentoring":P2,"gamification":P2}
# academic/cctv epics use mentoring/attendance pillar labels but Phase 3 milestone:
P3_EPICS={71:"mentoring",72:"attendance"}

# ---- LABELS ----
LABELS=[("track:product","1f6feb","Discovery / SME-facing"),
        ("track:engineering","5319e7","Delivery / engineering"),
        ("type:discovery","d4c5f9","SME domain-definition issue"),
        ("sme-review","fbca04","SME input wanted"),
        ("persona:admin","0e8a16",""),("persona:coach","0e8a16",""),
        ("persona:parent","0e8a16",""),("persona:student","0e8a16",""),
        ("persona:funder","0e8a16","")]

# ---- USER STORIES ----  key:(pillar,persona,title,accept,tasks[])
STORIES={
 "REG-parent":("registration","parent","Register my child first-come when a class opens",
    "A guardian can enroll a connected child the moment a class window opens; race-safe.",[56]),
 "REG-admin":("registration","admin","Open a timed class with a seat cap; shuffle/drop outside windows",
    "Admin sets an open time + hard cap that auto-closes, and can move/drop kids any time.",[54,55,57,58]),
 "PRO-parent":("profiles","parent","Complete my child's profile once and link multiple children/guardians",
    "One guardian completes a profile; multiple children and co-guardians can be attached.",[47,48,50]),
 "PRO-student":("profiles","student","Have one profile across all programs",
    "A student sees a single profile spanning every CYC program.",[49]),
 "PRV-family":("privacy","parent","See why each field is collected and who can see it",
    "Every field shows an (i) disclosure: purpose, which report it feeds, who can view it.",[51,52,53]),
 "POS-parent":("pos","parent","Keep cards on file and pay only for the classes I'm responsible for",
    "Guardians manage cards; different guardians pay for different classes and claim their own payments.",[59,60,61]),
 "ATT-coach":("attendance","coach","Take roll on a tablet with one tap; mark excused/unexcused",
    "A coach checks off a roster fast on a tablet and flags excused vs unexcused.",[62,63]),
 "ATT-admin":("attendance","admin","Get a monthly missed-class list and auto-drop after N unexcused",
    "Admin sees who missed this month; students auto-flag for drop after a configurable N.",[64,65]),
 "REP-funder":("reporting","funder","Pull the Measure-X / Workforce Board report by ZIP + demographics",
    "A funder pulls the District-4 / Measure-X report from captured data, no hand-compiling.",[66,68]),
 "REP-admin":("reporting","admin","Filter members by any field",
    "Admin filters the member base on arbitrary fields and exports.",[67]),
 "KSK-parent":("kiosk","parent","Complete registration and e-sign on an in-center kiosk",
    "A paper-preferring parent finishes registration + signs packets on a center tablet.",[69,70]),
 # Phase 1-3 stories (tasks decomposed later)
 "NOT-coach":("notes-flags","coach","See the 1-2 critical flags on a student; leave permissioned notes",[]),
 "INC-coach":("incident","coach","Log an incident that travels with the student, with prior context",[]),
 "NTF-parent":("notifications","parent","Be notified of cancellations, school-transition prompts, card links",[]),
 "MNT-coach":("mentoring","coach","Auto-match struggling students to a mentor; capture referrals incl. WIOA",[]),
 "GAM-student":("gamification","student","Earn badges/streaks, unlock avatar gear, appear on CYC TV",[]),
}
# handle 3-item vs 4-item tuples
def story_fields(v):
    pillar,persona,title=v[0],v[1],v[2]
    accept=v[3] if len(v)>4 else (v[3] if len(v)==5 else "")
    tasks=v[-1]
    # normalize: tuples are (pillar,persona,title,accept,tasks) or (pillar,persona,title,tasks)
    if isinstance(v[3],list): accept=""; tasks=v[3]
    else: accept=v[3]; tasks=v[4]
    return pillar,persona,title,accept,tasks

# ---- DEFINE ISSUES ----  key:(pillar,title,sme,informs_tasks[])
DEFINES={
 "FND":("foundation","Role & permission matrix — who sees protected notes / incidents / PII","Operations",[38]),
 "MIG":("migration","Migration trust threshold & mismatch handling","Operations",[43,45]),
 "REG":("registration","Registration rules — seat caps, window timing, waitlist, override policy","Operations",[54,55,57,58]),
 "PRO":("profiles","Required fields + annual progressive-update cadence","Operations / Compliance",[50]),
 "PRV":("privacy","Field -> report -> disclosure mapping + sensitive-field access policy","Sarah",[51,53]),
 "POS":("pos","Split-family billing rules — who claims what, card mgmt, fees","Operations / Finance",[60]),
 "ATT":("attendance","Attendance rules — excused vs unexcused, drop threshold N, cadence","Gina",[63,64]),
 "REP":("reporting","Funder report fields + demographic taxonomy — Measure-X, WIOA, gender/sex","Sarah",[66,68]),
 "KSK":("kiosk","Kiosk flow + digital packet / e-signature content","Operations / Legal",[70]),
 "NOT":("notes-flags","Flag/incident taxonomy — categories, colors, banner hierarchy, permissions (supersedes #22)","Gina",[]),
 "INC":("incident","Incident categories, visibility (content vs count per role), time-decay","Gina / Safety",[]),
 "NTF":("notifications","Notification triggers & timing","Operations",[]),
 "MNT":("mentoring","Mentor-match triggers + referral / WIOA capture","Gina / Compliance",[]),
 "GAM":("gamification","Reward model — what earns badges, unlock tree","Program / youth",[]),
 "ACA":("mentoring","Academic-data consent/waiver model + which data (Phase 3)","Compliance / Legal",[]),
 "CTV":("attendance","CCTV/AI jurisdiction gating + consent policy (Phase 3)","Compliance / Legal",[]),
}
TASKS=list(range(37,71))  # 37..70 existing items

def existing_by_title():
    out=sh(["gh","issue","list","--repo",REPO,"--state","all","--limit","300",
            "--json","number,title,id,labels"]).stdout
    m={};
    for it in json.loads(out): m[it["title"]]=it
    return m

def create(title,body,labels,ms):
    if WHATIF: print(f"  + [{ms[:6]}] {title[:72]}  {{{','.join(labels)}}}"); return None
    a=["gh","issue","create","--repo",REPO,"--title",title,"--body",body,"--milestone",ms]
    for l in labels: a+=["--label",l]
    url=sh(a).stdout.strip(); num=url.rsplit("/",1)[-1]
    print("  +",f"#{num}",title[:66]); return int(num) if num.isdigit() else None

def main():
    print(f"Repo {REPO}  {'(WHAT-IF)' if WHATIF else ''}")
    print("Labels:")
    for n,c,d in LABELS:
        if WHATIF: print("   ",n)
        else: sh(["gh","label","create",n,"--repo",REPO,"--color",c,"--description",d,"--force"])
    have=existing_by_title()
    node={it["number"]:it["id"] for it in [v for v in have.values()] if "number" in it}
    # need node ids by number too
    allnum={it["number"]:it for it in have.values()}

    # 1. user stories
    print("User stories:")
    story_num={}
    for key,v in STORIES.items():
        pillar,persona,title,accept,tasks=story_fields(v)
        code=key.split("-")[0]
        full=f"[{code}] Story ({persona.title()}): {title}"
        ms=P3 if False else PMS[pillar]
        body=(f"**User story.** As a **{persona}**, I can **{title.lower()}**.\n\n"
              f"**Acceptance:** {accept or 'see linked tasks'}\n\n"
              f"_Discovery track — SME review welcome. Delivery tasks are linked as sub-issues._")
        labels=["type:story","track:product","sme-review",f"persona:{persona}",f"pillar:{pillar}"]
        story_num[key]=allnum[full]["number"] if full in allnum else create(full,body,labels,ms)

    # 2. define issues
    print("Define issues:")
    def_num={}
    for key,(pillar,title,sme,informs) in DEFINES.items():
        full=f"[{key}] Define: {title}"
        ms=P3 if key in ("ACA","CTV") else PMS[pillar]
        inf=(" Informs: "+", ".join(f"#{t}" for t in informs)) if informs else ""
        body=(f"**Discovery / definition.** SME owner: **{sme}**.\n\n"
              f"Capture the domain rules/taxonomy/fields engineering needs.{inf}\n\n"
              f"_Product track — this unblocks the linked delivery tasks._")
        labels=["type:discovery","track:product","sme-review",f"pillar:{pillar}"]
        def_num[key]=allnum[full]["number"] if full in allnum else create(full,body,labels,ms)

    # 3. re-type existing tasks
    print("Re-type existing -> type:task + track:engineering:")
    for n in TASKS:
        it=allnum.get(n)
        if not it: continue
        names=[l["name"] for l in it["labels"]]
        add=[l for l in ["type:task","track:engineering"] if l not in names]
        if "type:spike" in names: add=[l for l in add if l!="type:task"]  # keep spike
        rm=[l for l in ["type:story"] if l in names]
        if WHATIF:
            if add or rm: print(f"   #{n}: +{add} -{rm}")
            continue
        a=["gh","issue","edit",str(n),"--repo",REPO]
        for l in add: a+=["--add-label",l]
        for l in rm: a+=["--remove-label",l]
        if add or rm: sh(a)

    # 4. sub-issue links: re-parent feature tasks under their story; stories under epic
    epics={l:allnum.get(n) for n,l in [(23,"foundation"),(24,"migration"),(25,"registration"),
        (26,"profiles"),(27,"privacy"),(28,"pos"),(29,"attendance"),(30,"reporting"),(31,"kiosk"),
        (32,"notes-flags"),(33,"incident"),(34,"notifications"),(35,"mentoring"),(36,"gamification")]}
    if WHATIF:
        n=sum(len(story_fields(v)[4]) for v in STORIES.values())
        print(f"Sub-issue links: {len([s for s in story_num])} stories under epics; ~{n} tasks re-parented under stories (skipped in what-if)")
    else:
        allnum={it["number"]:it for it in existing_by_title().values()}  # re-fetch: new stories/defines now exist
        def nid(num): return allnum[num]["id"] if num in allnum else None
        for key,v in STORIES.items():
            pillar,persona,title,accept,tasks=story_fields(v)
            sid=nid(story_num[key]) if story_num.get(key) else None
            eid=epics[pillar]["id"] if epics.get(pillar) else None
            if sid and eid:
                gql('mutation{addSubIssue(input:{issueId:"%s",subIssueId:"%s"}){subIssue{number}}}'%(eid,sid))
            for t in tasks:
                tid=nid(t)
                if sid and tid:
                    # remove from epic parent, add under story
                    if eid:
                        sh(["gh","api","graphql","-f","query="+
                            'mutation{removeSubIssue(input:{issueId:"%s",subIssueId:"%s"}){issue{number}}}'%(eid,tid)])
                    gql('mutation{addSubIssue(input:{issueId:"%s",subIssueId:"%s"}){subIssue{number}}}'%(sid,tid))
        print("  sub-issue tree built")
    print("Done." if not WHATIF else "What-if complete.")

if __name__=="__main__": main()
