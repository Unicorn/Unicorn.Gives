import { useEffect, useState } from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { CategoryForm, type CategoryFormData, EMPTY_CATEGORY } from '@/components/admin/CategoryForm';
import { toHref } from '@/lib/navigation';
import { useTheme } from '@/constants/theme';

export default function EditCategoryPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { update, remove, loading } = useAdminMutation('categories');

  const [form, setForm] = useState<CategoryFormData>({ ...EMPTY_CATEGORY });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            label: data.label ?? '',
            slug: data.slug ?? '',
            content_type: data.content_type ?? '',
            description: data.description ?? '',
            color: data.color ?? '',
            display_order: data.display_order ?? 0,
            is_active: data.is_active ?? true,
          });
        }
        setFetching(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.label.trim()) errs.label = 'Label is required';
    if (!form.slug.trim()) errs.slug = 'Slug is required';
    if (!form.content_type) errs.content_type = 'Content type is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!id || !validate()) return;

    const payload: Record<string, unknown> = {
      label: form.label.trim(),
      slug: form.slug.trim(),
      content_type: form.content_type,
      description: form.description || null,
      color: form.color || null,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    const success = await update(id, payload);
    if (success && Platform.OS === 'web') {
      window.alert('Category saved successfully.');
    }
  }

  async function handleDelete() {
    if (!id) return;
    const success = await remove(id);
    if (success) {
      router.replace(toHref('/admin/categories'));
    }
    setDeleteOpen(false);
  }

  if (fetching) {
    return (
      <AdminPageShell title="Edit Category" backHref="/admin/categories">
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="Edit Category"
      backHref="/admin/categories"
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
      <CategoryForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={deleteOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${form.label}"? Content using this category will keep its current value but it won't appear in dropdowns.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </AdminPageShell>
  );
}
