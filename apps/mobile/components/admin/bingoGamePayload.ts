import type { BingoGameFormData } from './BingoGameForm';

/** Map the bingo game form into a Supabase row payload. */
export function buildGamePayload(
  form: BingoGameFormData,
  status?: 'draft' | 'published' | 'archived',
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: form.title.trim(),
    slug: form.slug.trim(),
    subtitle: form.subtitle.trim() || null,
    description: form.description.trim() || null,
    body: form.body || null,
    cover_image_url: form.cover_image_url || null,
    region_id: form.region_id || null,
    partner_id: form.partner_id || null,
    featured: form.featured,
    starts_on: form.starts_on || null,
    ends_on: form.ends_on || null,
    claim_event_date: form.claim_event_date || null,
    board_size: parseInt(String(form.board_size), 10) || 5,
    hard_cap: parseInt(String(form.hard_cap), 10) || 0,
    free_space_label: form.free_space_label.trim() || 'FREE',
    allow_reroll: form.allow_reroll,
    age_gate_required: form.age_gate_required,
    age_gate_min: parseInt(String(form.age_gate_min), 10) || 18,
    categories: form.categories,
    win_tiers: form.win_tiers,
    rules_md: form.rules_md || null,
    disclaimer_md: form.disclaimer_md || null,
  };

  if (status) {
    payload.status = status;
    if (status === 'published') payload.published_at = new Date().toISOString();
  }

  return payload;
}

/** Hydrate the form from a Supabase row. */
export function gameRowToForm(data: Record<string, any>): BingoGameFormData {
  return {
    title: data.title ?? '',
    slug: data.slug ?? '',
    subtitle: data.subtitle ?? '',
    description: data.description ?? '',
    body: data.body ?? '',
    cover_image_url: data.cover_image_url ?? '',
    region_id: data.region_id ?? '',
    partner_id: data.partner_id ?? '',
    featured: !!data.featured,
    starts_on: data.starts_on ?? '',
    ends_on: data.ends_on ?? '',
    claim_event_date: data.claim_event_date ?? '',
    board_size: String(data.board_size ?? 5),
    hard_cap: String(data.hard_cap ?? 6),
    free_space_label: data.free_space_label ?? 'FREE',
    allow_reroll: !!data.allow_reroll,
    age_gate_required: data.age_gate_required ?? true,
    age_gate_min: String(data.age_gate_min ?? 18),
    categories: Array.isArray(data.categories) ? data.categories : [],
    win_tiers: Array.isArray(data.win_tiers) ? data.win_tiers : [],
    rules_md: data.rules_md ?? '',
    disclaimer_md: data.disclaimer_md ?? '',
  };
}
