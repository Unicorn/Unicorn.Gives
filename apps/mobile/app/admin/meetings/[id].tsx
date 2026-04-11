import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { MeetingForm, EMPTY_MEETING, type MeetingFormData } from '@/components/admin/MeetingForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditMeetingPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('meetings');
  const [form, setForm] = useState<MeetingFormData>({ ...EMPTY_MEETING });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('meetings').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error || !data) { setLoading(false); return; }
        setForm({
          title: data.title ?? '', slug: data.slug ?? '', board_id: data.board_id ?? '',
          meeting_type: data.meeting_type ?? 'regular', meeting_date: data.meeting_date ?? '',
          start_time: data.start_time ?? '', end_time: data.end_time ?? '',
          location: data.location ?? '', location_url: data.location_url ?? '',
          agenda_url: data.agenda_url ?? '', agenda_body: data.agenda_body ?? '',
          packet_url: data.packet_url ?? '', video_url: data.video_url ?? '',
          minutes_id: data.minutes_id ?? '',
          is_cancelled: data.is_cancelled ?? false, cancellation_notice: data.cancellation_notice ?? '',
          region_id: data.region_id ?? '',
        });
        setStatus(data.status ?? 'draft');
        setLoading(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.meeting_date) errs.meeting_date = 'Date is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate() || !id) return;
    const payload: Record<string, unknown> = {
      title: form.title.trim(), slug: form.slug, board_id: form.board_id || null,
      meeting_type: form.meeting_type, meeting_date: form.meeting_date,
      start_time: form.start_time || null, end_time: form.end_time || null,
      location: form.location || null, location_url: form.location_url || null,
      agenda_url: form.agenda_url || null, agenda_body: form.agenda_body || null,
      packet_url: form.packet_url || null, video_url: form.video_url || null,
      minutes_id: form.minutes_id || null,
      is_cancelled: form.is_cancelled, cancellation_notice: form.cancellation_notice || null,
      region_id: form.region_id,
    };
    const success = await update(id, payload);
    if (success && Platform.OS === 'web') window.alert('Meeting saved successfully.');
  }

  async function handlePublish() { if (!id) return; const s = await publish(id); if (s) setStatus('published'); }
  async function handleUnpublish() { if (!id) return; const s = await unpublish(id); if (s) setStatus('draft'); }
  async function handleArchive() { if (!id) return; const s = await archive(id); if (s) setStatus('archived'); }
  async function handleDelete() {
    if (!id) return;
    const success = await remove(id);
    if (success) router.replace(toHref('/admin/meetings'));
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading meeting...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell title="Edit Meeting" backHref="/admin/meetings" actions={
      <>
        <AdminStatusBadge status={status} />
        {status === 'draft' && <AdminButton label="Publish" icon="publish" onPress={handlePublish} disabled={mutating} />}
        {status === 'published' && <AdminButton label="Unpublish" variant="secondary" icon="unpublished" onPress={handleUnpublish} disabled={mutating} />}
        {status !== 'archived' && <AdminButton label="Archive" variant="secondary" icon="archive" onPress={handleArchive} disabled={mutating} />}
        <AdminButton label="Save" icon="save" onPress={handleSave} disabled={mutating} />
        <AdminButton label="Delete" variant="danger" icon="delete" onPress={() => setShowDelete(true)} disabled={mutating} />
      </>
    }>
      <MeetingForm data={form} onChange={setForm} errors={errors} />
      <AdminConfirmDialog visible={showDelete} title="Delete Meeting" message={`Permanently delete "${form.title}"?`} confirmLabel="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontFamily: fonts.sans, fontSize: 14, color: colors.neutralVariant },
  });
