/**
 * Hooks for Square bookings data — services, availability, and creating bookings.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase, supabaseUrl } from '@/lib/supabase';

/* ── Types ── */

export interface SquareService {
  id: string;
  square_id: string;
  display_name: string | null;
  display_order: number;
  data: {
    id: string;
    item_data?: {
      name?: string;
      description?: string;
      variations?: Array<{
        id: string;
        item_variation_data?: {
          name?: string;
          price_money?: { amount?: number; currency?: string };
          service_duration?: number; // milliseconds
        };
      }>;
    };
  };
}

export interface SquareTeamMember {
  id: string;
  square_id: string;
  display_name: string | null;
  data: {
    id: string;
    given_name?: string;
    family_name?: string;
  };
}

export interface AvailabilitySlot {
  start_at: string;
  location_id: string;
  appointment_segments: Array<{
    duration_minutes: number;
    team_member_id: string;
    service_variation_id: string;
    service_variation_version: number;
  }>;
}

export interface BookingCustomer {
  given_name: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
}

/* ── useSquareServices ── */

export function useSquareServices(partnerId: string | undefined) {
  const [services, setServices] = useState<SquareService[]>([]);
  const [teamMembers, setTeamMembers] = useState<SquareTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partnerId) return;

    async function load() {
      setLoading(true);

      const [servicesRes, teamRes] = await Promise.all([
        supabase
          .from('square_bookings_cache')
          .select('id, square_id, display_name, display_order, data')
          .eq('partner_id', partnerId!)
          .eq('data_type', 'service')
          .eq('is_active', true)
          .order('display_order'),
        supabase
          .from('square_bookings_cache')
          .select('id, square_id, display_name, data')
          .eq('partner_id', partnerId!)
          .eq('data_type', 'team_member')
          .eq('is_active', true),
      ]);

      setServices((servicesRes.data ?? []) as SquareService[]);
      setTeamMembers((teamRes.data ?? []) as SquareTeamMember[]);
      setLoading(false);
    }

    load();
  }, [partnerId]);

  return { services, teamMembers, loading };
}

/* ── useSquareAvailability ── */

export function useSquareAvailability(
  partnerId: string | undefined,
  serviceVariationId: string | undefined,
  startAt: string | undefined,
  endAt: string | undefined,
  teamMemberId?: string,
) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!partnerId || !serviceVariationId || !startAt || !endAt) return;

    setLoading(true);
    setError(null);

    try {

      const res = await fetch(`${supabaseUrl}/functions/v1/square-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'search_availability',
          partner_id: partnerId,
          service_variation_id: serviceVariationId,
          start_at: startAt,
          end_at: endAt,
          ...(teamMemberId ? { team_member_id: teamMemberId } : {}),
        }),
      });

      if (!res.ok) throw new Error('Failed to search availability');

      const data = await res.json();
      setSlots(data.availabilities ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to search availability');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [partnerId, serviceVariationId, startAt, endAt, teamMemberId]);

  useEffect(() => { search(); }, [search]);

  return { slots, loading, error, refresh: search };
}

/* ── useCreateBooking ── */

export function useCreateBooking(partnerId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);

  const create = useCallback(async (params: {
    service_variation_id: string;
    team_member_id?: string;
    start_at: string;
    customer: BookingCustomer;
    note?: string;
  }) => {
    if (!partnerId) return null;

    setLoading(true);
    setError(null);

    try {

      const res = await fetch(`${supabaseUrl}/functions/v1/square-bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_booking',
          partner_id: partnerId,
          ...params,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error ?? 'Failed to create booking');
      }

      const data = await res.json();
      setBooking(data.booking ?? data);
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to create booking';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [partnerId]);

  return { create, loading, error, booking };
}

/* ── useSquareFeatureConfig (public read) ── */

export function useSquareFeatureConfig(partnerId: string | undefined) {
  const [config, setConfig] = useState<{
    bookings_enabled: boolean;
    subscriptions_enabled: boolean;
    retail_enabled: boolean;
    gift_cards_enabled: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partnerId) { setLoading(false); return; }

    supabase
      .from('square_feature_config')
      .select('bookings_enabled, subscriptions_enabled, retail_enabled, gift_cards_enabled')
      .eq('partner_id', partnerId)
      .single()
      .then(({ data }) => {
        setConfig(data);
        setLoading(false);
      });
  }, [partnerId]);

  return { config, loading };
}
