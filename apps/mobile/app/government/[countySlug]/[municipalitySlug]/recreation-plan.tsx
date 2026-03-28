import { TownshipDocumentScreen } from '@/components/municipal/TownshipDocumentScreen';

export default function RecreationPlanScreen() {
  return (
    <TownshipDocumentScreen
      title="Recreation Plan 2026–2030"
      subtitle="Lincoln Township"
      adoptedDate="January 12, 2026"
      adoptedBy="the Board of Trustees"
      description="This five-year recreation plan guides future parks and recreation improvements for Lincoln Township. It makes the Township eligible for grant funding from the Michigan Department of Natural Resources (MDNR) through calendar year 2030."
      pdfPath="/documents/lincoln-township/recreation-plan-2026-2030.pdf"
      pdfSizeMB="4.2"
      meta={[
        { label: 'Plan Period', value: '2026–2030 (5 years)', icon: 'date-range' },
        { label: 'Township Parks', value: 'Bertha Park, Shingle Lake Park, Silver Lake Park', icon: 'park' },
        { label: 'Total Parkland', value: '26.1 acres (Hamlin Field accounts for 20 acres)', icon: 'terrain' },
        { label: 'Parks Budget (2025)', value: '$77,434', icon: 'account-balance' },
        { label: 'School District', value: 'Farwell Area School District (4 schools)', icon: 'school' },
        { label: 'Key Gap', value: 'No community parks, sports parks, or non-motorized trails', icon: 'warning' },
      ]}
      sections={[
        {
          title: 'Recreation Goals',
          items: [
            'Promote healthy lifestyles and active play for everyone regardless of age or socioeconomic status',
            'Provide safe, accessible, and inclusive public parks and recreation facilities',
            'Maintain existing facilities and support new non-motorized trails for mobility and healthy living',
            'Implement recommendations cost effectively with creative funding strategies',
          ],
        },
        {
          title: 'Recommended Trail Projects',
          items: [
            'Shared Use Pathway: Lake George to White Birch Campground (~7 miles, highest priority)',
            'Pedestrian/Bicycle Travel enhancements: crossings, signage, bike racks, benches, trailheads',
            'Shared Use Pathway: Lake George to western Township border (~1.5 miles)',
            'Shared Use Pathway: White Birch Lakes to southern border (~1 mile)',
          ],
        },
        {
          title: 'Park Facility Needs (based on NRPA guidelines)',
          items: [
            'Community Parks: 11.7 acres needed, 0 existing (deficit of -11.7)',
            'Sports Parks: 40 acres recommended, 0 existing (deficit of -40)',
            'Neighborhood Parks: 3.2 acres recommended, 23 acres existing (surplus of +19.8)',
            'Non-Motorized Trails: 0 existing; NRPA recommends 2–9.2 miles for the population',
            'Rectangular fields and driving ranges: each showing -1 deficit',
          ],
        },
        {
          title: 'Community Organizations',
          items: [
            'Friends of Clare County Parks and Recreation (non-profit, grants and events)',
            'Lake George Property Owners Association (5K run, parades, car show)',
            'White Birch Lakes Recreational Association',
            'Clare Little League, Pony League, Youth & Rocket Football, Adult Softball',
            'Unicorn Garden Club',
            'Lake George Booster\'s Club',
          ],
        },
      ]}
      tableOfContents={[
        'Introduction & Community Description',
        'Administrative Structure',
        'Recreation Inventory',
        'Planning & Public Input Process',
        'Recreation Needs Analysis',
        'Action Program',
      ]}
    />
  );
}
