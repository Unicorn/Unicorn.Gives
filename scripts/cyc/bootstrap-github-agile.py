#!/usr/bin/env python3
"""
Idempotent bootstrap of the CYC Platform agile backlog on GitHub.

Creates: label taxonomy, phase milestones, pillar/foundation epics, Phase 0 + MVP
stories (with acceptance criteria, labels, points, epic + decision back-refs), and
human-in-the-loop decision issues. Re-runnable: matches existing issues by exact title.

Usage:
  REPO=Unicorn/Unicorn.Gives python3 scripts/cyc/bootstrap-github-agile.py [--what-if]

Projects v2 (board/iterations/points field) is NOT created here — it needs the `project`
OAuth scope (`gh auth refresh -s project,read:project`). See bootstrap-github-project.sh.
"""
import json, os, subprocess, sys, time

REPO = os.environ.get("REPO", "Unicorn/Unicorn.Gives")
WHATIF = "--what-if" in sys.argv

def gh(*args, capture=True, check=True):
    if WHATIF and args and args[0] in ("issue", "label", "api") and any(
        a in ("create", "edit", "-X", "POST", "PATCH") for a in args):
        # only mutate-guard the create/edit paths; reads still run
        if args[0] == "issue" and args[1] in ("create", "edit"):
            print("  [what-if]", " ".join(str(a) for a in args)[:120]); return ""
        if args[0] == "label" and args[1] == "create":
            print("  [what-if] label", args[2]); return ""
    r = subprocess.run(["gh", *[str(a) for a in args]],
                       capture_output=capture, text=True)
    if check and r.returncode != 0 and "already exists" not in (r.stderr or ""):
        print("ERR:", " ".join(str(a) for a in args), "\n", r.stderr, file=sys.stderr)
    return (r.stdout or "").strip()

# ---------------------------------------------------------------- LABELS
LABELS = []
def L(names, color, desc):
    for n in names.split():
        LABELS.append((n, color, desc))
L("type:epic type:story type:task type:spike type:decision", "1d76db", "Issue kind")
L("pillar:foundation pillar:migration pillar:registration pillar:profiles pillar:privacy "
  "pillar:pos pillar:attendance pillar:reporting pillar:kiosk pillar:notes-flags "
  "pillar:incident pillar:notifications pillar:mentoring pillar:gamification",
  "0e8a16", "Roadmap pillar")
L("posture:reuse posture:adapt posture:extend posture:leverage posture:build posture:reference",
  "5319e7", "Build posture (from reuse matrix)")
L("area:frontend area:backend area:data area:infra area:design area:compliance",
  "006b75", "Skill area")
L("P0-blocker", "b60205", "Priority"); L("P1-high", "d93f0b", "Priority")
L("P2-medium", "fbca04", "Priority"); L("P3-low", "c2e0c6", "Priority")
L("needs-decision", "e99695", "Blocked on a human-in-the-loop decision")
L("reusable-package", "bfdadc", "Ship as an open-source NPM package")
L("security", "b60205", "Security / privacy sensitive")

# ---------------------------------------------------------------- MILESTONES
P0, MVP, P1, P2, P3 = (
    "Phase 0 - Foundation & Migration", "MVP - Replace Antaris",
    "Phase 1 - Operational Depth", "Phase 2 - Engagement & Retention", "Phase 3 - R&D")
MILESTONES = [
    (P0,  "CYC vertical stood up on the Scaffald chassis; off Antaris cleanly."),
    (MVP, "Minimum to fully migrate off Antaris."),
    (P1,  "Notes/flags, incident log, event check-in, notifications."),
    (P2,  "Gamification, mentoring, portfolio view."),
    (P3,  "Academic-data integration; CCTV/AI (jurisdiction-gated)."),
]

# ---------------------------------------------------------------- EPICS
# key: (title, pillar-label, milestone, posture-summary)
EPICS = {
 "FND": ("E-FND Foundation & Chassis", "pillar:foundation", P0, "Reuse/Adapt Scaffald + Build guardian model"),
 "MIG": ("E-MIG Data Migration", "pillar:migration", P0, "Build (+ maybe reuse E&L Antaris importer)"),
 "REG": ("E-REG Registration & Scheduling", "pillar:registration", MVP, "Build"),
 "PRO": ("E-PRO Profiles & Data", "pillar:profiles", MVP, "Adapt + Build"),
 "PRV": ("E-PRV Privacy & Disclosures", "pillar:privacy", MVP, "Build (reusable pkg)"),
 "POS": ("E-POS POS / Billing", "pillar:pos", MVP, "Build on Stripe"),
 "ATT": ("E-ATT Attendance & Drops", "pillar:attendance", MVP, "Build"),
 "REP": ("E-REP Reporting & Exports", "pillar:reporting", MVP, "Build (reusable pkg)"),
 "KSK": ("E-KSK Kiosk / Paperless", "pillar:kiosk", MVP, "Build"),
 "NOT": ("E-NOT Notes & Flags", "pillar:notes-flags", P1, "Build (reusable pkg)"),
 "INC": ("E-INC Incident Log", "pillar:incident", P1, "Build"),
 "NTF": ("E-NTF Notifications", "pillar:notifications", P1, "Reuse Scaffald"),
 "MNT": ("E-MNT Mentoring & Referrals", "pillar:mentoring", P2, "Build (greenfield)"),
 "GAM": ("E-GAM Gamification", "pillar:gamification", P2, "Build (reusable pkg)"),
 "ACA": ("E-ACA Academic Data Integration (Clever/Infinite Campus, waiver-based)", "pillar:mentoring", P3, "Leverage (E&L WBL bridge) - R&D"),
 "CTV": ("E-CTV Ethical Attendance via CCTV/AI (jurisdiction-gated)", "pillar:attendance", P3, "Build - R&D, jurisdiction-gated"),
}

# ---------------------------------------------------------------- DECISIONS
# key: (title, owner, blocks-text, milestone)
DECISIONS = {
 "D1": ("Decision: CYC as app-in-monorepo vs. clean fork of UNI-Construct", "Clay", "E-FND foundation layout", P0),
 "D2": ("Decision: youth profiles in Scaffald from day one (spec divergence)", "Clay / Matt", "E-PRO profile model", P0),
 "D3": ("Decision: Earn & Learn integration depth (data-sync vs. build partner API)", "E&L team", "E-REP, E-MNT leverage", MVP),
 "D4": ("Decision: migration routing (Antaris->Scaffald vs. via E&L importer)", "Clay", "E-MIG import pipeline", P0),
 "D5": ("Decision: split-family billing model on Stripe (Connect vs. multi-customer)", "Eng", "E-POS split billing", MVP),
 "D6": ("Decision: ship funder report as an early standalone slice?", "Matt", "E-REP sequencing", MVP),
 "D7": ("Decision: flag/incident taxonomy (categories, colors, banner hierarchy, decay)", "Matt / Arti", "E-NOT, E-INC", P1),
}

# ---------------------------------------------------------------- STORIES
# (epic, title, acceptance, [labels], points, milestone, [blocked_by decision keys])
def S(e,t,a,l,p,m,b=None): return (e,t,a,l.split(),p,m,b or [])
STORIES = [
 # --- FND (Phase 0)
 S("FND","[FND] Stand up CYC surface + Supabase project on the Scaffald chassis",
   "CYC app builds & deploys; Supabase project wired to the Scaffald monorepo.",
   "type:story posture:reuse area:infra",8,P0,["D1"]),
 S("FND","[FND] Define CYC RBAC roles (youth, guardian, coach, admin/super, funder)",
   "Roles extend Scaffald RBAC; super-admin acts across scopes; enforced by RLS.",
   "type:story posture:adapt area:backend",5,P0,["D1"]),
 S("FND","[FND] Guardian + minor data model (guardians, guardian_student, consent) + RLS",
   "Multi-guardian per child; multiple children per guardian; separated permissions; ref E&L design.",
   "type:story posture:build area:data reusable-package",8,P0,["D1"]),
 S("FND","[FND] Consent workflow (publicity / profile-edit, multi-guardian approval)",
   "Request/response, expiry, >=13 self-manage; references E&L consent model.",
   "type:story posture:build area:backend",5,P0),
 S("FND","[FND] Minor->18 claim state machine (visibility flip, guardian detach)",
   "At 18 the user claims the profile; guardian visibility toggles off; no cross-system move.",
   "type:story posture:build area:backend",5,P0,["D2"]),
 # --- MIG (Phase 0)
 S("MIG","[MIG] Spike: obtain Antaris export + map fields to CYC schema",
   "CA data-ownership request drafted; field map documented; transformation gaps noted.",
   "type:spike area:data",5,P0),
 S("MIG","[MIG] Import pipeline: Antaris export -> CYC profiles",
   "Idempotent import with a dry-run report.",
   "type:story posture:build area:data",8,P0,["D4"]),
 S("MIG","[MIG] \"Claim your profile\" email/SMS blast",
   "Carries email/phone from export; reuses Scaffald notifications.",
   "type:story posture:reuse area:backend",5,P0),
 S("MIG","[MIG] Mismatch manual-review queue (~5%)",
   "Flagged records route to a review UI; threshold configurable.",
   "type:story posture:build area:frontend",5,P0),
 S("MIG","[MIG] First-login completeness-gating onboarding",
   "Collects missing required fields + disclosures on first login.",
   "type:story posture:build area:frontend",5,P0),
 # --- PRO (MVP)
 S("PRO","[PRO] Student profile adapted for minors (DOB, guardian visibility)",
   "Scaffald profile + minor fields; guardian-visible while <18.",
   "type:story posture:adapt area:backend",5,MVP,["D2"]),
 S("PRO","[PRO] Student<->guardian linking UI",
   "Attach multiple children; multiple guardians; relationship types.",
   "type:story posture:build area:frontend",5,MVP,["D2"]),
 S("PRO","[PRO] Completeness-gating engine (reusable package)",
   "Profile can't finalize until required fields set; config-driven.",
   "type:story posture:build area:backend reusable-package",8,MVP),
 S("PRO","[PRO] CYC required-field set + annual progressive update",
   "School/language/ethnicity/etc.; yearly re-confirm on school-year boundary.",
   "type:story posture:build area:backend",3,MVP),
 # --- PRV (MVP)
 S("PRV","[PRV] Field -> report -> disclosure mapping config",
   "Each field declares why collected / who sees it.",
   "type:story posture:build area:compliance reusable-package",5,MVP),
 S("PRV","[PRV] (i) disclosure UI on profile fields",
   "Icon + explanation per field; who-can-see.",
   "type:story posture:build area:frontend",3,MVP),
 S("PRV","[PRV] Sensitive-field storage + RLS (sex-at-birth, pronouns, diagnoses)",
   "Column-level access; permitted roles only; always disclosed.",
   "type:story posture:build area:data security",5,MVP),
 # --- REG (MVP)
 S("REG","[REG] Class/program model + seat caps",
   "Programs, sessions, hard capacity.",
   "type:story posture:build area:backend",5,MVP),
 S("REG","[REG] Timed registration window (open + auto-close on full)",
   "Staff sets open time; auto-closes at cap.",
   "type:story posture:build area:backend",5,MVP),
 S("REG","[REG] First-come registration flow (concert-ticket)",
   "Guardian registers child when window opens; race-safe.",
   "type:story posture:build area:frontend",8,MVP),
 S("REG","[REG] Waitlist on cancellation",
   "Seat frees -> next in line offered.",
   "type:story posture:build area:backend",3,MVP),
 S("REG","[REG] Staff override / manual move + drop outside windows",
   "Admin shuffles enrollments any time.",
   "type:story posture:build area:frontend",5,MVP),
 # --- POS (MVP)
 S("POS","[POS] Multiple cards on file per account",
   "Add/remove cards; two emails per account.",
   "type:story posture:extend area:backend",5,MVP),
 S("POS","[POS] Split-family billing (guardian claims payments)",
   "Different guardians pay for different classes; each can claim any payment for connected children.",
   "type:story posture:build area:backend",8,MVP,["D5"]),
 S("POS","[POS] Two-guardian separated billing access",
   "Guardians see only their own payment methods.",
   "type:story posture:build area:backend security",5,MVP),
 # --- ATT (MVP)
 S("ATT","[ATT] Tablet roll-call UI (tap to mark present)",
   "Fast per-roster check-off on tablet/phone.",
   "type:story posture:build area:frontend",5,MVP),
 S("ATT","[ATT] Excused / unexcused tracking",
   "Mark + reason.",
   "type:story posture:build area:backend",3,MVP),
 S("ATT","[ATT] Configurable-N unexcused -> drop report",
   "Threshold configurable; flags at-risk.",
   "type:story posture:build area:backend",3,MVP),
 S("ATT","[ATT] One-click monthly missed-class list",
   "Per program/month export.",
   "type:story posture:build area:frontend",2,MVP),
 # --- REP (MVP)
 S("REP","[REP] Demographic capture model (sex-at-birth/pronouns, ethnicity, language, ZIP, age)",
   "Captured at registration; queryable; MVP-blocking per compliance doc.",
   "type:story posture:build area:data area:compliance",5,MVP),
 S("REP","[REP] Funder-export engine (arbitrary-field filter) (reusable package)",
   "Filter members by any field; CSV/PDF out.",
   "type:story posture:build area:backend reusable-package",8,MVP),
 S("REP","[REP] Priority Workforce Board / Measure-X report template",
   "District-4 ZIP + demographics; one-click; ref E&L regime pattern.",
   "type:story posture:build area:compliance P1-high",5,MVP,["D6","D3"]),
 # --- KSK (MVP)
 S("KSK","[KSK] In-center kiosk registration flow",
   "Tablet mode for paper-preferring parents.",
   "type:story posture:build area:frontend",5,MVP),
 S("KSK","[KSK] E-signature + digital packet capture",
   "Sign consent/waivers on kiosk; stored + versioned.",
   "type:story posture:build area:compliance",5,MVP),
]

# ---------------------------------------------------------------- EXECUTE
def existing_issue_titles():
    out = gh("issue","list","--repo",REPO,"--state","all","--limit","300",
             "--json","number,title")
    m = {}
    for it in json.loads(out or "[]"):
        m[it["title"]] = it["number"]
    return m

def ensure_labels():
    print(f"Labels ({len(LABELS)})...")
    for n,c,d in LABELS:
        gh("label","create",n,"--repo",REPO,"--color",c,"--description",d,"--force")

def ensure_milestones():
    print("Milestones...")
    have = {m["title"] for m in json.loads(
        gh("api",f"repos/{REPO}/milestones","--paginate") or "[]")}
    for t,d in MILESTONES:
        if t in have: print("  =",t); continue
        if WHATIF: print("  [what-if] milestone",t); continue
        gh("api",f"repos/{REPO}/milestones","-X","POST","-f",f"title={t}","-f",f"description={d}")
        print("  +",t)

def create_issue(title, body, labels, milestone, have):
    if title in have:
        print("  =",title[:70]); return have[title]
    args = ["issue","create","--repo",REPO,"--title",title,"--body",body,"--milestone",milestone]
    for l in labels: args += ["--label",l]
    url = gh(*args)
    if WHATIF: return None
    num = int(url.rsplit("/",1)[-1]) if url.rsplit("/",1)[-1].isdigit() else None
    print("  +",f"#{num}",title[:66]); time.sleep(0.2)
    return num

def main():
    print(f"Repo: {REPO}  {'(WHAT-IF)' if WHATIF else ''}")
    ensure_labels(); ensure_milestones()
    have = existing_issue_titles()

    print("Decisions...")
    dnum = {}
    for k,(title,owner,blocks,ms) in DECISIONS.items():
        body = f"**Decision needed.** Owner: **{owner}**.\n\nBlocks: {blocks}.\n\n" \
               f"Context: see `docs/cyc-platform/roadmap/09-open-decisions.md`.\n\n_{k}_"
        dnum[k] = create_issue(title, body, ["type:decision","needs-decision"], ms, have)

    print("Epics...")
    enum = {}
    for k,(title,pillar,ms,posture) in EPICS.items():
        body = f"**Epic.** Posture: {posture}.\n\nPillar tracking issue; stories are listed below " \
               f"once created.\n\nSee `docs/cyc-platform/roadmap/05-feature-pillars.md`."
        enum[k] = create_issue(title, body, ["type:epic",pillar], ms, have)

    print("Stories...")
    epic_children = {k: [] for k in EPICS}
    for epic,title,acc,labels,pts,ms,blocked in STORIES:
        refs = ""
        if enum.get(epic): refs += f"\nEpic: #{enum[epic]}"
        bl = [dnum[b] for b in blocked if dnum.get(b)]
        used_labels = list(labels)
        if bl:
            refs += "\nBlocked by " + ", ".join(f"#{n}" for n in bl)
            if "needs-decision" not in used_labels: used_labels.append("needs-decision")
        body = f"**User story.**\n\n**Acceptance:** {acc}\n\n**Points:** {pts}{refs}"
        num = create_issue(title, body, used_labels, ms, have)
        if num and enum.get(epic): epic_children[epic].append((num,title,pts))

    if not WHATIF:
        print("Linking stories under epics...")
        for k,kids in epic_children.items():
            if not kids or not enum.get(k): continue
            title,pillar,ms,posture = EPICS[k]
            lines = "\n".join(f"- [ ] #{n} ({p} pts)" for n,t,p in kids)
            total = sum(p for _,_,p in kids)
            body = f"**Epic.** Posture: {posture}.  Milestone: {ms}.\n\n" \
                   f"See `docs/cyc-platform/roadmap/05-feature-pillars.md`.\n\n" \
                   f"### Stories ({len(kids)}, {total} pts)\n{lines}"
            gh("issue","edit",str(enum[k]),"--repo",REPO,"--body",body)
            print("  ~",title[:60],f"({len(kids)} stories)")
    print("Done.")

if __name__ == "__main__":
    main()
