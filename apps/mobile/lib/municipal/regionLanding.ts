/**
 * Data helpers for region landing pages: fetch the page row, scoped news,
 * scoped upcoming events (including a parent-region roll-up), and newsletter
 * subscription.
 */
import { supabase } from '@/lib/supabase';

/* ─────────────── Types ─────────────── */

export interface QuickAccessItem {
  key: string;
  icon: string;
  title: string;
  description: string;
  href?: string;
  color_scheme?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'muted';
}

export interface CustomSectionItem {
  type: 'markdown' | 'gallery' | 'quote' | 'cta';
  title?: string;
  body?: string;
  image_url?: string;
  images?: { url: string; caption?: string }[];
  quote?: string;
  author?: string;
  cta_label?: string;
  cta_url?: string;
}

export interface NewsSettings {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  auto_limit?: number;
  featured_news_ids?: string[];
  show_view_all?: boolean;
  category_slugs?: string[];
}

export interface EventsSettings {
  enabled: boolean;
  title?: string;
  subtitle?: string;
  auto_limit?: number;
  include_parent_region?: boolean;
  exclude_parent_categories?: string[];
  show_view_all?: boolean;
  category_slugs?: string[];
}

export interface NewsletterSettings {
  enabled: boolean;
  title?: string;
  body?: string;
  placeholder?: string;
  submit_label?: string;
}

export interface RegionLandingPage {
  id: string;
  region_id: string;
  status: 'draft' | 'published' | 'archived';

  hero_eyebrow: string | null;
  hero_headline: string | null;
  hero_headline_accent: string | null;
  hero_subheadline: string | null;
  hero_image_url: string | null;
  hero_cta_primary_label: string | null;
  hero_cta_primary_url: string | null;
  hero_cta_secondary_label: string | null;
  hero_cta_secondary_url: string | null;

  about_title: string | null;
  about_body: string | null;
  about_image_url: string | null;

  quick_access: QuickAccessItem[];
  quick_access_title: string | null;
  quick_access_subtitle: string | null;

  news_settings: NewsSettings;
  events_settings: EventsSettings;

  custom_sections: CustomSectionItem[];
  newsletter: NewsletterSettings;

  section_order: string[];
  hidden_sections: string[];

  published_at: string | null;
}

export interface RegionNewsItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  date: string;
  category: string;
  image_url: string | null;
  featured: boolean | null;
}

export interface RegionEventItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  date: string;
  time: string | null;
  location: string | null;
  category: string;
  image_url: string | null;
  region_id: string | null;
}

/* ─────────────── Fetchers ─────────────── */

export async function fetchRegionLanding(
  regionId: string,
  { allowDraft = false }: { allowDraft?: boolean } = {},
): Promise<RegionLandingPage | null> {
  let query = supabase
    .from('region_landing_pages')
    .select('*')
    .eq('region_id', regionId)
    .limit(1);
  if (!allowDraft) query = query.eq('status', 'published');
  const { data } = await query.single();
  return (data as RegionLandingPage | null) ?? null;
}

/**
 * News for a region landing page.
 * Pulls news scoped to this region (region_id = regionId) plus global news
 * (region_id IS NULL) so townships still see workspace-wide stories.
 * Published only, ordered by date desc.
 */
export async function fetchRegionNews(
  regionId: string,
  { limit = 4, categorySlugs }: { limit?: number; categorySlugs?: string[] } = {},
): Promise<RegionNewsItem[]> {
  let query = supabase
    .from('news')
    .select('id, slug, title, description, date, category, image_url, featured')
    .eq('status', 'published')
    .in('visibility', ['global', 'both', 'scoped'])
    .or(`region_id.eq.${regionId},region_id.is.null`)
    .order('featured', { ascending: false })
    .order('date', { ascending: false })
    .limit(limit);
  if (categorySlugs?.length) {
    query = query.in('category', categorySlugs);
  }
  const { data } = await query;
  return (data as RegionNewsItem[]) ?? [];
}

/**
 * Upcoming events for a region landing page.
 * Includes events for the region itself (all categories) and, when
 * `includeParent` is true, events from the parent region minus categories
 * listed in `excludeParentCategories` (defaults to 'government' so township
 * visitors don't see county town-hall meetings).
 */
export async function fetchRegionUpcomingEvents(
  regionId: string,
  {
    parentId,
    limit = 4,
    includeParent = true,
    excludeParentCategories = ['government'],
  }: {
    parentId?: string | null;
    limit?: number;
    includeParent?: boolean;
    excludeParentCategories?: string[];
  } = {},
): Promise<RegionEventItem[]> {
  const today = new Date().toISOString().split('T')[0];
  const regionIds = [regionId];
  if (includeParent && parentId) regionIds.push(parentId);

  let query = supabase
    .from('events')
    .select('id, slug, title, description, date, time, location, category, image_url, region_id')
    .eq('status', 'published')
    .in('region_id', regionIds)
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(limit * 2); // fetch extra so we can filter parent-exclusions

  const { data } = await query;
  const rows = (data as RegionEventItem[]) ?? [];

  const filtered = rows.filter((row) => {
    if (row.region_id === regionId) return true;
    if (!includeParent || row.region_id !== parentId) return false;
    return !excludeParentCategories.includes(row.category);
  });

  return filtered.slice(0, limit);
}

/**
 * Submit a newsletter subscription. Silently ignores duplicates.
 */
export async function subscribeToNewsletter(
  email: string,
  regionId: string | null,
  source = 'region_landing_page',
): Promise<{ ok: true } | { ok: false; error: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: trimmed, region_id: regionId, source });
  if (error && !error.message.includes('duplicate')) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
