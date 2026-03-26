import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from './supabase';

type AuthContextValue = {
  user: User | null;
  role: string | null;
  loading: boolean;
  session: Session | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchRoleForUser(user: User): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (error) return null;
  return data?.role ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      const nextSession = data.session ?? null;
      setSession(nextSession);

      const nextUser = nextSession?.user ?? null;
      setUser(nextUser);

      if (!nextUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      const nextRole = await fetchRoleForUser(nextUser);
      if (cancelled) return;

      setRole(nextRole);
      setLoading(false);
    }

    init();

    const { data: subscriptionData } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (cancelled) return;

      const nextUser = nextSession?.user ?? null;
      setSession(nextSession ?? null);
      setUser(nextUser);
      setLoading(true);

      if (!nextUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      const nextRole = await fetchRoleForUser(nextUser);
      if (cancelled) return;

      setRole(nextRole);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscriptionData?.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role,
      loading,
      session,
    }),
    [user, role, loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

