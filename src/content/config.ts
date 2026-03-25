import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
    department: z.string().optional(),
    order: z.number().optional(),
    category: z.string().optional(),
    subcategory: z.string().optional(),
    navTitle: z.string().optional(),
    hideFromNav: z.boolean().optional(),
  }),
});

const minutesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    meetingType: z.string(),
    status: z.enum(['approved', 'pending', 'draft']).optional(),
    description: z.string().optional(),
    attendees: z.object({
      present: z.array(z.string()).optional(),
      absent: z.array(z.string()).optional(),
      alsoPresent: z.array(z.string()).optional(),
    }).optional(),
    source: z.enum(['transcribed', 'pdf', 'original-html']).optional(),
    pdfUrl: z.string().optional(),
    body: z.enum(['board', 'planning-commission', 'zba']).optional().default('board'),
  }),
});

const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().optional(),
    category: z.enum([
      'township', 'unicorn-gives', 'the-horn', 'the-mane', 'community',
      'ordinance-change', 'government-action', 'public-safety',
      'public-notice', 'infrastructure', 'election',
    ]).optional(),
    source: z.string().optional(),
    sourceUrl: z.string().optional(),
    jurisdiction: z.enum(['township', 'county', 'state']).optional(),
    featured: z.boolean().optional(),
    impact: z.enum(['high', 'medium', 'low']).optional(),
    image: z.string().optional(),
  }),
});

const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum([
      'property', 'taxes', 'safety', 'nature',
      'government', 'services', 'records',
    ]),
    scenario: z.string(),
    icon: z.string().optional(),
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

const contactsCollection = defineCollection({
  type: 'content',
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
    order: z.number().optional(),
  }),
});

const ordinancesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    number: z.number(),
    description: z.string(),
    category: z.enum(['zoning', 'public-safety', 'environment', 'property', 'infrastructure', 'general']),
    adoptedDate: z.string().optional(),
    amendedDate: z.string().optional(),
    pdfUrl: z.string().optional(),
    jurisdiction: z.enum(['township', 'county']),
  }),
});

const eventsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    endDate: z.string().optional(),
    time: z.string().optional(),
    location: z.string(),
    category: z.enum([
      'government', 'community', 'conservation',
      'seniors', 'horn', 'unicorn-gives',
    ]),
    recurring: z.boolean().optional(),
    recurrenceRule: z.string().optional(),
    registrationUrl: z.string().optional(),
    cost: z.string().optional(),
  }),
});

export const collections = {
  pages: pagesCollection,
  minutes: minutesCollection,
  news: newsCollection,
  guides: guidesCollection,
  contacts: contactsCollection,
  ordinances: ordinancesCollection,
  events: eventsCollection,
};
