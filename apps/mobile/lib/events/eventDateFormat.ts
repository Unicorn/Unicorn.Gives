/** Parse YYYY-MM-DD as local calendar date (same convention as elsewhere in the app). */
function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

/** Month abbreviation + day for event rails (matches EditorialCard / list cards). */
export function eventDateBoxFromIso(dateStr: string): { month: string; day: number } {
  const d = parseLocalDate(dateStr);
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
  };
}

/** Long weekday + calendar date for secondary meta lines. */
export function eventLongDateLabel(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}
