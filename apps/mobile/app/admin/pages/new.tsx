import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { PageForm, EMPTY_PAGE, type PageFormData } from '@/components/admin/PageForm';
import { toHref } from '@/lib/navigation';

export default function NewPagePage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('pages');
  const [form, setForm] = useState<PageFormData>({ ...EMPTY_PAGE });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      description: form.description || null,
      body: form.body || '',
      category: form.category || null,
      subcategory: form.subcategory || null,
      nav_title: form.nav_title || null,
      hide_from_nav: form.hide_from_nav,
      display_order: form.display_order,
      department_id: form.department_id || null,
      parent_page_id: form.parent_page_id || null,
      page_type: form.page_type || 'standard',
      redirect_url: form.redirect_url || null,
      audience: form.audience || null,
      template: form.template || null,
      status,
    };
    if (status === 'published') payload.published_at = new Date().toISOString();

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/pages/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create page.');
    }
  }

  return (
    <AdminPageShell
      title="New Page"
      backHref="/admin/pages"
      actions={
        <>
          <AdminButton label="Save Draft" variant="secondary" icon="save" onPress={() => handleSave('draft')} disabled={loading} />
          <AdminButton label="Publish" icon="publish" onPress={() => handleSave('published')} disabled={loading} />
        </>
      }
    >
      <PageForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
