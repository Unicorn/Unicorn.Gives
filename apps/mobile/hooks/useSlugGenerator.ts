import { useCallback, useEffect, useRef, useState } from 'react';

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Auto-generates a URL slug from a title.
 * Once the user manually edits the slug, auto-generation stops.
 *
 * When editing existing records, the form's slug sync effect should
 * only update the slug if it's still empty (not yet loaded from DB).
 */
export function useSlugGenerator(title: string) {
  const [slug, setSlug] = useState('');
  const [manuallyEdited, setManuallyEdited] = useState(false);
  const prevTitle = useRef(title);
  /** True after the first non-empty title is seen */
  const initialized = useRef(false);

  useEffect(() => {
    // Skip auto-generation if slug was manually set or externally set (from DB)
    if (manuallyEdited) {
      prevTitle.current = title;
      return;
    }

    // If title changed and we've already initialized, regenerate
    if (title !== prevTitle.current) {
      // Don't auto-gen on the very first title set if there's no prior slug
      // (the form component's slug sync effect handles the initial data load)
      if (initialized.current || !prevTitle.current) {
        setSlug(toSlug(title));
      }
      initialized.current = true;
    }
    prevTitle.current = title;
  }, [title, manuallyEdited]);

  const onSlugChange = useCallback((value: string) => {
    setManuallyEdited(true);
    setSlug(toSlug(value));
  }, []);

  const resetManual = useCallback(() => {
    setManuallyEdited(false);
    setSlug(toSlug(title));
  }, [title]);

  return { slug, setSlug: onSlugChange, manuallyEdited, resetManual };
}
