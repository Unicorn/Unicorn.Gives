import { supabase } from '@/lib/supabase';

export type MunicipalDocumentKind =
  | 'master_plan'
  | 'zoning_ordinance'
  | 'recreation_plan'
  | 'other';

export interface MunicipalDocumentMeta {
  label: string;
  value: string;
  icon: string;
}

export interface MunicipalDocumentSection {
  title: string;
  items: string[];
}

export interface MunicipalDocumentRow {
  id: string;
  region_id: string;
  slug: string;
  kind: MunicipalDocumentKind;
  title: string;
  subtitle: string;
  description: string;
  adopted_date: string;
  adopted_by: string;
  pdf_url: string;
  pdf_size_label: string;
  meta: MunicipalDocumentMeta[];
  sections: MunicipalDocumentSection[];
  table_of_contents: string[] | null;
  display_order: number;
  status: string;
}

function parseJsonField<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  return raw as T;
}

function normalizeRow(row: Record<string, unknown>): MunicipalDocumentRow {
  return {
    id: String(row.id),
    region_id: String(row.region_id),
    slug: String(row.slug),
    kind: row.kind as MunicipalDocumentKind,
    title: String(row.title),
    subtitle: String(row.subtitle),
    description: String(row.description),
    adopted_date: String(row.adopted_date),
    adopted_by: String(row.adopted_by),
    pdf_url: String(row.pdf_url),
    pdf_size_label: String(row.pdf_size_label),
    meta: parseJsonField<MunicipalDocumentMeta[]>(row.meta, []),
    sections: parseJsonField<MunicipalDocumentSection[]>(row.sections, []),
    table_of_contents: parseJsonField<string[] | null>(row.table_of_contents, null),
    display_order: Number(row.display_order ?? 0),
    status: String(row.status),
  };
}

export async function fetchMunicipalDocumentsForRegion(
  regionId: string
): Promise<MunicipalDocumentRow[]> {
  const { data, error } = await supabase
    .from('municipal_documents')
    .select('*')
    .eq('region_id', regionId)
    .eq('status', 'published')
    .order('display_order', { ascending: true });

  if (error) {
    console.warn('fetchMunicipalDocumentsForRegion', error.message);
    return [];
  }
  if (!data?.length) return [];
  return data.map((r) => normalizeRow(r as Record<string, unknown>));
}

export async function fetchMunicipalDocumentBySlug(
  regionId: string,
  slug: string
): Promise<MunicipalDocumentRow | null> {
  const { data, error } = await supabase
    .from('municipal_documents')
    .select('*')
    .eq('region_id', regionId)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.warn('fetchMunicipalDocumentBySlug', error.message);
    return null;
  }
  if (!data) return null;
  return normalizeRow(data as Record<string, unknown>);
}
