import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { MinutesForm, EMPTY_MINUTES, type MinutesFormData } from '@/components/admin/MinutesForm';
import { toHref } from '@/lib/navigation';

export default function NewMinutesPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('minutes');
  const [form, setForm] = useState<MinutesFormData>({ ...EMPTY_MINUTES });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.date) errs.date = 'Date is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'approved') {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      date: form.date,
      meeting_type: form.meeting_type || null,
      source: form.source || null,
      body: form.body || null,
      pdf_url: form.pdf_url || null,
      attendees_present: form.attendees_present.length > 0 ? form.attendees_present : null,
      attendees_absent: form.attendees_absent.length > 0 ? form.attendees_absent : null,
      attendees_also_present: form.attendees_also_present.length > 0 ? form.attendees_also_present : null,
      region_id: form.region_id,
      status,
    };

    if (status === 'approved') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/minutes/${result.id}`));
    } else {
      if (Platform.OS === 'web') {
        window.alert('Failed to create minutes. Check the console for details.');
      }
    }
  }

  return (
    <AdminPageShell
      title="New Minutes"
      backHref="/admin/minutes"
      actions={
        <>
          <AdminButton
            label="Save Draft"
            variant="secondary"
            icon="save"
            onPress={() => handleSave('draft')}
            disabled={loading}
          />
          <AdminButton
            label="Approve"
            icon="check-circle"
            onPress={() => handleSave('approved')}
            disabled={loading}
          />
        </>
      }
    >
      <MinutesForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
