// Navigation structure for 4-pillar model
// Solve → Govern → Inform → Connect

export interface NavigationPage {
  slug: string;
  label?: string;
}

export interface NavigationSubcategory {
  id: string;
  label: string;
  pages: string[];
}

export interface NavigationCategory {
  id: string;
  label: string;
  subcategories: NavigationSubcategory[];
}

export const navigationStructure: NavigationCategory[] = [
  {
    id: 'solve',
    label: 'Get Help',
    subcategories: [
      {
        id: 'property-building',
        label: 'Property & Building',
        pages: ['help', 'building', 'permits-forms', 'zoning']
      },
      {
        id: 'taxes-assessment',
        label: 'Taxes & Assessment',
        pages: ['assessor', 'pay-taxes']
      },
      {
        id: 'safety-emergency',
        label: 'Safety & Emergency',
        pages: ['fire', 'emergency-alerts']
      },
      {
        id: 'nature-conservation',
        label: 'Nature & Conservation',
        pages: ['conservation', 'native-plants']
      }
    ]
  },
  {
    id: 'govern',
    label: 'Government',
    subcategories: [
      {
        id: 'lincoln-township',
        label: 'Lincoln Township',
        pages: ['board', 'board-minutes', 'minutes-archive', 'budget', 'financial-reports']
      },
      {
        id: 'planning-zoning',
        label: 'Planning & Zoning',
        pages: ['planning-commission', 'zba', 'zba-plancomm-minutes', 'ordinances']
      },
      {
        id: 'clare-county',
        label: 'Clare County',
        pages: ['contacts', 'elections']
      },
      {
        id: 'transparency',
        label: 'Transparency',
        pages: ['foia', 'public-notices', 'calendar']
      }
    ]
  },
  {
    id: 'inform',
    label: 'News & Alerts',
    subcategories: [
      {
        id: 'news',
        label: 'News & Updates',
        pages: ['news']
      },
      {
        id: 'events-calendar',
        label: 'Events & Calendar',
        pages: ['events']
      }
    ]
  },
  {
    id: 'connect',
    label: 'Community',
    subcategories: [
      {
        id: 'unicorn-gives',
        label: 'Unicorn Gives',
        pages: ['about-unicorn-gives', 'programs', 'volunteer', 'donate']
      },
      {
        id: 'the-horn',
        label: 'The Horn',
        pages: ['about-the-horn', 'events-horn', 'membership', 'hours-horn']
      },
      {
        id: 'the-mane',
        label: 'The Mane',
        pages: ['about-the-mane', 'services-mane', 'book-appointment', 'hours-mane']
      },
      {
        id: 'resources',
        label: 'Resources',
        pages: ['seniors', 'parks', 'cemeteries', 'lakes', 'lakes-lakegeorge', 'lakes-shingle', 'lakes-bertha', 'lakes-silver']
      },
      {
        id: 'township-info',
        label: 'Township Info',
        pages: ['faq', 'links', 'subscribe', 'plat-maps', 'compost', 'newsletters']
      }
    ]
  }
];
