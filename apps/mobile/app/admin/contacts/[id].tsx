import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminPreviewLink } from '@/components/admin/AdminPreviewLink';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { ContactForm, EMPTY_CONTACT, type ContactFormData } from '@/components/admin/ContactForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { getContentPreviewUrl } from '@/lib/admin/contentPreview';
import { toHref } from '@/lib/navigation';

export default function EditContactPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('contacts');
  const [form, setForm] = useState<ContactFormData>({ ...EMPTY_CONTACT });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  // Load contact
  useEffect(() => {
    if (!id) return;
    supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setLoading(false);
          return;
        }
        setForm({
          name: data.name ?? '',
          slug: data.slug ?? '',
          role: data.role ?? '',
          department: data.department ?? '',
          phone: data.phone ?? '',
          phone_ext: data.phone_ext ?? '',
          email: data.email ?? '',
          address: data.address ?? '',
          hours: data.hours ?? '',
          website: data.website ?? '',
          display_order: data.display_order ?? 0,
          region_id: data.region_id ?? '',
        });
        setStatus(data.status ?? 'draft');
        setLoading(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    if (!form.department.trim()) errs.department = 'Department is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate() || !id) return;

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      slug: form.slug,
      role: form.role.trim() || null,
      department: form.department.trim() || null,
      phone: form.phone || null,
      phone_ext: form.phone_ext || null,
      email: form.email || null,
      address: form.address || null,
      hours: form.hours || null,
      website: form.website || null,
      display_order: form.display_order,
      region_id: form.region_id || null,
    };

    const success = await update(id, payload);
    if (success && Platform.OS === 'web') {
      window.alert('Contact saved successfully.');
    }
  }

  async function handlePublish() {
    if (!id) return;
    const success = await publish(id);
    if (success) setStatus('published');
  }

  async function handleUnpublish() {
    if (!id) return;
    const success = await unpublish(id);
    if (success) setStatus('draft');
  }

  async function handleArchive() {
    if (!id) return;
    const success = await archive(id);
    if (success) setStatus('archived');
  }

  async function handleDelete() {
    if (!id) return;
    const success = await remove(id);
    if (success) {
      router.replace(toHref('/admin/contacts'));
    }
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading contact...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Contact"
      backHref="/admin/contacts"
      actions={
        <>
          <AdminPreviewLink href={getContentPreviewUrl('contacts', { slug: form.slug })} />
          <AdminStatusBadge status={status} />
          {status === 'draft' && (
            <AdminButton
              label="Publish"
              icon="publish"
              onPress={handlePublish}
              disabled={mutating}
            />
          )}
          {status === 'published' && (
            <AdminButton
              label="Unpublish"
              variant="secondary"
              icon="unpublished"
              onPress={handleUnpublish}
              disabled={mutating}
            />
          )}
          {status !== 'archived' && (
            <AdminButton
              label="Archive"
              variant="secondary"
              icon="archive"
              onPress={handleArchive}
              disabled={mutating}
            />
          )}
          <AdminButton
            label="Save"
            icon="save"
            onPress={handleSave}
            disabled={mutating}
          />
          <AdminButton
            label="Delete"
            variant="danger"
            icon="delete"
            onPress={() => setShowDelete(true)}
            disabled={mutating}
          />
        </>
      }
    >
      <ContactForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Contact"
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
    },
  });
