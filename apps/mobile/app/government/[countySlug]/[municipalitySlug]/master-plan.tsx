import { TownshipDocumentScreen } from '@/components/municipal/TownshipDocumentScreen';

export default function MasterPlanScreen() {
  return (
    <TownshipDocumentScreen
      title="Master Plan 2040"
      subtitle="Lincoln Township"
      adoptedDate="March 12, 2024"
      adoptedBy="the Planning Commission"
      description="The Master Plan establishes a framework for Lincoln Township's future development, balancing growth with preservation of the Township's rural character, natural resources, and ecological balance. It covers land use, housing, economy, transportation, and community services."
      pdfPath="/documents/lincoln-township/master-plan-2040.pdf"
      pdfSizeMB="11.3"
      meta={[
        { label: 'Population (2020 Census)', value: '1,805 residents', icon: 'people' },
        { label: 'Total Area', value: '22,967 acres (35.9 sq mi)', icon: 'landscape' },
        { label: 'Median Age', value: '56.3 years', icon: 'person' },
        { label: 'Housing Units', value: '86.2% single-family, 56.2% vacant/seasonal', icon: 'home' },
        { label: 'Median Home Value', value: '$115,027', icon: 'attach-money' },
        { label: 'Largest Lake', value: 'Lake George (134 acres)', icon: 'water' },
        { label: 'Woodland Coverage', value: '82.5% of Township', icon: 'park' },
        { label: 'Major Employers', value: 'Manufacturing (14.7%), Healthcare (15.3%), Retail (11.5%)', icon: 'business' },
      ]}
      sections={[
        {
          title: 'Community-Wide Goals',
          items: [
            'Preserve and protect abundant natural resources including woodlands, lakes, and wetlands',
            'Bolster public awareness and citizen participation in local planning',
            'Manage new growth to retain the rural character of the community',
            'Preserve property owners\' rights while maintaining community aesthetics',
            'Relate land use to natural characteristics and long-term community needs',
            'Encourage intergovernmental cooperation with Clare County and the State',
            'Alleviate blight to present a better image of the Township',
          ],
        },
        {
          title: 'Future Land Use Categories',
          items: [
            'Rural Residential — 66.7% of land area (15,331 acres)',
            'Single-Family Residential — 5.2% (1,206 acres)',
            'Residential Recreation — 7.6% (1,741 acres)',
            'Multi-Family Residential — designated near Lake George',
            'Central Business District and Commercial zones',
            'Industrial — 0.9% (209 acres)',
            'Property Owned by Gas Companies — 15.0% (3,441 acres)',
            'Recreation and State Land areas',
          ],
        },
        {
          title: 'Key Services & Infrastructure',
          items: [
            'Police: Clare County Sheriff\'s Department (7 days/week patrols)',
            'Fire: Lincoln Township volunteer fire department (also serves Freeman Twp)',
            'Utilities: Consumers Energy & Great Lakes Energy (electric), DTE Gas (natural gas)',
            'Water/Sewer: Private wells and septic systems (no public systems)',
            'Transit: Clare County Transit Corporation (CCTC)',
            'Waste: Green For Life (GFL) curbside trash and recycling',
            'Schools: Farwell Area School District (4 schools, 989 students)',
            'Senior Center at Township Hall with meals, activities, emergency services',
          ],
        },
      ]}
      tableOfContents={[
        'Introduction',
        'Executive Summary',
        'Socioeconomic Profile',
        'Natural Resources Assessment',
        'Existing Land Use Analysis',
        'Community Facilities and Services',
        'Community Goals and Objectives',
        'Future Land Use Plan',
        'Plan Implementation Resources',
      ]}
    />
  );
}
