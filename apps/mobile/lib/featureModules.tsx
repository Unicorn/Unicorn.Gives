import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Platform } from 'react-native';

import { supabase } from './supabase';
import {
  DEFAULT_MODULE_FLAGS,
  SITE_SETTINGS_KEY,
  normalizeFlags,
  type ModuleFlags,
  type ModuleKey,
} from '@/constants/featureModules';

const CACHE_KEY = '@uni-gives/feature-modules';

interface FeatureModulesValue {
  flags: ModuleFlags;
  /** True once the server value has been fetched (or the fetch failed and we fell back). */
  loaded: boolean;
  refresh: () => Promise<void>;
}

const FeatureModulesContext = createContext<FeatureModulesValue | null>(null);

// The cache may only be applied after mount. Routes that server-render (see
// lib/ssrRoutes.ts) hydrate with this provider in the tree, and the server has
// no localStorage — so reading it during the first render makes the client's
// first render disagree with the exported HTML whenever cached flags differ
// from the defaults (React error #418).
function readCache(): ModuleFlags | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? normalizeFlags(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function FeatureModulesProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<ModuleFlags>(DEFAULT_MODULE_FLAGS);
  const [loaded, setLoaded] = useState(false);

  // Apply the cached flags once hydrated, before the network round-trip lands.
  useEffect(() => {
    const cached = readCache();
    if (cached) setFlags(cached);
  }, []);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SITE_SETTINGS_KEY)
      .maybeSingle();
    // Missing row or error → keep current flags (fail open with defaults/cache).
    if (!error && data) {
      const next = normalizeFlags(data.value);
      setFlags(next);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(next));
        } catch {}
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(() => ({ flags, loaded, refresh }), [flags, loaded, refresh]);
  return <FeatureModulesContext.Provider value={value}>{children}</FeatureModulesContext.Provider>;
}

export function useFeatureModules(): FeatureModulesValue {
  const ctx = useContext(FeatureModulesContext);
  if (!ctx) throw new Error('useFeatureModules must be used within FeatureModulesProvider');
  return ctx;
}

export function useModuleEnabled(module: ModuleKey): boolean {
  return useFeatureModules().flags[module];
}
