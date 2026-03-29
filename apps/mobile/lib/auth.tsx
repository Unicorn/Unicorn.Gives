import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from './supabase';

interface Profile {
  display_name: string | null;
  email: string;
  avatar_url: string | null;
  role: string;
}

type AuthContextValue = {
  user: User | null;
  role: string | null;
  profile: Profile | null;
  loading: boolean;
  session: Session | null;
  isEditor: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchProfileForUser(user: User): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role, display_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) return null;
  return {
    role: data.role ?? 'public',
    display_name: data.display_name ?? null,
    email: user.email ?? '',
    avatar_url: data.avatar_url ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const role = profile?.role ?? null;
  const isEditor =
    role === 'super_admin' ||
    role === 'municipal_editor' ||
    role === 'partner_editor' ||
    role === 'community_contributor';

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let initialDone = false;

    // Use onAuthStateChange for everything — it fires INITIAL_SESSION on mount,
    // which replaces the need for a separate getSession() + init() call.
    const { data: subscriptionData } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (cancelled) return;

      const nextUser = nextSession?.user ?? null;
      setSession(nextSession ?? null);
      setUser(nextUser);

      // Silent refresh: keep profile and don't flip global loading (avoids admin UI freeze).
      if (event === 'TOKEN_REFRESHED' && initialDone) {
        if (!nextUser) setProfile(null);
        setLoading(false);
        return;
      }

      // Only set loading=true on subsequent auth changes, not the initial one
      // (loading is already true from useState default)
      if (initialDone) setLoading(true);

      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        initialDone = true;
        return;
      }

      const nextProfile = await fetchProfileForUser(nextUser);
      if (cancelled) {
        setLoading(false);
        return;
      }

      setProfile(nextProfile);
      setLoading(false);
      initialDone = true;
    });

    return () => {
      cancelled = true;
      subscriptionData?.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const next = await fetchProfileForUser(user);
    setProfile(next);
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      profile,
      loading,
      session,
      isEditor,
      signOut,
      refreshProfile,
    }),
    [user, role, profile, loading, session, isEditor, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
