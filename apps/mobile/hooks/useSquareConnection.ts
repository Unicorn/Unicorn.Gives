/**
 * Hook for managing a partner's Square connection status and feature config.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseUrl } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

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
  last_synced_at: string | null;
}

export function useSquareConnection(partnerId: string | undefined) {
  const { session } = useAuth();
  const [connection, setConnection] = useState<SquareConnection | null>(null);
  const [featureConfig, setFeatureConfig] = useState<SquareFeatureConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      .select('partner_id, bookings_enabled, subscriptions_enabled, retail_enabled, gift_cards_enabled, last_synced_at')
      .eq('partner_id', partnerId)
      .single();

    setFeatureConfig(config as SquareFeatureConfig | null);
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
  
      const features: string[] = [];
      if (featureConfig?.bookings_enabled) features.push('bookings');
      if (features.length === 0) features.push('bookings'); // default sync

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
  }, [partnerId, session, featureConfig, load]);

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
    reload: load,
  };
}
