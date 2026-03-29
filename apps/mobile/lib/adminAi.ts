import { FunctionsHttpError } from '@supabase/supabase-js';

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
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('You must be signed in to use AI features.');
  }

  // Pass the user JWT explicitly so fetchWithAuth does not fall back to the anon key
  // as Bearer (which the Functions gateway may reject when verify_jwt is enabled).
  const { data, error } = await supabase.functions.invoke('admin-ai', {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: {
      action: params.action,
      context: params.context,
      mode: params.mode ?? 'replace',
    },
  });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const body = (await error.context.clone().json().catch(() => null)) as {
        error?: string;
      } | null;
      const msg =
        typeof body?.error === 'string'
          ? body.error
          : `${error.message} (${error.context.status})`;
      throw new Error(msg);
    }
    throw new Error(error.message || 'AI request failed');
  }

  if (
    data &&
    typeof data === 'object' &&
    'error' in data &&
    typeof (data as { error: unknown }).error === 'string'
  ) {
    throw new Error((data as { error: string }).error);
  }

  return data as { html?: string; imageUrl?: string };
}
