import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { MeetingForm, EMPTY_MEETING, type MeetingFormData } from '@/components/admin/MeetingForm';
import { toHref } from '@/lib/navigation';

export default function NewMeetingPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('meetings');
  const [form, setForm] = useState<MeetingFormData>({ ...EMPTY_MEETING });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.meeting_date) errs.meeting_date = 'Date is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;
    const payload: Record<string, unknown> = {
      title: form.title.trim(), slug: form.slug, board_id: form.board_id || null,
      meeting_type: form.meeting_type, meeting_date: form.meeting_date,
      start_time: form.start_time || null, end_time: form.end_time || null,
      location: form.location || null, location_url: form.location_url || null,
      agenda_url: form.agenda_url || null, agenda_body: form.agenda_body || null,
      packet_url: form.packet_url || null, video_url: form.video_url || null,
      minutes_id: form.minutes_id || null,
      is_cancelled: form.is_cancelled, cancellation_notice: form.cancellation_notice || null,
      region_id: form.region_id, status,
    };
    const result = await insert(payload);
    if (result) router.replace(toHref(`/admin/meetings/${result.id}`));
    else if (Platform.OS === 'web') window.alert('Failed to create meeting.');
  }

  return (
    <AdminPageShell title="New Meeting" backHref="/admin/meetings" actions={
      <>
        <AdminButton label="Save Draft" variant="secondary" icon="save" onPress={() => handleSave('draft')} disabled={loading} />
        <AdminButton label="Publish" icon="publish" onPress={() => handleSave('published')} disabled={loading} />
      </>
    }>
      <MeetingForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
