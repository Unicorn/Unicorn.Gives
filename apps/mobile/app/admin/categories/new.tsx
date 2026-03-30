import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { CategoryForm, EMPTY_CATEGORY, type CategoryFormData } from '@/components/admin/CategoryForm';
import { toHref } from '@/lib/navigation';

export default function NewCategoryPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('categories');
  const [form, setForm] = useState<CategoryFormData>({ ...EMPTY_CATEGORY });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.label.trim()) errs.label = 'Label is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    if (!form.content_type) errs.content_type = 'Content type is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      label: form.label.trim(),
      slug: form.slug.trim(),
      content_type: form.content_type,
      description: form.description || null,
      color: form.color || null,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/categories/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create category. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Category"
      backHref="/admin/categories"
      actions={
        <AdminButton
          label="Save"
          icon="save"
          onPress={handleSave}
          disabled={loading}
        />
      }
    >
      <CategoryForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
