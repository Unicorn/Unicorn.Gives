import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { getStaticRegion } from '../government-snapshot';

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
  // Seeded from the build-time snapshot so `/government` routes render
  // server-side; both the server and the client's first render read the same
  // bundled JSON, which keeps hydration deterministic.
  const seed = getStaticRegion<Region>(slug);
  const [region, setRegion] = useState<Region | null>(seed);
  const [isLoading, setIsLoading] = useState(seed === null);

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
