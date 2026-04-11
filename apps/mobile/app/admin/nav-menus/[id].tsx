import { useEffect, useState } from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { NavMenuForm, type NavMenuFormData, EMPTY_NAV_MENU } from '@/components/admin/NavMenuForm';
import { toHref } from '@/lib/navigation';
import { useTheme } from '@/constants/theme';

export default function EditNavMenuPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { update, remove, loading } = useAdminMutation('nav_menus');

  const [form, setForm] = useState<NavMenuFormData>({ ...EMPTY_NAV_MENU });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('nav_menus')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            name: data.name ?? '',
            slug: data.slug ?? '',
            description: data.description ?? '',
            location: data.location ?? 'header',
            region_id: data.region_id ?? '',
            is_active: data.is_active ?? true,
          });
        }
        setFetching(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!id || !validate()) return;

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      slug: form.slug,
      description: form.description || null,
      location: form.location,
      region_id: form.region_id || null,
      is_active: form.is_active,
    };

    const success = await update(id, payload);
    if (success && Platform.OS === 'web') {
      window.alert('Nav menu saved successfully.');
    }
  }

  async function handleDelete() {
    if (!id) return;
    const success = await remove(id);
    if (success) {
      router.replace(toHref('/admin/nav-menus'));
    }
    setDeleteOpen(false);
  }

  if (fetching) {
    return (
      <AdminPageShell title="Edit Nav Menu" backHref="/admin/nav-menus">
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="Edit Nav Menu"
      backHref="/admin/nav-menus"
      actions={
        <>
          <AdminButton
            label="Delete"
            variant="danger"
            icon="delete"
            onPress={() => setDeleteOpen(true)}
            disabled={loading}
          />
          <AdminButton
            label="Save"
            icon="save"
            onPress={handleSave}
            disabled={loading}
          />
        </>
      }
    >
      <NavMenuForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={deleteOpen}
        title="Delete Nav Menu"
        message={`Are you sure you want to delete "${form.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </AdminPageShell>
  );
}
