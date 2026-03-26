import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

type UserRole = 'super_admin' | 'municipal_editor' | 'partner_editor' | 'community_contributor' | 'public';

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  region_ids: string[] | null;
  partner_id: string | null;
  is_active: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isEditor: boolean;
  canEditRegion: (regionId: string) => boolean;
  canEditPartner: (partnerId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  }

  async function signUp(email: string, password: string, displayName?: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    return { error: error as Error | null };
  }

  async function signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    return { error: error as Error | null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
  }

  const isAdmin = profile?.role === 'super_admin';
  const isEditor = profile?.role !== 'public' && profile?.role !== undefined;

  function canEditRegion(regionId: string): boolean {
    if (profile?.role === 'super_admin') return true;
    if (profile?.role === 'municipal_editor' && profile.region_ids) {
      return profile.region_ids.includes(regionId);
    }
    return false;
  }

  function canEditPartner(partnerId: string): boolean {
    if (profile?.role === 'super_admin') return true;
    if (profile?.role === 'partner_editor') {
      return profile.partner_id === partnerId;
    }
    return false;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        isLoading,
        signIn,
        signUp,
        signInWithMagicLink,
        signOut,
        isAdmin,
        isEditor,
        canEditRegion,
        canEditPartner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
