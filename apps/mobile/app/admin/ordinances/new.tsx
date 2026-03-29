import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { OrdinanceForm, EMPTY_ORDINANCE, type OrdinanceFormData } from '@/components/admin/OrdinanceForm';
import { toHref } from '@/lib/navigation';

export default function NewOrdinancePage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('ordinances');
  const [form, setForm] = useState<OrdinanceFormData>({ ...EMPTY_ORDINANCE });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      number: form.number ? parseInt(form.number, 10) : null,
      description: form.description || null,
      body: form.body || null,
      category: form.category,
      adopted_date: form.adopted_date || null,
      amended_date: form.amended_date || null,
      pdf_url: form.pdf_url || null,
      region_id: form.region_id || null,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/ordinances/${result.id}`));
    } else {
      if (Platform.OS === 'web') {
        window.alert('Failed to create ordinance. Check the console for details.');
      }
    }
  }

  return (
    <AdminPageShell
      title="New Ordinance"
      backHref="/admin/ordinances"
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
      <OrdinanceForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
