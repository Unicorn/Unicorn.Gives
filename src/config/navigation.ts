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
        pages: ['calendar']
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
        id: 'resources',
        label: 'Resources',
        pages: ['seniors', 'newsletters']
      },
      {
        id: 'facilities',
        label: 'Facilities',
        pages: ['cemeteries', 'parks']
      }
    ]
  },
  {
    id: 'natural-resources',
    label: 'Natural Resources',
    subcategories: [
      {
        id: 'lakes',
        label: 'Lakes',
        pages: ['lakes', 'lakes-lakegeorge', 'lakes-shingle', 'lakes-bertha', 'lakes-silver']
      }
    ]
  },
  {
    id: 'information',
    label: 'Information',
    subcategories: [
      {
        id: 'resources',
        label: 'Resources',
        pages: ['faq', 'foia', 'links', 'subscribe', 'plat-maps']
      }
    ]
  }
];
