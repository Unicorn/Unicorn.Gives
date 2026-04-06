import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { MunicipalDocumentForm, EMPTY_MUNICIPAL_DOCUMENT, type MunicipalDocumentFormData } from '@/components/admin/MunicipalDocumentForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditMunicipalDocumentPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('municipal_documents');
  const [form, setForm] = useState<MunicipalDocumentFormData>({ ...EMPTY_MUNICIPAL_DOCUMENT });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('municipal_documents').select('*').eq('id', id).single().then(({ data: d, error: err }) => {
      if (err || !d) { setLoading(false); return; }
      setForm({
        title: d.title ?? '',
        slug: d.slug ?? '',
        subtitle: d.subtitle ?? '',
        description: d.description ?? '',
        kind: d.kind ?? 'other',
        adopted_date: d.adopted_date ?? '',
        adopted_by: d.adopted_by ?? '',
        pdf_url: d.pdf_url ?? '',
        pdf_size_label: d.pdf_size_label ?? '',
        display_order: d.display_order ?? 0,
        region_id: d.region_id ?? '',
      });
      setStatus(d.status ?? 'draft');
      setLoading(false);
    });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.subtitle.trim()) errs.subtitle = 'Subtitle is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    if (!form.adopted_date.trim()) errs.adopted_date = 'Adopted date is required';
    if (!form.adopted_by.trim()) errs.adopted_by = 'Adopted by is required';
    if (!form.pdf_url.trim()) errs.pdf_url = 'PDF URL is required';
    if (!form.pdf_size_label.trim()) errs.pdf_size_label = 'PDF size is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate() || !id) return;
    const payload: Record<string, unknown> = {
      title: form.title.trim(), slug: form.slug, subtitle: form.subtitle.trim(),
      description: form.description.trim(), kind: form.kind,
      adopted_date: form.adopted_date.trim(), adopted_by: form.adopted_by.trim(),
      pdf_url: form.pdf_url.trim(), pdf_size_label: form.pdf_size_label.trim(),
      display_order: form.display_order, region_id: form.region_id,
    };
    const success = await update(id, payload);
    if (success && Platform.OS === 'web') window.alert('Document saved successfully.');
  }

  async function handlePublish() { if (id && await publish(id)) setStatus('published'); }
  async function handleUnpublish() { if (id && await unpublish(id)) setStatus('draft'); }
  async function handleArchive() { if (id && await archive(id)) setStatus('archived'); }
  async function handleDelete() {
    if (id && await remove(id)) router.replace(toHref('/admin/municipal-documents'));
    setShowDelete(false);
  }

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>Loading document...</Text></View>;
  }

  return (
    <AdminPageShell title="Edit Document" backHref="/admin/municipal-documents"
      actions={<>
        <AdminStatusBadge status={status} />
        {status === 'draft' && <AdminButton label="Publish" icon="publish" onPress={handlePublish} disabled={mutating} />}
        {status === 'published' && <AdminButton label="Unpublish" variant="secondary" icon="unpublished" onPress={handleUnpublish} disabled={mutating} />}
        {status !== 'archived' && <AdminButton label="Archive" variant="secondary" icon="archive" onPress={handleArchive} disabled={mutating} />}
        <AdminButton label="Save" icon="save" onPress={handleSave} disabled={mutating} />
        <AdminButton label="Delete" variant="danger" icon="delete" onPress={() => setShowDelete(true)} disabled={mutating} />
      </>}>
      <MunicipalDocumentForm data={form} onChange={setForm} errors={errors} />
      <AdminConfirmDialog visible={showDelete} title="Delete Document"
        message={`Are you sure you want to permanently delete "${form.title}"?`} confirmLabel="Delete" variant="danger"
        onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontFamily: fonts.sans, fontSize: 14, color: colors.neutralVariant },
});
