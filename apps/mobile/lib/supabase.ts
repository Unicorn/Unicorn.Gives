import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

/**
 * During `expo export --platform web` we may not have Supabase env vars available.
 * We still need the module to load so the router server manifest can be generated.
 *
 * Runtime Supabase calls will fail if real env vars are missing, but static builds
 * must not crash due to invalid/missing configuration.
 */
const rawSupabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const rawAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabaseUrl = rawSupabaseUrl.startsWith('http://') || rawSupabaseUrl.startsWith('https://')
  ? rawSupabaseUrl
  : 'https://example.supabase.co';

const supabaseAnonKey = rawAnonKey.length > 0 ? rawAnonKey : 'public-anon-key';

// Custom storage that handles SSR (no window/localStorage during server render)
const createStorage = () => {
  // During SSR, provide a no-op storage
  if (typeof window === 'undefined') {
    return {
      getItem: async () => null,
      setItem: async () => {},
      removeItem: async () => {},
    };
  }

  // On web, use localStorage directly
  if (Platform.OS === 'web') {
    return {
      getItem: async (key: string) => window.localStorage.getItem(key),
      setItem: async (key: string, value: string) => window.localStorage.setItem(key, value),
      removeItem: async (key: string) => window.localStorage.removeItem(key),
    };
  }

  // On native, use AsyncStorage (lazy import to avoid SSR issues)
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return AsyncStorage;
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});
