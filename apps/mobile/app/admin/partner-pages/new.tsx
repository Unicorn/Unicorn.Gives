import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { PartnerPageForm, EMPTY_PARTNER_PAGE, type PartnerPageFormData } from '@/components/admin/PartnerPageForm';
import { toHref } from '@/lib/navigation';

export default function NewPartnerPagePage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('partner_pages');
  const [form, setForm] = useState<PartnerPageFormData>({ ...EMPTY_PARTNER_PAGE });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.partner_id) errs.partner_id = 'Partner is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      body: form.body || null,
      tab_slug: form.tab_slug || null,
      display_order: form.display_order,
      partner_id: form.partner_id,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/partner-pages/${result.id}`));
    } else {
      if (Platform.OS === 'web') {
        window.alert('Failed to create partner page. Check the console for details.');
      }
    }
  }

  return (
    <AdminPageShell
      title="New Partner Page"
      backHref="/admin/partner-pages"
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
      <PartnerPageForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
