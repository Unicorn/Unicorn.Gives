import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { ElectionForm, EMPTY_ELECTION, type ElectionFormData } from '@/components/admin/ElectionForm';
import { toHref } from '@/lib/navigation';

export default function NewElectionPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('elections');
  const [form, setForm] = useState<ElectionFormData>({ ...EMPTY_ELECTION });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.election_date) errs.election_date = 'Election date is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      description: form.description || null,
      body: form.body || null,
      election_date: form.election_date,
      type: form.type,
      registration_deadline: form.registration_deadline || null,
      absentee_deadline: form.absentee_deadline || null,
      region_id: form.region_id || null,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/elections/${result.id}`));
    } else {
      if (Platform.OS === 'web') {
        window.alert('Failed to create election. Check the console for details.');
      }
    }
  }

  return (
    <AdminPageShell
      title="New Election"
      backHref="/admin/elections"
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
            label="Publish"
            icon="publish"
            onPress={() => handleSave('published')}
            disabled={loading}
          />
        </>
      }
    >
      <ElectionForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
