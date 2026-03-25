// Navigation structure for 4-pillar model
// Solve → Govern → Inform → Connect

export interface NavigationPage {
  slug: string;
  label?: string;
}

export interface MicrositeTab {
  slug: string;      // content page slug, e.g. "about-the-horn"
  tabSlug: string;   // URL segment, e.g. "about"
  label: string;     // Display label, e.g. "About"
}

export interface NavigationSubcategory {
  id: string;
  label: string;
  pages: string[];
  microsite?: {
    basePath: string;
    tabs: MicrositeTab[];
  };
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
        pages: ['help', 'building', 'permits-forms', 'forms-permits', 'zoning']
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
        pages: ['board', 'minutes', 'board-minutes', 'budget', 'financial-reports']
      },
      {
        id: 'planning-zoning',
        label: 'Planning & Zoning',
        pages: ['planning-commission', 'zba', 'zba-plancomm-minutes', 'ordinances']
      },
      {
        id: 'clare-county',
        label: 'Clare County',
        pages: ['contacts', 'election-center', 'elections']
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
        pages: ['about-the-horn', 'events-horn', 'membership', 'hours-horn'],
        microsite: {
          basePath: '/the-horn',
          tabs: [
            { slug: 'about-the-horn', tabSlug: 'about', label: 'About' },
            { slug: 'events-horn', tabSlug: 'events', label: 'Events' },
            { slug: 'membership', tabSlug: 'membership', label: 'Membership' },
            { slug: 'hours-horn', tabSlug: 'hours', label: 'Hours & Contact' },
          ],
        },
      },
      {
        id: 'the-mane',
        label: 'The Mane',
        pages: ['about-the-mane', 'services-mane', 'book-appointment', 'hours-mane'],
        microsite: {
          basePath: '/the-mane',
          tabs: [
            { slug: 'about-the-mane', tabSlug: 'about', label: 'About' },
            { slug: 'services-mane', tabSlug: 'services', label: 'Services' },
            { slug: 'book-appointment', tabSlug: 'book', label: 'Book Appointment' },
            { slug: 'hours-mane', tabSlug: 'hours', label: 'Hours & Contact' },
          ],
        },
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
