import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { RegionPageForm, EMPTY_REGION_PAGE, type RegionPageFormData } from '@/components/admin/RegionPageForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditRegionPagePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('region_pages');
  const [form, setForm] = useState<RegionPageFormData>({ ...EMPTY_REGION_PAGE });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  // Load region page
  useEffect(() => {
    if (!id) return;
    supabase
      .from('region_pages')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setLoading(false);
          return;
        }
        const rawAttachments = data.attachments;
        let parsedAttachments: any[] = [];
        if (rawAttachments) {
          if (typeof rawAttachments === 'string') {
            try { parsedAttachments = JSON.parse(rawAttachments); } catch { /* ignore */ }
          } else if (Array.isArray(rawAttachments)) {
            parsedAttachments = rawAttachments;
          }
        }
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          description: data.description ?? '',
          body: data.body ?? '',
          category: data.category ?? 'general',
          display_order: data.display_order ?? 0,
          region_id: data.region_id ?? '',
          parent_slug: data.parent_slug ?? '',
          attachments: parsedAttachments,
        });
        setStatus(data.status ?? 'draft');
        setLoading(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate() || !id) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      description: form.description || null,
      body: form.body || null,
      category: form.category || null,
      parent_slug: form.parent_slug || null,
      attachments: form.attachments.length > 0 ? JSON.stringify(form.attachments) : '[]',
      display_order: form.display_order,
      region_id: form.region_id,
    };

    const success = await update(id, payload);
    if (success && Platform.OS === 'web') {
      window.alert('Region page saved successfully.');
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
      router.replace(toHref('/admin/region-pages'));
    }
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading region page...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Region Page"
      backHref="/admin/region-pages"
      actions={
        <>
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
      <RegionPageForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Region Page"
        message={`Are you sure you want to permanently delete "${form.title}"? This cannot be undone.`}
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
