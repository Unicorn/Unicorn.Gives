// Navigation structure for 3-level hierarchical navigation
// Category → Subcategory → Pages

export interface NavigationPage {
  slug: string;
  label?: string; // Optional override for display label
}

export interface NavigationSubcategory {
  id: string;
  label: string;
  pages: string[]; // Array of page slugs
}

export interface NavigationCategory {
  id: string;
  label: string;
  subcategories: NavigationSubcategory[];
}

export const navigationStructure: NavigationCategory[] = [
  {
    id: 'government',
    label: 'Government',
    subcategories: [
      {
        id: 'board-leadership',
        label: 'Board & Leadership',
        pages: ['board', 'board-minutes', 'minutes-archive']
      },
      {
        id: 'meetings-calendar',
        label: 'Meetings & Calendar',
        pages: ['calendar', 'public-notices']
      },
      {
        id: 'budget-finances',
        label: 'Budget & Finances',
        pages: ['budget', 'financial-reports']
      }
    ]
  },
  {
    id: 'services',
    label: 'Services',
    subcategories: [
      {
        id: 'building-development',
        label: 'Building & Development',
        pages: ['building', 'permits-forms']
      },
      {
        id: 'public-safety',
        label: 'Public Safety',
        pages: ['fire']
      },
      {
        id: 'other-services',
        label: 'Other Services',
        pages: ['assessor', 'elections', 'compost']
      }
    ]
  },
  {
    id: 'planning-zoning',
    label: 'Planning & Zoning',
    subcategories: [
      {
        id: 'commissions',
        label: 'Commissions',
        pages: ['planning-commission', 'zba', 'zba-plancomm-minutes']
      },
      {
        id: 'regulations',
        label: 'Regulations',
        pages: ['zoning', 'ordinances', 'ordinances-zoning-ord-creation']
      }
    ]
  },
  {
    id: 'community',
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
        pages: ['seniors', 'newsletters', 'cemeteries', 'parks']
      },
      {
        id: 'lakes',
        label: 'Lakes',
        pages: ['lakes', 'lakes-lakegeorge', 'lakes-shingle', 'lakes-bertha', 'lakes-silver']
      },
      {
        id: 'township-info',
        label: 'Township Info',
        pages: ['faq', 'foia', 'links', 'subscribe', 'plat-maps']
      }
    ]
  },
  {
    id: 'news-events',
    label: 'News & Events',
    subcategories: [
      {
        id: 'community-events',
        label: 'Community Events',
        pages: ['events']
      },
      {
        id: 'news-updates',
        label: 'News & Updates',
        pages: ['news']
      }
    ]
  }
];
