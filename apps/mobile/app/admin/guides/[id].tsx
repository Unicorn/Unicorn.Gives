import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminPreviewLink } from '@/components/admin/AdminPreviewLink';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { GuideForm, EMPTY_GUIDE, type GuideFormData, type GuideContact, type GuideFormEntry } from '@/components/admin/GuideForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { getContentPreviewUrl } from '@/lib/admin/contentPreview';
import { toHref } from '@/lib/navigation';

export default function EditGuidePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('guides');
  const [form, setForm] = useState<GuideFormData>({ ...EMPTY_GUIDE });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const [guideRes, contactsRes, formsRes] = await Promise.all([
        supabase.from('guides').select('*').eq('id', id).single(),
        supabase.from('guide_contacts').select('*').eq('guide_id', id).order('display_order'),
        supabase.from('guide_forms').select('*').eq('guide_id', id).order('display_order'),
      ]);

      if (guideRes.error || !guideRes.data) {
        setLoading(false);
        return;
      }
      const d = guideRes.data;
      setForm({
        title: d.title ?? '',
        slug: d.slug ?? '',
        description: d.description ?? '',
        body: d.body ?? '',
        category: d.category ?? 'services',
        scenario: d.scenario ?? '',
        icon: d.icon ?? '',
        jurisdiction: d.jurisdiction ?? '',
        last_verified: d.last_verified ?? '',
        contacts: (contactsRes.data ?? []).map((c: any) => ({
          id: c.id,
          name: c.name ?? '',
          role: c.role ?? '',
          phone: c.phone ?? '',
          email: c.email ?? '',
          display_order: c.display_order ?? 0,
        })),
        forms: (formsRes.data ?? []).map((f: any) => ({
          id: f.id,
          name: f.name ?? '',
          url: f.url ?? '',
          format: f.format ?? 'PDF',
          display_order: f.display_order ?? 0,
        })),
      });
      setStatus(d.status ?? 'draft');
      setLoading(false);
    }
    load();
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.scenario.trim()) errs.scenario = 'Scenario is required';
    if (!form.category) errs.category = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate() || !id) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      description: form.description || null,
      body: form.body,
      category: form.category,
      scenario: form.scenario,
      icon: form.icon || null,
      jurisdiction: form.jurisdiction || null,
      last_verified: form.last_verified || null,
    };

    const success = await update(id, payload);
    if (!success) return;

    // Sync child contacts: delete all and re-insert
    await supabase.from('guide_contacts').delete().eq('guide_id', id);
    if (form.contacts.length > 0) {
      await supabase.from('guide_contacts').insert(
        form.contacts.map((c, i) => ({
          guide_id: id,
          name: c.name,
          role: c.role || null,
          phone: c.phone || null,
          email: c.email || null,
          display_order: i,
        })),
      );
    }

    // Sync child forms
    await supabase.from('guide_forms').delete().eq('guide_id', id);
    if (form.forms.length > 0) {
      await supabase.from('guide_forms').insert(
        form.forms.map((f, i) => ({
          guide_id: id,
          name: f.name,
          url: f.url,
          format: f.format || 'PDF',
          display_order: i,
        })),
      );
    }

    if (Platform.OS === 'web') window.alert('Guide saved successfully.');
  }

  async function handlePublish() {
    if (!id) return;
    if (await publish(id)) setStatus('published');
  }

  async function handleUnpublish() {
    if (!id) return;
    if (await unpublish(id)) setStatus('draft');
  }

  async function handleArchive() {
    if (!id) return;
    if (await archive(id)) setStatus('archived');
  }

  async function handleDelete() {
    if (!id) return;
    if (await remove(id)) router.replace(toHref('/admin/guides'));
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading guide...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Guide"
      backHref="/admin/guides"
      actions={
        <>
          <AdminPreviewLink href={getContentPreviewUrl('guides', { slug: form.slug })} />
          <AdminStatusBadge status={status} />
          {status === 'draft' && <AdminButton label="Publish" icon="publish" onPress={handlePublish} disabled={mutating} />}
          {status === 'published' && <AdminButton label="Unpublish" variant="secondary" icon="unpublished" onPress={handleUnpublish} disabled={mutating} />}
          {status !== 'archived' && <AdminButton label="Archive" variant="secondary" icon="archive" onPress={handleArchive} disabled={mutating} />}
          <AdminButton label="Save" icon="save" onPress={handleSave} disabled={mutating} />
          <AdminButton label="Delete" variant="danger" icon="delete" onPress={() => setShowDelete(true)} disabled={mutating} />
        </>
      }
    >
      <GuideForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Guide"
        message={`Are you sure you want to permanently delete "${form.title}"? This will also remove its contacts and forms.`}
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
