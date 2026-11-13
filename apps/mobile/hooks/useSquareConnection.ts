/**
 * Hook for managing a partner's Square connection status and feature config.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseUrl } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { cachedTiers, type CachedTier } from '@/lib/partners/membershipPricing';

interface SquareLocation {
  id: string;
  name: string;
}

export interface SquareConnection {
  partner_id: string;
  merchant_id: string;
  location_id: string | null;
  location_ids: SquareLocation[];
  token_expires_at: string | null;
  environment: string;
  created_at: string;
}

export interface SquareFeatureConfig {
  partner_id: string;
  bookings_enabled: boolean;
  subscriptions_enabled: boolean;
  retail_enabled: boolean;
  gift_cards_enabled: boolean;
  /** Square plan whose variations are the membership tiers. */
  membership_plan_id: string | null;
  last_synced_at: string | null;
}

export function useSquareConnection(partnerId: string | undefined) {
  const { session } = useAuth();
  const [connection, setConnection] = useState<SquareConnection | null>(null);
  const [featureConfig, setFeatureConfig] = useState<SquareFeatureConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<CachedTier[]>([]);

  const load = useCallback(async () => {
    if (!partnerId) return;
    setLoading(true);

    const { data: conn } = await supabase
      .from('square_connections')
      .select('partner_id, merchant_id, location_id, location_ids, token_expires_at, environment, created_at')
      .eq('partner_id', partnerId)
      .single();

    setConnection(conn as SquareConnection | null);

    const { data: config } = await supabase
      .from('square_feature_config')
      .select('partner_id, bookings_enabled, subscriptions_enabled, retail_enabled, gift_cards_enabled, membership_plan_id, last_synced_at')
      .eq('partner_id', partnerId)
      .single();

    setFeatureConfig(config as SquareFeatureConfig | null);

    const planId = (config as SquareFeatureConfig | null)?.membership_plan_id;
    if (planId) {
      const { data: rows } = await supabase
        .from('square_catalog_cache')
        .select('square_id, display_name, data')
        .eq('partner_id', partnerId)
        .eq('data_type', 'subscription_plan')
        .eq('is_active', true);
      setTiers(cachedTiers(rows, planId));
    } else {
      setTiers([]);
    }
    setLoading(false);
  }, [partnerId]);

  useEffect(() => { load(); }, [load]);

  const startOAuth = useCallback(() => {
    if (!partnerId) return;

    const oauthUrl = `${supabaseUrl}/functions/v1/square-oauth?action=authorize&partner_id=${partnerId}`;
    const { Linking } = require('react-native');
    Linking.openURL(oauthUrl);
  }, [partnerId]);

  const disconnect = useCallback(async () => {
    if (!partnerId || !session?.access_token) return;
    setLoading(true);
    setError(null);
    try {
  
      const res = await fetch(`${supabaseUrl}/functions/v1/square-oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'disconnect', partner_id: partnerId }),
      });
      if (!res.ok) throw new Error('Disconnect failed');
      setConnection(null);
      setFeatureConfig(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Disconnect failed');
    } finally {
      setLoading(false);
    }
  }, [partnerId, session]);

  const updateFeature = useCallback(async (
    feature: keyof Pick<SquareFeatureConfig, 'bookings_enabled' | 'subscriptions_enabled' | 'retail_enabled' | 'gift_cards_enabled'>,
    enabled: boolean,
  ) => {
    if (!partnerId) return;
    const { error: err } = await supabase
      .from('square_feature_config')
      .update({ [feature]: enabled })
      .eq('partner_id', partnerId);

    if (err) {
      setError(err.message);
    } else {
      setFeatureConfig((prev) => prev ? { ...prev, [feature]: enabled } : null);
    }
  }, [partnerId]);

  const updateLocation = useCallback(async (locationId: string) => {
    if (!partnerId) return;
    const { error: err } = await supabase
      .from('square_connections')
      .update({ location_id: locationId })
      .eq('partner_id', partnerId);

    if (err) {
      setError(err.message);
    } else {
      setConnection((prev) => prev ? { ...prev, location_id: locationId } : null);
    }
  }, [partnerId]);

  const syncNow = useCallback(async () => {
    if (!partnerId || !session?.access_token) return;
    setSyncing(true);
    setError(null);
    try {
  
      // Plans sync only once a membership plan is set, so asking is harmless.
      const features = ['bookings', 'subscriptions'];

      const res = await fetch(`${supabaseUrl}/functions/v1/square-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ partner_id: partnerId, features }),
      });

      if (!res.ok) throw new Error('Sync failed');
      await load(); // Refresh data
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }, [partnerId, session, load]);

  /** Create the membership tiers in Square. Resolves to an error message, or null on success. */
  const createMembershipPlan = useCallback(async (
    planName: string,
    drafts: Array<{ name: string; amountCents: number }>,
  ): Promise<string | null> => {
    if (!partnerId || !session?.access_token) return 'Sign in again to continue';
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/square-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: 'create_membership_plan', partner_id: partnerId, plan_name: planName, tiers: drafts }),
      });
      const data = await res.json().catch(() => ({})) as { error?: string };
      if (!res.ok) return data.error ?? 'Creating the tiers failed';
      await load();
      return null;
    } catch (e) {
      return e instanceof Error ? e.message : 'Creating the tiers failed';
    }
  }, [partnerId, session, load]);

  return {
    connection,
    featureConfig,
    loading,
    syncing,
    error,
    startOAuth,
    disconnect,
    updateFeature,
    updateLocation,
    syncNow,
    tiers,
    createMembershipPlan,
    reload: load,
  };
}
