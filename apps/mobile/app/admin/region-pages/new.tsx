import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { RegionPageForm, EMPTY_REGION_PAGE, type RegionPageFormData } from '@/components/admin/RegionPageForm';
import { toHref } from '@/lib/navigation';

export default function NewRegionPagePage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('region_pages');
  const [form, setForm] = useState<RegionPageFormData>({ ...EMPTY_REGION_PAGE });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
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
      category: form.category || null,
      display_order: form.display_order,
      region_id: form.region_id,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/region-pages/${result.id}`));
    } else {
      if (Platform.OS === 'web') {
        window.alert('Failed to create region page. Check the console for details.');
      }
    }
  }

  return (
    <AdminPageShell
      title="New Region Page"
      backHref="/admin/region-pages"
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
      <RegionPageForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
