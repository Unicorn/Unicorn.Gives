import type { SupabaseClient } from '@supabase/supabase-js';

/** Content tables that support batch resolution of title/slug by id (matches admin content). */
export const AUDIT_RESOURCE_TYPE_LABELS: Record<string, string> = {
  events: 'Events',
  news: 'News',
  guides: 'Guides',
  pages: 'Pages',
  minutes: 'Minutes',
  ordinances: 'Ordinances',
  contacts: 'Contacts',
  elections: 'Elections',
  municipal_documents: 'Municipal Documents',
  region_pages: 'Region Pages',
  partner_pages: 'Partner Pages',
};

const BATCH_TABLES = new Set(Object.keys(AUDIT_RESOURCE_TYPE_LABELS));

export interface AuditLogRow {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  created_at: string;
  changes: Record<string, unknown> | null;
  user_id: string | null;
  actor_display_name: string | null;
  actor_email: string | null;
}

export interface EnrichedAuditEntry extends AuditLogRow {
  typeLabel: string;
  /** Primary human-readable content label (title, contact name, or slug). */
  contentLabel: string;
  /** Slug when known (for secondary line). */
  contentSlug: string | null;
  /** First 8 chars of resource UUID when no better label exists. */
  idHint: string;
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function labelForUnknownTable(resourceType: string): string {
  return resourceType
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function fromChanges(changes: Record<string, unknown> | null): {
  titleOrName: string | null;
  slug: string | null;
} {
  if (!changes) return { titleOrName: null, slug: null };
  return {
    titleOrName: str(changes.title) ?? str(changes.name),
    slug: str(changes.slug),
  };
}

export function formatActorLabel(entry: Pick<AuditLogRow, 'actor_display_name' | 'actor_email' | 'user_id'>): string {
  const name = entry.actor_display_name?.trim();
  if (name) return name;
  const email = entry.actor_email?.trim();
  if (email) return email;
  if (entry.user_id) return `User ${entry.user_id.slice(0, 8)}…`;
  return 'Unknown user';
}

/**
 * Resolves friendly type labels and content title/slug via `changes` and batched table lookups.
 */
export async function enrichAuditEntries(
  client: SupabaseClient,
  entries: AuditLogRow[],
): Promise<EnrichedAuditEntry[]> {
  const grouped = new Map<string, string[]>();

  for (const e of entries) {
    if (!BATCH_TABLES.has(e.resource_type)) continue;
    const list = grouped.get(e.resource_type) ?? [];
    if (!list.includes(e.resource_id)) list.push(e.resource_id);
    grouped.set(e.resource_type, list);
  }

  const rowMaps = new Map<string, Map<string, { label: string | null; slug: string | null }>>();

  for (const [table, ids] of grouped) {
    if (ids.length === 0) continue;
    const isContacts = table === 'contacts';
    const selectCols = isContacts ? 'id, slug, name' : 'id, slug, title';
    const { data, error } = await client.from(table).select(selectCols).in('id', ids);
    if (error || !data) continue;

    const m = new Map<string, { label: string | null; slug: string | null }>();
    for (const row of data as Record<string, unknown>[]) {
      const id = str(row.id);
      if (!id) continue;
      const slug = str(row.slug);
      const label = isContacts ? str(row.name) : str(row.title);
      m.set(id, { label, slug });
    }
    rowMaps.set(table, m);
  }

  return entries.map((e) => {
    const typeLabel = AUDIT_RESOURCE_TYPE_LABELS[e.resource_type] ?? labelForUnknownTable(e.resource_type);
    const fromCh = fromChanges(e.changes);
    const row = rowMaps.get(e.resource_type)?.get(e.resource_id);
    const slug = row?.slug ?? fromCh.slug;
    const titleOrName = row?.label ?? fromCh.titleOrName;
    const idHint = e.resource_id.slice(0, 8);
    const contentLabel = titleOrName ?? slug ?? idHint;
    return {
      ...e,
      typeLabel,
      contentLabel,
      contentSlug: slug,
      idHint,
    };
  });
}
