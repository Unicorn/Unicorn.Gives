import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export interface MutationResult {
  loading: boolean;
  error: string | null;
  insert: (data: Record<string, unknown>) => Promise<{ id: string } | null>;
  update: (id: string, data: Record<string, unknown>) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  publish: (id: string) => Promise<boolean>;
  archive: (id: string) => Promise<boolean>;
  unpublish: (id: string) => Promise<boolean>;
}

export function useAdminMutation(table: string): MutationResult {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const writeAuditLog = useCallback(
    async (action: string, resourceId: string, changes?: Record<string, unknown>) => {
      if (!user) return;
      await supabase.from('audit_log').insert({
        user_id: user.id,
        actor_display_name: profile?.display_name ?? null,
        actor_email: user.email?.trim() || profile?.email?.trim() || null,
        action,
        resource_type: table,
        resource_id: resourceId,
        changes,
      });
    },
    [user, profile, table],
  );

  const insert = useCallback(
    async (data: Record<string, unknown>): Promise<{ id: string } | null> => {
      setLoading(true);
      setError(null);
      try {
        const payload = { ...data, author_id: user?.id };
        const { data: result, error: insertError } = await supabase
          .from(table)
          .insert(payload)
          .select('id')
          .single();

        if (insertError) throw insertError;
        if (result) {
          await writeAuditLog('create', result.id, payload);
        }
        return result as { id: string };
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Insert failed';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [table, user, writeAuditLog],
  );

  const update = useCallback(
    async (id: string, data: Record<string, unknown>): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const { error: updateError } = await supabase
          .from(table)
          .update(data)
          .eq('id', id);

        if (updateError) throw updateError;
        await writeAuditLog('update', id, data);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Update failed');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [table, writeAuditLog],
  );

  const remove = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
        await writeAuditLog('delete', id);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Delete failed');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [table, writeAuditLog],
  );

  const setStatus = useCallback(
    async (id: string, status: string, action: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const updateData: Record<string, unknown> = { status };
        if (status === 'published' || status === 'approved') {
          updateData.published_at = new Date().toISOString();
        }
        const { error: updateError } = await supabase
          .from(table)
          .update(updateData)
          .eq('id', id);

        if (updateError) throw updateError;
        await writeAuditLog(action, id, { status });
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : `${action} failed`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [table, writeAuditLog],
  );

  const publish = useCallback((id: string) => setStatus(id, 'published', 'publish'), [setStatus]);
  const archive = useCallback((id: string) => setStatus(id, 'archived', 'archive'), [setStatus]);
  const unpublish = useCallback((id: string) => setStatus(id, 'draft', 'unpublish'), [setStatus]);

  return { loading, error, insert, update, remove, publish, archive, unpublish };
}
