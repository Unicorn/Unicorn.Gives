import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AudienceForm, EMPTY_AUDIENCE, type AudienceFormData } from '@/components/admin/AudienceForm';
import { toHref } from '@/lib/navigation';

export default function NewAudiencePage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('audiences');
  const [form, setForm] = useState<AudienceFormData>({ ...EMPTY_AUDIENCE });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.label.trim()) errs.label = 'Label is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      label: form.label.trim(),
      slug: form.slug.trim(),
      description: form.description || null,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/audiences/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create audience. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Audience"
      backHref="/admin/audiences"
      actions={
        <AdminButton
          label="Save"
          icon="save"
          onPress={handleSave}
          disabled={loading}
        />
      }
    >
      <AudienceForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
