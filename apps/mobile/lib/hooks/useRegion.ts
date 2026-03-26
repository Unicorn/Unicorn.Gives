import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

interface Region {
  id: string;
  slug: string;
  name: string;
  type: string;
  parent_id: string | null;
  description: string | null;
  website: string | null;
}

export function useRegion(slug: string | undefined) {
  const [region, setRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    supabase
      .from('regions')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setRegion(data);
        setIsLoading(false);
      });
  }, [slug]);

  return { region, isLoading };
}
