# Unicorn.Gives: County-Wide Community Hub — Implementation Plan

## Vision

Transform unicorn.gives from a Lincoln Township mirror into **the** one-stop resource for Clare County residents. Not another informational site — a **problem-solving** platform that guides people through real scenarios: yard violation notices, building permits, native plant conservation, property taxes, and more.

---

## The Problem We're Solving

Clare County's digital presence is **fragmented across 10+ websites**:

| Source | What it has | What's broken |
|--------|-------------|---------------|
| lincolntwp.com | Deep ordinance/permit/FAQ content | Behind Cloudflare, volunteer-run, stale |
| lincolntwp.net | Board minutes, basic contacts | "Under Construction," missing 80% of .com content |
| clareco.net | 25 departments, courts, sheriff, elections | Fragments across 7+ separate domains |
| clareco-buildingdev.net | Building permits, zoning | Barely renders, JS-heavy, hard to navigate |
| clarecountycleaver.net | Local news, meeting coverage | Heavy syndicated filler, sporadic sheriff reports |
| clarecd.org | Conservation, native plants, forestry | Good content but isolated from everything else |
| clareclerkrod.com | Vital records, elections, land records | Separate domain from county |
| clarecrc.com | Road commission, permits, construction | Another separate domain |
| clarecoseniors-coa.net | Senior services | Yet another separate domain |

**Residents have to know which of 10+ websites to visit before they can even ask their question.** We fix that.

---

## Architecture: Four Pillars

### 1. SOLVE (Problem-First Navigation)
The centerpiece. Users arrive with a problem — we route them to answers.

### 2. GOVERN (Transparency & Accountability)
Government data aggregated from township + county sources.

### 3. INFORM (Filtered News & Alerts)
Only news that matters: ordinance changes, crime stats, government actions, public hearings.

### 4. CONNECT (Community Without Social Media)
Events, conservation, senior services, community organizations — without needing Facebook.

---

## Phase 1: Foundation & Problem-Solver Engine

### 1.1 — Problem-Solver Navigation System
**The killer feature.** A guided-navigation / FAQ-tree system that replaces traditional menus with scenario-based routing.

**Content collection: `src/content/guides/`**

Schema:
```typescript
const guidesCollection = defineCollection({
  schema: z.object({
    title: z.string(),                    // "I got a yard/blight notice"
    description: z.string(),              // SEO + preview text
    category: z.enum([
      'property',        // Building, zoning, permits, violations
      'taxes',           // Assessment, payment, exemptions
      'safety',          // Fire, sheriff, emergencies
      'nature',          // Conservation, native plants, lakes, parks
      'government',      // Elections, FOIA, meetings, ordinances
      'services',        // Seniors, transit, veterans, animal control
      'records',         // Vital records, land records, court
    ]),
    scenario: z.string(),                 // User-facing question
    relatedGuides: z.array(z.string()).optional(),
    jurisdiction: z.enum(['township', 'county', 'state', 'federal']).optional(),
    contacts: z.array(z.object({
      name: z.string(),
      role: z.string(),
      phone: z.string().optional(),
      email: z.string().optional(),
    })).optional(),
    forms: z.array(z.object({
      name: z.string(),
      url: z.string(),
      format: z.string().optional(),
    })).optional(),
    lastVerified: z.string(),
  }),
});
```

**Priority guides to write (Phase 1 — 20 guides):**

**Property & Building:**
1. "I got a blight/nuisance notice — what do I do?"
2. "I want to build a pole barn / accessory building on my property"
3. "I need a building permit — where do I start?"
4. "I want to put an RV or temporary storage on my vacant lot"
5. "I want to divide/split my property"
6. "I need a zoning variance — how does that work?"
7. "What are the setback requirements for my property?"

**Taxes & Assessment:**
8. "How do I pay my property taxes?"
9. "I think my property assessment is wrong — how do I appeal?"
10. "How do I claim the principal residence exemption?"
11. "What is the Qualified Forest Program and can I save on taxes?"

**Nature & Conservation:**
12. "I want to support conservation with native plants — how?"
13. "I have spongy moths / invasive species on my property"
14. "I need a soil erosion permit for my project near water"
15. "I want free forestry advice for my property"

**Safety & Emergency:**
16. "How do I get a burn permit?"
17. "How do I sign up for emergency alerts?"
18. "I need to report a non-emergency to the sheriff"

**Government & Records:**
19. "How do I submit a FOIA request?"
20. "How do I register to vote or get an absentee ballot?"

**Component: `GuideFinder.astro`**
- Homepage hero becomes a search/browse interface: "What do you need help with?"
- Category cards with icons lead to filtered guide lists
- Each guide page has: plain-language walkthrough, step-by-step actions, relevant contacts with phone/email, downloadable forms, related guides, jurisdiction badges

**Route: `/help/[slug]`**

### 1.2 — Restructured Navigation

Replace current 5-category nav with pillar-based structure:

```
SOLVE           GOVERN              INFORM           CONNECT
├── Property    ├── Lincoln Twp     ├── News          ├── Events
├── Taxes       │   ├── Board       ├── Public Notices ├── Unicorn Gives
├── Safety      │   ├── Minutes     ├── Crime Reports  ├── The Horn
├── Nature      │   ├── Ordinances  └── Ordinance      ├── The Mane
├── Government  │   ├── Budget          Changes        ├── Conservation
├── Services    │   └── Zoning                         ├── Seniors
└── Records     ├── Clare County                       ├── Parks & Lakes
                │   ├── Commissioners                  └── Veterans
                │   ├── Departments
                │   ├── Courts
                │   └── Sheriff
                └── Elections
```

### 1.3 — Contact Directory
**Collection: `src/content/contacts/`**

Unified directory of every relevant official, department, and service across township + county. Searchable, categorized, with office hours.

Schema:
```typescript
const contactsCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    role: z.string(),
    department: z.string(),
    jurisdiction: z.enum(['township', 'county', 'state']),
    phone: z.string().optional(),
    phoneExt: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    hours: z.string().optional(),
    website: z.string().optional(),
  }),
});
```

**Seed data from research:**
- 5 Lincoln Twp board members + 4 staff
- 9 county commissioners
- 15+ county department heads
- Court officials
- Conservation district staff
- Road commission, drain commissioner, etc.

---

## Phase 2: Governance Transparency Layer

### 2.1 — Ordinance Library
**Collection: `src/content/ordinances/`**

Schema:
```typescript
const ordinancesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    number: z.number(),
    description: z.string(),
    category: z.enum(['zoning', 'public-safety', 'environment', 'property', 'infrastructure', 'general']),
    adoptedDate: z.string().optional(),
    amendedDate: z.string().optional(),
    pdfUrl: z.string().optional(),
    summary: z.string(),  // Plain-language summary of what the ordinance means
    jurisdiction: z.enum(['township', 'county']),
  }),
});
```

**Initial content (16 Lincoln Twp ordinances):**
- Ord. 22: Boating → environment
- Ord. 26: Noise → public-safety
- Ord. 27: Land Division → property
- Ord. 29: Control of Dogs → public-safety
- Ord. 32: Nuisance & Blight → property
- Ord. 38: Lake, Dock & Boat → environment
- Ord. 39: Flood Plain Management → environment
- Ord. 41: Fireworks Control → public-safety
- Ord. 44: Zoning Ordinance → zoning
- Ord. 46: Marijuana Establishments → general
- (and 6 more)

Each ordinance page: plain-language summary + link to full PDF + related guides.

**Route: `/ordinances/` and `/ordinances/[slug]`**

### 2.2 — Enhanced Minutes Archive
Already have 35 minutes entries. Enhance with:
- Full-text search across minutes
- County commissioner meeting summaries (scrape from clareco.net videos/agendas)
- Planning commission + ZBA minutes (currently "coming soon" on lincolntwp.net)
- Tag extraction: votes, motions, financial figures

### 2.3 — Budget & Financial Dashboard
- Annual township budget documents
- Tax rates and millage breakdowns
- SAD (Special Assessment District) information for lakes
- Links to county municipal performance dashboard (bsaonline.com)

### 2.4 — Election Center
- Upcoming elections and deadlines
- How to register, absentee ballot process
- Who represents you (township board, county commissioners by district, state reps)
- Election results archive
- Inspector recruitment info

---

## Phase 3: Filtered News & Alerts

### 3.1 — News Aggregation (Curated, Not Scraped)
We won't auto-scrape the Cleaver or other outlets. Instead:

**Enhanced news collection with categories:**
```typescript
const newsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    category: z.enum([
      'ordinance-change',    // New/amended ordinances
      'government-action',   // Board votes, budget decisions
      'public-safety',       // Crime reports, sheriff stats, fire
      'public-notice',       // Hearings, meetings, deadlines
      'community',           // Events, organizations, conservation
      'infrastructure',      // Roads, utilities, construction
      'election',            // Election news, results, deadlines
    ]),
    source: z.string().optional(),       // Attribution
    sourceUrl: z.string().optional(),    // Link to original
    jurisdiction: z.enum(['township', 'county', 'state']).optional(),
    featured: z.boolean().optional(),
    impact: z.enum(['high', 'medium', 'low']).optional(),
  }),
});
```

**Content strategy:**
- Write original summaries of township/county board meeting actions
- Public hearing notices with plain-language explanations
- Ordinance change announcements with impact analysis
- Quarterly crime/safety stats from sheriff reports
- SAD hearing notices and outcomes
- Road construction and closure alerts

### 3.2 — Public Notice Board
Dedicated page for time-sensitive notices:
- Upcoming public hearings (zoning, SAD, budget)
- Meeting schedule changes
- Election deadlines
- Road closures
- Emergency alerts

**Route: `/notices/`**

---

## Phase 4: Community Hub (Connect Pillar)

### 4.1 — Events Calendar
**Collection: `src/content/events/`**

Schema:
```typescript
const eventsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    endDate: z.string().optional(),
    time: z.string().optional(),
    location: z.string(),
    category: z.enum([
      'government',      // Board meetings, hearings
      'community',       // Festivals, fundraisers
      'conservation',    // Plant sales, workdays, monitoring
      'seniors',         // Dining, activities
      'horn',            // The Horn events
      'unicorn-gives',   // Nonprofit events
    ]),
    recurring: z.boolean().optional(),
    recurrenceRule: z.string().optional(),  // "2nd Monday monthly"
    registrationUrl: z.string().optional(),
    cost: z.string().optional(),
  }),
});
```

**Seed events:**
- Township board meetings (2nd Monday monthly)
- Planning commission (1st Tuesday after 2nd Monday)
- County commissioner meetings (3rd Wednesday monthly)
- Conservation district board (3rd Tuesday monthly)
- Native plant sale pickups (May 7-9, May 21-23)
- Vernal pool monitoring (May 29)
- Senior dining (Mon-Fri)
- SAD public hearings

**Route: `/events/` with calendar view + list view**

### 4.2 — Conservation Resources Hub
Consolidate clarecd.org content into digestible pages:
- Native plant guide (link to conservation district catalog + ordering)
- Invasive species identification and management
- Free forestry consultation info
- Soil erosion permits explained
- Tool rental program
- Habitat education property info
- MAEAP for farmers
- Qualified Forest Program for landowners

### 4.3 — Community Organizations
- Unicorn Gives programs and volunteer opportunities
- The Horn events and membership
- The Mane services and booking
- Senior services and dining schedule
- Veterans services
- Animal shelter (adoption info, rabies clinics)

### 4.4 — Parks & Lakes Guide
Enhance existing pages with:
- Park amenities, rules, pavilion reservations
- Lake-specific info (access points, SAD status, ordinances)
- Conservation connection (native plants, water quality)

---

## Phase 5: Technical Infrastructure

### 5.1 — Search
Add client-side search (Pagefind or Fuse.js) across all content:
- Guides, ordinances, contacts, news, events, minutes
- "I need to..." search bar prominent on homepage

### 5.2 — Forms & Permits Hub
Centralized page linking to all downloadable forms:
- Township permits (building, plumbing, electrical, mechanical, zoning)
- County forms (FOIA, property transfer, voter registration)
- Conservation permits (soil erosion)
- Organized by category, not by department

**Route: `/forms/`**

### 5.3 — Mobile-First Responsive Redesign
- Guide pages optimized for phone use (people Google problems on their phone)
- Click-to-call on all phone numbers
- Collapsible sections for long content
- Quick-action buttons: "Call now," "Download form," "Get directions"

### 5.4 — SEO Strategy
- Each guide targets a long-tail search query residents actually type
- Structured data (FAQ schema, LocalBusiness, GovernmentOrganization)
- "Clare County [topic]" keyword targeting
- Meta descriptions written as answers, not descriptions

---

## Execution Order

### Sprint 1 (Week 1-2): Foundation
- [ ] Create `guides` content collection with schema
- [ ] Create `contacts` content collection with schema
- [ ] Create `ordinances` content collection with schema
- [ ] Build `GuideFinder` component (category cards + search)
- [ ] Build `GuidePage` layout (steps, contacts, forms, related)
- [ ] Restructure navigation to 4-pillar model
- [ ] Write first 10 guides (property + taxes categories)
- [ ] Seed contacts directory (township + county officials)

### Sprint 2 (Week 3-4): Governance
- [ ] Seed ordinance library (16 township ordinances with summaries)
- [ ] Build ordinance browsing/search page
- [ ] Write next 10 guides (nature + safety + government categories)
- [ ] Create public notices page
- [ ] Enhance minutes archive with search
- [ ] Build election center page

### Sprint 3 (Week 5-6): News & Events
- [ ] Create `events` content collection with schema
- [ ] Build events calendar component (calendar + list views)
- [ ] Seed recurring events (meetings, senior dining)
- [ ] Enhance news collection with new categories
- [ ] Write first batch of governance news summaries
- [ ] Build news filtering by category

### Sprint 4 (Week 7-8): Community & Polish
- [ ] Build conservation resources hub
- [ ] Enhance parks & lakes pages
- [ ] Create forms/permits hub page
- [ ] Implement Pagefind search
- [ ] Mobile optimization pass
- [ ] SEO optimization (structured data, meta descriptions)
- [ ] Community organization pages (Horn, Mane, seniors, veterans)

---

## Content Sourcing Rules

### DO scrape/aggregate:
- Public meeting schedules and agendas
- Official contact info and office hours
- Ordinance text and numbers (public record)
- Election dates and deadlines
- Park/facility addresses and hours
- Conservation program details (public agency)
- Tax due dates and payment links
- Emergency alert signup info

### DO NOT scrape:
- Copyrighted news articles (summarize with attribution instead)
- Personal information beyond public officials
- Social media content
- Gossip, opinion, or unverified claims
- Syndicated/wire content

### Write original content for:
- Plain-language guide walkthroughs
- Ordinance summaries ("what this means for you")
- Meeting action summaries (attend or read minutes, write our own summary)
- Public hearing explainers
- "How to" procedures for common resident needs

---

## Success Metrics

1. **A resident can answer any common question in under 3 clicks** from the homepage
2. **Every guide links to the actual form, phone number, or next step** — no dead ends
3. **No duplicate content** — one source of truth, linked from multiple contexts
4. **Mobile-first** — every page works on a phone with click-to-call
5. **Fresh** — meeting summaries within 1 week, public notices before deadlines
