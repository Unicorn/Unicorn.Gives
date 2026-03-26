## Missing PDF Assets (remove broken links until restored)

The following PDF files are referenced by CMS markdown but are currently not present in `apps/site/public/`, so they will 404 on the static web build.

### Missing assets
- `docs/absentee_ballot_app.pdf`
- `docs/conditional_rezoning_info.pdf`
- `docs/disaster_preparedness_for_seniors.pdf`
- `docs/grandfacts-michigan.pdf`
- `docs/guide_for_seniors_abuse-fraud.pdf`
- `docs/master_plan.pdf`
- `docs/services_for_seniors.pdf`
- `docs/vet_exemption_form.pdf`
- `docs/zoning_ord_creation/landplan_blueprint_meeting2-23-15.pdf`
- `forms/building_permit.pdf`
- `forms/building_permit_all-in-one.pdf`
- `forms/conditional_rezoning_app.pdf`
- `forms/electrical_permit.pdf`
- `forms/home_occupation_permit.pdf`
- `forms/mechanical_permit.pdf`
- `forms/parcel_division_app.pdf`
- `forms/plumbing_permit.pdf`
- `forms/special_use_permit.pdf`
- `forms/twp_park_use_agreement.pdf`
- `forms/zoning_complaint.pdf`
- `forms/zoning_permit.pdf`
- `forms/zoning_variance_app.pdf`
- `ordinances/30.pdf`
- `ordinances/32.pdf`
- `ordinances/33.pdf`
- `ordinances/34.pdf`
- `ordinances/35.pdf`
- `ordinances/38.pdf`
- `ordinances/39.pdf`
- `ordinances/40.pdf`
- `ordinances/41.pdf`
- `ordinances/42.pdf`
- `ordinances/46.pdf`

### Link cleanup status (done for now)
Broken markdown links were removed (replaced with plain text) from:
- `content/pages/ordinances.md`
- `content/pages/permits-forms.md`
- `content/pages/seniors.md`
- `content/pages/zoning.md`

`building` and `elections` CMS pages are not required as markdown under `content/pages/`; they are bootstrapped in `supabase/migrations/004_upsert_pages_building_elections.sql` (and reflected in generated `002_seed_content.sql`). Migration `003_update_pages_building_elections.sql` is a no-op placeholder kept for history.

### Next step
Restore the missing PDFs under `apps/site/public/{docs|forms|ordinances}/...`, then re-add the markdown links.

