import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { DepartmentForm, EMPTY_DEPARTMENT, type DepartmentFormData } from '@/components/admin/DepartmentForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditDepartmentPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('departments');
  const [form, setForm] = useState<DepartmentFormData>({ ...EMPTY_DEPARTMENT });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('departments').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error || !data) { setLoading(false); return; }
        setForm({
          name: data.name ?? '',
          slug: data.slug ?? '',
          short_name: data.short_name ?? '',
          description: data.description ?? '',
          body: data.body ?? '',
          phone: data.phone ?? '',
          fax: data.fax ?? '',
          email: data.email ?? '',
          address: data.address ?? '',
          hours: data.hours ?? '',
          website: data.website ?? '',
          hero_image_url: data.hero_image_url ?? '',
          icon: data.icon ?? '',
          display_order: data.display_order ?? 0,
          hide_from_nav: data.hide_from_nav ?? false,
          parent_department_id: data.parent_department_id ?? '',
          region_id: data.region_id ?? '',
        });
        setStatus(data.status ?? 'draft');
        setLoading(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate() || !id) return;
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
    };
    const success = await update(id, payload);
    if (success && Platform.OS === 'web') window.alert('Department saved successfully.');
  }

  async function handlePublish() { if (!id) return; const s = await publish(id); if (s) setStatus('published'); }
  async function handleUnpublish() { if (!id) return; const s = await unpublish(id); if (s) setStatus('draft'); }
  async function handleArchive() { if (!id) return; const s = await archive(id); if (s) setStatus('archived'); }
  async function handleDelete() {
    if (!id) return;
    const success = await remove(id);
    if (success) router.replace(toHref('/admin/departments'));
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading department...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Department"
      backHref="/admin/departments"
      actions={
        <>
          <AdminStatusBadge status={status} />
          {status === 'draft' && <AdminButton label="Publish" icon="publish" onPress={handlePublish} disabled={mutating} />}
          {status === 'published' && <AdminButton label="Unpublish" variant="secondary" icon="unpublished" onPress={handleUnpublish} disabled={mutating} />}
          {status !== 'archived' && <AdminButton label="Archive" variant="secondary" icon="archive" onPress={handleArchive} disabled={mutating} />}
          <AdminButton label="Save" icon="save" onPress={handleSave} disabled={mutating} />
          <AdminButton label="Delete" variant="danger" icon="delete" onPress={() => setShowDelete(true)} disabled={mutating} />
        </>
      }
    >
      <DepartmentForm data={form} onChange={setForm} errors={errors} />
      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Department"
        message={`Are you sure you want to permanently delete "${form.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontFamily: fonts.sans, fontSize: 14, color: colors.neutralVariant },
  });
