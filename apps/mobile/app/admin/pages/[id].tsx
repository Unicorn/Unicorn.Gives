import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminPreviewLink } from '@/components/admin/AdminPreviewLink';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { PageForm, EMPTY_PAGE, type PageFormData } from '@/components/admin/PageForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { getContentPreviewUrl } from '@/lib/admin/contentPreview';
import { toHref } from '@/lib/navigation';

export default function EditPagePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('pages');
  const [form, setForm] = useState<PageFormData>({ ...EMPTY_PAGE });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('pages').select('*').eq('id', id).single().then(({ data: d, error: err }) => {
      if (err || !d) { setLoading(false); return; }
      setForm({
        title: d.title ?? '',
        slug: d.slug ?? '',
        description: d.description ?? '',
        body: d.body ?? '',
        category: d.category ?? '',
        subcategory: d.subcategory ?? '',
        nav_title: d.nav_title ?? '',
        hide_from_nav: d.hide_from_nav ?? false,
        display_order: d.display_order ?? 0,
        department_id: d.department_id ?? '',
        parent_page_id: d.parent_page_id ?? '',
        page_type: d.page_type ?? 'standard',
        redirect_url: d.redirect_url ?? '',
        audience: d.audience ?? '',
        template: d.template ?? '',
      });
      setStatus(d.status ?? 'draft');
      setLoading(false);
    });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate() || !id) return;
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
    };
    const success = await update(id, payload);
    if (success && Platform.OS === 'web') window.alert('Page saved successfully.');
  }

  async function handlePublish() { if (id && await publish(id)) setStatus('published'); }
  async function handleUnpublish() { if (id && await unpublish(id)) setStatus('draft'); }
  async function handleArchive() { if (id && await archive(id)) setStatus('archived'); }
  async function handleDelete() {
    if (id && await remove(id)) router.replace(toHref('/admin/pages'));
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading page...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Page"
      backHref="/admin/pages"
      actions={
        <>
          <AdminPreviewLink href={getContentPreviewUrl('pages', { slug: form.slug })} />
          <AdminStatusBadge status={status} />
          {status === 'draft' && <AdminButton label="Publish" icon="publish" onPress={handlePublish} disabled={mutating} />}
          {status === 'published' && <AdminButton label="Unpublish" variant="secondary" icon="unpublished" onPress={handleUnpublish} disabled={mutating} />}
          {status !== 'archived' && <AdminButton label="Archive" variant="secondary" icon="archive" onPress={handleArchive} disabled={mutating} />}
          <AdminButton label="Save" icon="save" onPress={handleSave} disabled={mutating} />
          <AdminButton label="Delete" variant="danger" icon="delete" onPress={() => setShowDelete(true)} disabled={mutating} />
        </>
      }
    >
      <PageForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Page"
        message={`Are you sure you want to permanently delete "${form.title}"?`}
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
