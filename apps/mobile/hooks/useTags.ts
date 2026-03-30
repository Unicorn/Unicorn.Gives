import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface TagOption {
  label: string;
  value: string;
}

interface UseTagsResult {
  tags: TagOption[];
  loading: boolean;
  refresh: () => void;
}

/**
 * Fetch active tags from the `tags` table.
 * Returns `{ label, value }` pairs ordered alphabetically by label.
 */
export function useTags(): UseTagsResult {
  const [tags, setTags] = useState<TagOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tags')
      .select('slug, label')
      .eq('is_active', true)
      .order('label', { ascending: true });

    if (!error && data) {
      setTags(data.map((t) => ({ label: t.label, value: t.slug })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { tags, loading, refresh: fetch };
}
