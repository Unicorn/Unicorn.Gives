import { supabase } from '@/lib/supabase';

export interface ResourceAttachment {
  label: string;
  url: string;
  mime_type: string;
  size_label: string;
}

export interface ResourcePageRow {
  id: string;
  region_id: string;
  slug: string;
  title: string;
  description: string | null;
  body: string;
  category: string | null;
  parent_slug: string | null;
  attachments: ResourceAttachment[];
  display_order: number;
  status: string;
  published_at: string | null;
}

function parseAttachments(raw: unknown): ResourceAttachment[] {
  if (!raw) return [];
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as ResourceAttachment[];
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) return raw as ResourceAttachment[];
  return [];
}

function normalizeRow(row: Record<string, unknown>): ResourcePageRow {
  return {
    id: String(row.id),
    region_id: String(row.region_id),
    slug: String(row.slug),
    title: String(row.title),
    description: row.description ? String(row.description) : null,
    body: String(row.body ?? ''),
    category: row.category ? String(row.category) : null,
    parent_slug: row.parent_slug ? String(row.parent_slug) : null,
    attachments: parseAttachments(row.attachments),
    display_order: Number(row.display_order ?? 0),
    status: String(row.status),
    published_at: row.published_at ? String(row.published_at) : null,
  };
}

/** Fetch the "resources" landing page for a region. */
export async function fetchResourceLanding(
  regionId: string,
): Promise<ResourcePageRow | null> {
  const { data, error } = await supabase
    .from('region_pages')
    .select('*')
    .eq('region_id', regionId)
    .eq('slug', 'resources')
    .eq('category', 'resources')
    .is('parent_slug', null)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.warn('fetchResourceLanding', error.message);
    return null;
  }
  if (!data) return null;
  return normalizeRow(data as Record<string, unknown>);
}

/** Fetch all published child pages under the "resources" landing. */
export async function fetchResourceSubpages(
  regionId: string,
): Promise<ResourcePageRow[]> {
  const { data, error } = await supabase
    .from('region_pages')
    .select('*')
    .eq('region_id', regionId)
    .eq('category', 'resources')
    .eq('parent_slug', 'resources')
    .eq('status', 'published')
    .order('display_order', { ascending: true });

  if (error) {
    console.warn('fetchResourceSubpages', error.message);
    return [];
  }
  if (!data?.length) return [];
  return data.map((r) => normalizeRow(r as Record<string, unknown>));
}

/** Fetch a single resource subpage by slug. */
export async function fetchResourcePageBySlug(
  regionId: string,
  slug: string,
): Promise<ResourcePageRow | null> {
  const { data, error } = await supabase
    .from('region_pages')
    .select('*')
    .eq('region_id', regionId)
    .eq('slug', slug)
    .eq('category', 'resources')
    .eq('parent_slug', 'resources')
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.warn('fetchResourcePageBySlug', error.message);
    return null;
  }
  if (!data) return null;
  return normalizeRow(data as Record<string, unknown>);
}
