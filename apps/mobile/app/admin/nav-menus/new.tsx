import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { NavMenuForm, EMPTY_NAV_MENU, type NavMenuFormData } from '@/components/admin/NavMenuForm';
import { toHref } from '@/lib/navigation';

export default function NewNavMenuPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('nav_menus');
  const [form, setForm] = useState<NavMenuFormData>({ ...EMPTY_NAV_MENU });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      slug: form.slug,
      description: form.description || null,
      location: form.location,
      region_id: form.region_id || null,
      is_active: form.is_active,
    };

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/nav-menus/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create nav menu. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Nav Menu"
      backHref="/admin/nav-menus"
      actions={
        <AdminButton
          label="Save"
          icon="save"
          onPress={handleSave}
          disabled={loading}
        />
      }
    >
      <NavMenuForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
