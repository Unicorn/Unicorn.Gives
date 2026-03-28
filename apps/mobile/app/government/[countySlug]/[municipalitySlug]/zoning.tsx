import { TownshipDocumentScreen } from '@/components/municipal/TownshipDocumentScreen';

export default function ZoningScreen() {
  return (
    <TownshipDocumentScreen
      title="Zoning Ordinance"
      subtitle="Ordinance No. 44"
      adoptedDate="August 14, 2017"
      adoptedBy="the Lincoln Township Board"
      description="The Zoning Ordinance regulates land use and development across Lincoln Township. It establishes zoning districts, permitted uses, site development requirements, and standards for structures, parking, landscaping, environmental protection, and signs. Last amended April 1, 2022."
      pdfPath="/documents/lincoln-township/zoning-ordinance-44.pdf"
      pdfSizeMB="2.0"
      meta={[
        { label: 'Ordinance Number', value: 'No. 44', icon: 'gavel' },
        { label: 'Effective Date', value: 'September 1, 2017', icon: 'event' },
        { label: 'Last Amended', value: 'April 1, 2022', icon: 'update' },
        { label: 'Zoning Administrator', value: 'Dick Hassberger', icon: 'person' },
        { label: 'Permit Required', value: 'Yes — for most grading, construction, and use changes', icon: 'assignment' },
        { label: 'First Offense Penalty', value: '$100 civil infraction', icon: 'report' },
      ]}
      sections={[
        {
          title: 'Zoning Districts',
          items: [
            'Residential, commercial, and industrial district classifications',
            'Planned Unit Development (PUD) district for mixed-use projects',
            'Site development requirements for each district (setbacks, lot size, density)',
            'Special district provisions and voting place exception',
          ],
        },
        {
          title: 'Permit Process',
          items: [
            'Zoning permits required before grading, excavation, or construction',
            'Single-family/two-family: Zoning Administrator approval within 15 days',
            'Other uses: Planning Commission review required (90-day timeline)',
            'Special Land Uses require Planning Commission final action',
            'Variances handled by the Zoning Board of Appeals (ZBA)',
            'Pre-application meetings available before formal submission',
          ],
        },
        {
          title: 'Key Regulations',
          items: [
            'Off-street parking and loading requirements by use type',
            'Landscaping and screening standards with buffer zones',
            'Environmental protection: natural resources, stormwater, emissions, shorelines',
            'Access and private road standards with clear vision zones',
            'Sign standards and regulations by district',
            'Nonconforming lots, structures, and uses provisions',
          ],
        },
        {
          title: 'Special Land Use Standards',
          items: [
            'Airports, bed & breakfasts, campgrounds, commercial stables',
            'Child/adult care facilities, extraction operations',
            'Golf courses, hospitals, kennels, mini storage',
            'Motels/hotels, multi-family developments',
            'Solar energy systems, wind energy turbines',
            'Wireless communication facilities, vehicle repair shops',
            'Medical marihuana, shooting ranges, site condominiums',
            'Common use lakefront lots, outdoor furnaces',
          ],
        },
      ]}
      tableOfContents={[
        'Title and Purpose',
        'General Administration, Enforcement, and Penalties',
        'Zoning Districts, Regulations, and Map',
        'Planned Unit Development (PUD) District',
        'Site Plan Review',
        'Special Land Uses',
        'Zoning Board of Appeals (ZBA)',
        'Zoning Map and Text Amendments',
        'Nonconforming Lots, Structures, and Uses',
        'Off-Street Parking and Loading',
        'Landscaping and Screening',
        'Environmental Protection',
        'Access and Private Roads',
        'Signs',
        'Standards for Specific Land Uses',
        'Supplemental Provisions',
        'Definitions',
      ]}
    />
  );
}
