import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { ElectionForm, EMPTY_ELECTION, type ElectionFormData } from '@/components/admin/ElectionForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditElectionPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('elections');
  const [form, setForm] = useState<ElectionFormData>({ ...EMPTY_ELECTION });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  // Load election
  useEffect(() => {
    if (!id) return;
    supabase
      .from('elections')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setLoading(false);
          return;
        }
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          description: data.description ?? '',
          body: data.body ?? '',
          election_date: data.election_date ?? '',
          type: data.type ?? 'general',
          registration_deadline: data.registration_deadline ?? '',
          absentee_deadline: data.absentee_deadline ?? '',
          region_id: data.region_id ?? '',
        });
        setStatus(data.status ?? 'draft');
        setLoading(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.election_date) errs.election_date = 'Election date is required';
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
      election_date: form.election_date,
      type: form.type,
      registration_deadline: form.registration_deadline || null,
      absentee_deadline: form.absentee_deadline || null,
      region_id: form.region_id || null,
    };

    const success = await update(id, payload);
    if (success && Platform.OS === 'web') {
      window.alert('Election saved successfully.');
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
      router.replace(toHref('/admin/elections'));
    }
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading election...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Election"
      backHref="/admin/elections"
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
      <ElectionForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Election"
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
