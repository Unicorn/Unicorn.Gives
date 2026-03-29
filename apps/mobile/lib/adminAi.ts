import { supabase } from '@/lib/supabase';

export type AdminAiAction = 'event_body' | 'event_cover';

export type EventAiContext = {
  event_id?: string;
  title?: string;
  description?: string;
  date?: string;
  end_date?: string;
  time?: string;
  location?: string;
  category?: string;
  instructions?: string;
  style?: string;
  existing_body?: string;
};

export async function invokeAdminAi(params: {
  action: AdminAiAction;
  context: EventAiContext;
  mode?: 'replace' | 'append';
}): Promise<{ html?: string; imageUrl?: string }> {
  const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!supabaseUrl.startsWith('http')) {
    throw new Error('EXPO_PUBLIC_SUPABASE_URL is not configured.');
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('You must be signed in to use AI features.');
  }

  const res = await fetch(`${supabaseUrl}/functions/v1/admin-ai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      apikey: anonKey,
    },
    body: JSON.stringify({
      action: params.action,
      context: params.context,
      mode: params.mode ?? 'replace',
    }),
  });

  const payload = (await res.json().catch(() => ({}))) as { error?: string; html?: string; imageUrl?: string };

  if (!res.ok) {
    throw new Error(
      typeof payload.error === 'string' ? payload.error : `Request failed (${res.status})`,
    );
  }

  return payload;
}
