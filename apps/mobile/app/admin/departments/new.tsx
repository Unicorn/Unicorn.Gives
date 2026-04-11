import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { DepartmentForm, EMPTY_DEPARTMENT, type DepartmentFormData } from '@/components/admin/DepartmentForm';
import { toHref } from '@/lib/navigation';

export default function NewDepartmentPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('departments');
  const [form, setForm] = useState<DepartmentFormData>({ ...EMPTY_DEPARTMENT });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;
    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      slug: form.slug,
      short_name: form.short_name || null,
      description: form.description || null,
      body: form.body || null,
      phone: form.phone || null,
      fax: form.fax || null,
      email: form.email || null,
      address: form.address || null,
      hours: form.hours || null,
      website: form.website || null,
      hero_image_url: form.hero_image_url || null,
      icon: form.icon || null,
      display_order: form.display_order,
      hide_from_nav: form.hide_from_nav,
      parent_department_id: form.parent_department_id || null,
      region_id: form.region_id,
      status,
    };

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/departments/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create department.');
    }
  }

  return (
    <AdminPageShell
      title="New Department"
      backHref="/admin/departments"
      actions={
        <>
          <AdminButton label="Save Draft" variant="secondary" icon="save" onPress={() => handleSave('draft')} disabled={loading} />
          <AdminButton label="Publish" icon="publish" onPress={() => handleSave('published')} disabled={loading} />
        </>
      }
    >
      <DepartmentForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
