/**
 * Shared category color maps — used by index, events, elections pages.
 * All values reference CSS custom properties from tokens.css.
 * Use `var(--token)` strings for inline style attributes.
 */

export const categoryColors: Record<string, string> = {
  'township':          'var(--green-600)',
  'unicorn-gives':     'var(--purple-500)',
  'the-horn':          'var(--purple-600)',
  'the-mane':          'var(--purple-700)',
  'community':         'var(--purple-500)',
  'ordinance-change':  'var(--green-700)',
  'government-action': 'var(--green-600)',
  'public-safety':     'var(--status-error)',
  'public-notice':     'var(--gold-700)',
  'infrastructure':    'var(--green-700)',
  'election':          'var(--purple-600)',
};

export const eventCategoryColors: Record<string, string> = {
  government:     'var(--green-600)',
  community:      'var(--purple-500)',
  conservation:   'var(--green-500)',
  seniors:        'var(--purple-600)',
  horn:           'var(--purple-500)',
  'unicorn-gives':'var(--purple-600)',
};

export const eventCategoryLabels: Record<string, string> = {
  government:     'Government',
  community:      'Community',
  conservation:   'Conservation',
  seniors:        'Seniors',
  horn:           'The Horn',
  'unicorn-gives':'Unicorn Gives',
};

/** Default fallback for unknown categories */
export const defaultCategoryColor = 'var(--neutral-600)';
