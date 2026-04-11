import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { PublicNoticeForm, EMPTY_PUBLIC_NOTICE, type PublicNoticeFormData } from '@/components/admin/PublicNoticeForm';
import { toHref } from '@/lib/navigation';

export default function NewPublicNoticePage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('public_notices');
  const [form, setForm] = useState<PublicNoticeFormData>({ ...EMPTY_PUBLIC_NOTICE });
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
      notice_type: form.notice_type,
      severity: form.severity,
      department_id: form.department_id || null,
      publish_date: form.publish_date || null,
      expiration_date: form.expiration_date || null,
      is_pinned: form.is_pinned,
      attachment_url: form.attachment_url || null,
      contact_name: form.contact_name || null,
      contact_phone: form.contact_phone || null,
      contact_email: form.contact_email || null,
      region_id: form.region_id || null,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/public-notices/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create notice. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Public Notice"
      backHref="/admin/public-notices"
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
      <PublicNoticeForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
