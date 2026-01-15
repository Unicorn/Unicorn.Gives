import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.string(),
    department: z.string().optional(),
    order: z.number().optional(),
    // Navigation fields for 3-level hierarchy
    category: z.string().optional(),
    subcategory: z.string().optional(),
    navTitle: z.string().optional(),
    hideFromNav: z.boolean().optional(),
  }),
});

export const collections = {
  pages: pagesCollection,
};
