import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface CategoryOption {
  label: string;
  value: string;
}

interface UseCategoriesResult {
  categories: CategoryOption[];
  loading: boolean;
  refresh: () => void;
}

/**
 * Fetch active categories for a given content type from the `categories` table.
 * Returns `{ label, value }` pairs ordered by `display_order`, ready for SelectField.
 */
export function useCategories(contentType: string): UseCategoriesResult {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('slug, label')
      .eq('content_type', contentType)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data) {
      setCategories(data.map((c) => ({ label: c.label, value: c.slug })));
    }
    setLoading(false);
  }, [contentType]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { categories, loading, refresh: fetch };
}
