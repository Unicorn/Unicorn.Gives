import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { BoardForm, EMPTY_BOARD, type BoardFormData } from '@/components/admin/BoardForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditBoardPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('boards_commissions');
  const [form, setForm] = useState<BoardFormData>({ ...EMPTY_BOARD });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('boards_commissions').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error || !data) { setLoading(false); return; }
        setForm({
          name: data.name ?? '', slug: data.slug ?? '', description: data.description ?? '',
          body: data.body ?? '', board_type: data.board_type ?? 'board',
          department_id: data.department_id ?? '', meeting_schedule: data.meeting_schedule ?? '',
          meeting_location: data.meeting_location ?? '',
          membership_count: data.membership_count ?? 0, term_length_years: data.term_length_years ?? 0,
          vacancy_count: data.vacancy_count ?? 0, accepting_applications: data.accepting_applications ?? false,
          application_url: data.application_url ?? '', website: data.website ?? '',
          display_order: data.display_order ?? 0, region_id: data.region_id ?? '',
        });
        setStatus(data.status ?? 'draft');
        setLoading(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate() || !id) return;
    const payload: Record<string, unknown> = {
      name: form.name.trim(), slug: form.slug, description: form.description || null,
      body: form.body || null, board_type: form.board_type,
      department_id: form.department_id || null,
      meeting_schedule: form.meeting_schedule || null,
      meeting_location: form.meeting_location || null,
      membership_count: form.membership_count || null,
      term_length_years: form.term_length_years || null,
      vacancy_count: form.vacancy_count,
      accepting_applications: form.accepting_applications,
      application_url: form.application_url || null,
      website: form.website || null,
      display_order: form.display_order, region_id: form.region_id,
    };
    const success = await update(id, payload);
    if (success && Platform.OS === 'web') window.alert('Board saved successfully.');
  }

  async function handlePublish() { if (!id) return; const s = await publish(id); if (s) setStatus('published'); }
  async function handleUnpublish() { if (!id) return; const s = await unpublish(id); if (s) setStatus('draft'); }
  async function handleArchive() { if (!id) return; const s = await archive(id); if (s) setStatus('archived'); }
  async function handleDelete() {
    if (!id) return;
    const success = await remove(id);
    if (success) router.replace(toHref('/admin/boards'));
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading board...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell title="Edit Board / Commission" backHref="/admin/boards" actions={
      <>
        <AdminStatusBadge status={status} />
        {status === 'draft' && <AdminButton label="Publish" icon="publish" onPress={handlePublish} disabled={mutating} />}
        {status === 'published' && <AdminButton label="Unpublish" variant="secondary" icon="unpublished" onPress={handleUnpublish} disabled={mutating} />}
        {status !== 'archived' && <AdminButton label="Archive" variant="secondary" icon="archive" onPress={handleArchive} disabled={mutating} />}
        <AdminButton label="Save" icon="save" onPress={handleSave} disabled={mutating} />
        <AdminButton label="Delete" variant="danger" icon="delete" onPress={() => setShowDelete(true)} disabled={mutating} />
      </>
    }>
      <BoardForm data={form} onChange={setForm} errors={errors} />
      <AdminConfirmDialog visible={showDelete} title="Delete Board" message={`Permanently delete "${form.name}"?`} confirmLabel="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontFamily: fonts.sans, fontSize: 14, color: colors.neutralVariant },
  });
