import { useEffect, useState } from 'react';
import { Platform, ActivityIndicator, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { AudienceForm, type AudienceFormData, EMPTY_AUDIENCE } from '@/components/admin/AudienceForm';
import { toHref } from '@/lib/navigation';
import { useTheme } from '@/constants/theme';

export default function EditAudiencePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { update, remove, loading } = useAdminMutation('audiences');

  const [form, setForm] = useState<AudienceFormData>({ ...EMPTY_AUDIENCE });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('audiences')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            label: data.label ?? '',
            slug: data.slug ?? '',
            description: data.description ?? '',
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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!id || !validate()) return;

    const payload: Record<string, unknown> = {
      label: form.label.trim(),
      slug: form.slug.trim(),
      description: form.description || null,
      display_order: form.display_order,
      is_active: form.is_active,
    };

    const success = await update(id, payload);
    if (success && Platform.OS === 'web') {
      window.alert('Audience saved successfully.');
    }
  }

  async function handleDelete() {
    if (!id) return;
    const success = await remove(id);
    if (success) {
      router.replace(toHref('/admin/audiences'));
    }
    setDeleteOpen(false);
  }

  if (fetching) {
    return (
      <AdminPageShell title="Edit Audience" backHref="/admin/audiences">
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title="Edit Audience"
      backHref="/admin/audiences"
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
      <AudienceForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={deleteOpen}
        title="Delete Audience"
        message={`Are you sure you want to delete "${form.label}"? Content linked to this audience will lose the association.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </AdminPageShell>
  );
}
