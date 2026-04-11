import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { QuickLinkForm, EMPTY_QUICK_LINK, type QuickLinkFormData } from '@/components/admin/QuickLinkForm';
import { toHref } from '@/lib/navigation';

export default function NewQuickLinkPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('quick_links');
  const [form, setForm] = useState<QuickLinkFormData>({ ...EMPTY_QUICK_LINK });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.url.trim()) errs.url = 'URL is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      url: form.url.trim(),
      description: form.description || null,
      icon: form.icon || null,
      link_group: form.link_group,
      is_external: form.is_external,
      open_in_new_tab: form.open_in_new_tab,
      display_order: form.display_order,
      region_id: form.region_id || null,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/quick-links/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create quick link. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Quick Link"
      backHref="/admin/quick-links"
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
      <QuickLinkForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
