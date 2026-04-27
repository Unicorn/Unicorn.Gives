import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Region {
  id: string;
  name: string;
  type: string;
  slug: string;
}

interface UseRegionsResult {
  /** All active regions */
  regions: Region[];
  /** Map from region id → region name */
  regionMap: Record<string, string>;
  /** Options for filter dropdowns: [{ label, value }] */
  regionOptions: { label: string; value: string }[];
  loading: boolean;
}

let cachedRegions: Region[] | null = null;

export function useRegions(): UseRegionsResult {
  const [regions, setRegions] = useState<Region[]>(cachedRegions ?? []);
  const [loading, setLoading] = useState(!cachedRegions);

  useEffect(() => {
    if (cachedRegions) return;
    (async () => {
      const { data } = await supabase
        .from('regions')
        .select('id, name, type, slug')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (data) {
        cachedRegions = data;
        setRegions(data);
      }
      setLoading(false);
    })();
  }, []);

  const regionMap: Record<string, string> = {};
  for (const r of regions) {
    regionMap[r.id] = r.name;
  }

  const regionOptions = [
    { label: 'All Regions', value: '' },
    ...regions.map((r) => ({ label: r.name, value: r.id })),
  ];

  return { regions, regionMap, regionOptions, loading };
}
