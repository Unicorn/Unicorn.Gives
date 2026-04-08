/**
 * Hooks for the authenticated "My Account" surface — reads the user's own
 * Square subscriptions and bookings (RLS enforces ownership) and wraps the
 * square-account edge function for state changes.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseUrl } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export interface MySubscription {
  id: string;
  partner_id: string;
  square_subscription_id: string | null;
  plan_variation_id: string | null;
  tier: string | null;
  customer_name: string | null;
  customer_email: string | null;
  status: 'pending' | 'active' | 'paused' | 'canceled' | 'deactivated';
  started_at: string | null;
  canceled_at: string | null;
  current_period_end: string | null;
  next_billing_at: string | null;
  cancel_at_period_end: boolean;
  updated_at: string;
}

export interface MyBooking {
  id: string;
  partner_id: string;
  square_booking_id: string;
  start_at: string | null;
  status: string | null;
  service_variation_id: string | null;
  team_member_id: string | null;
}

async function getAuthHeaders(): Promise<HeadersInit | null> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) return null;
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function callAccount<T = unknown>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const headers = await getAuthHeaders();
  if (!headers) throw new Error('Not signed in');
  const res = await fetch(`${supabaseUrl}/functions/v1/square-account`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function useMySubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<MySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: e } = await supabase
      .from('square_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (e) setError(e.message);
    setSubscriptions((data ?? []) as MySubscription[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { reload(); }, [reload]);

  // Realtime: webhook updates should push into the list without manual refresh.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`my-subs-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'square_subscriptions', filter: `user_id=eq.${user.id}` },
        () => { reload(); },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, reload]);

  return { subscriptions, loading, error, reload };
}

export function useMyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('square_bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('start_at', { ascending: false })
      .limit(50);
    setBookings((data ?? []) as MyBooking[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { reload(); }, [reload]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`my-bookings-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'square_bookings', filter: `user_id=eq.${user.id}` },
        () => { reload(); },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, reload]);

  return { bookings, loading, reload };
}

export function useSubscriptionActions() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(action: string, payload: Record<string, unknown>) {
    setBusy(action);
    setError(null);
    try {
      return await callAccount(action, payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
      return null;
    } finally {
      setBusy(null);
    }
  }

  return {
    busy,
    error,
    pause: (id: string) => run('pause_subscription', { subscription_id: id }),
    resume: (id: string) => run('resume_subscription', { subscription_id: id }),
    cancel: (id: string) => run('cancel_subscription', { subscription_id: id }),
    paymentMethodLink: (partnerId: string) =>
      run('payment_method_link', { partner_id: partnerId }) as Promise<{ url: string } | null>,
  };
}

export function useAccountRefresh() {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await callAccount('refresh');
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Refresh failed');
      return false;
    } finally {
      setRefreshing(false);
    }
  }, []);

  return { refresh, refreshing, error };
}
