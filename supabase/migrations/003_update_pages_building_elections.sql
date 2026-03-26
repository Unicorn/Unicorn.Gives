-- =============================================================================
-- Unicorn.Gives Content Page Updates
-- =============================================================================
-- Purpose:
--   Keep Supabase `public.pages` rows in sync with the latest markdown sources
--   under `content/pages/` (after the Astro/GitHub Pages site removal).
--
-- Updated pages:
--   - building
--   - elections
-- =============================================================================

UPDATE public.pages
SET
  title = 'Lincoln Township Building Department',
  description = 'Building permits, inspections, and construction requirements for Lincoln Township',
  body = $pages_body_building$
## Building Department

Lincoln Township building permits are administered by **Clare County Community Development**.

### Contact Information
**Clare County Building Department**
- Address: 225 W. Main St., P.O. Box 438, Harrison, MI 48625
- Phone: 989-539-2761
- Website: [clareco.net](https://clareco.net/)

**Lincoln Township Zoning Administrator**
- Dick Hassberger
- Phone: (989) 588-9841 ext. 5
- Email: zoning@lincolntwp.com

## How to Get a Building Permit
### Step 1: Determine What Permits You Need
**Both a Building Permit AND a Zoning Permit are required for most construction projects.**

**Building Permit** (County-level)
- Required for: New construction, additions, renovations, decks, garages, sheds over certain sizes
- Administered by: Clare County Building Department
- Phone: 989-539-2761

**Zoning Permit** (Township-level)
- Required for: All construction to ensure compliance with township zoning ordinances
- Administered by: Lincoln Township Zoning Administrator
- Phone: (989) 588-9841 ext. 5

### Step 2: Download and Complete Application Forms
**Building Permits**
- Building Permit Application
- Plumbing Permit Application - Contact Nate Caulkins: 989-539-2741
- Electrical Permit Application
- Mechanical Permit Application - Contact Nate Caulkins: 989-539-2741

**Zoning Permit**
- Zoning Permit Application

### Step 3: Submit Applications
**Submit Building Permit Applications to:**
Clare County Building Department
225 W. Main St., P.O. Box 438
Harrison, MI 48625
Phone: 989-539-2761

**Submit Zoning Permit Applications to:**
Dick Hassberger, Zoning Administrator
Lincoln Township Hall
Phone: 989-588-9841 ext. 5
Email: zoning@lincolntwp.com

### Step 4: Pay Permit Fees
Permit fees will be calculated based on project scope and valuation. Payment is required before permits are issued.

### Step 5: Schedule Inspections
**The person who filed the permit application must schedule inspections with the Building Department.**
Contact Clare County Building Department at 989-539-2761 to schedule required inspections at various stages of construction.

## Additional Requirements
### Soil Erosion Control
If your project disturbs soil, you may need a soil erosion permit from the Clare Conservation District:
- Website: [clarecd.org/se.html](http://www.clarecd.org/se.html)
- Phone: 989-539-9364

### Septic System Permits
Septic system permits are handled by the Central Michigan District Health Department:
- Phone: 989-773-5921
- Website: [cmdhd.org](https://www.cmdhd.org/)

## Frequently Asked Questions
[Get answers to frequently asked questions about building in Lincoln Township →](/faq#building)

## Related Resources
- [Zoning Information](/zba)
- [Planning Commission](/planning-commission)
- [Permits & Forms](/permits-forms)
- [Township Ordinances](/ordinances)
- [Clare County Website](https://clareco.net/)
$pages_body_building$
,
  category = 'Services',
  subcategory = 'Building & Development',
  nav_title = NULL,
  hide_from_nav = false,
  display_order = 10,
  status = 'published',
  last_updated = now()
WHERE slug = 'building';

UPDATE public.pages
SET
  title = 'Lincoln Township Election Information',
  description = 'Voter registration, absentee ballots, and election information for Lincoln Township residents',
  body = $pages_body_elections$
## Elections & Voting Information

### Voter Registration & Absentee Voting
Due to the passing of Proposal 18-3, **anyone is eligible to request an Absentee Ballot** for any reason.

**Lincoln Township Clerk**
- Carol Majewski
- Phone: 989-588-9069
- Email: clm@lincolntwp.com

### How to Get an Absentee Ballot
**Option 1: Automatic Application (Recommended)**
Sign up for an automatic absentee ballot application for all elections in your jurisdiction.

**Option 2: Request by Application**
- Contact Carol Majewski at 989-588-9069 or clm@lincolntwp.com

**Option 3: Use the Ballot Drop Box**
A secure ballot drop box is available at Lincoln Township Hall.

### Absentee Ballot Deadlines
**Regular Request Deadline**
If the ballot must be issued by mail, the application must reach the township clerk by **5:00 PM on the Friday before the election**.

**Late Request (In-Person)**
Absentee ballots can be picked up in person at the clerk's office anytime up to **4:00 PM on the day before the election**. You must vote the ballot in the office.

**Same Day Voter Registration**
Voters who register on Election Day can obtain an absentee ballot until **8:00 PM on Election Day**.

**Emergency Request**
Emergency requests (due to personal disability or family death/illness) must be made after the regular deadline and before **4:00 PM on Election Day**.

**Return Deadline**
ALL BALLOTS MUST BE RETURNED TO THE CLERK BY 8:00 PM ON ELECTION DAY.

### Voter Registration
**Register to Vote**
- In person: Lincoln Township Clerk's office
- Same-day registration available on Election Day
- Contact: Carol Majewski at 989-588-9069

### County Election Information
**Clare County Clerk** (Elections Office)
- Phone: 989-539-7131
- Website: [clareclerkrod.com](http://clareclerkrod.com/)
- Services: Voter registration, election information, sample ballots

**Address**
225 West Main, Harrison, MI 48625

### Additional Resources
**Michigan Voter Information Center**
- [michigan.gov/vote](https://www.michigan.gov/vote)
- Check registration status
- View sample ballot
- Find polling location

**Secretary of State**
- [michigan.gov/sos](https://www.michigan.gov/sos)
- Voter registration
- Election information
- Absentee voting details

### Contact the Township Clerk
For questions about voting, registration, or absentee ballots:
- **Carol Majewski, Township Clerk**
- Phone: 989-588-9069
- Email: clm@lincolntwp.com

### Related Resources
- [Board Meeting Calendar](/calendar)
- [Frequently Asked Questions](/faq)
- [Community Resources](/links)
$pages_body_elections$
,
  category = 'Services',
  subcategory = 'Other Services',
  nav_title = NULL,
  hide_from_nav = false,
  display_order = 14,
  status = 'published',
  last_updated = now()
WHERE slug = 'elections';

