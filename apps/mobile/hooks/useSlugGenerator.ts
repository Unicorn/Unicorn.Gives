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
 */
export function useSlugGenerator(title: string) {
  const [slug, setSlug] = useState('');
  const [manuallyEdited, setManuallyEdited] = useState(false);
  const prevTitle = useRef(title);

  useEffect(() => {
    if (!manuallyEdited && title !== prevTitle.current) {
      setSlug(toSlug(title));
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
