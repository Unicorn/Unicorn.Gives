import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { AdminPreviewLink } from '@/components/admin/AdminPreviewLink';
import {
  BingoGameForm,
  EMPTY_BINGO_GAME,
  type BingoGameFormData,
} from '@/components/admin/BingoGameForm';
import { buildGamePayload, gameRowToForm } from '@/components/admin/bingoGamePayload';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditBingoGamePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } =
    useAdminMutation('bingo_games');
  const [form, setForm] = useState<BingoGameFormData>({ ...EMPTY_BINGO_GAME });
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('bingo_games')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setLoading(false);
          return;
        }
        setForm(gameRowToForm(data));
        setSlug(data.slug ?? '');
        setStatus(data.status ?? 'draft');
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
    const success = await update(id, buildGamePayload(form));
    if (success && Platform.OS === 'web') window.alert('Game saved successfully.');
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
    if (await remove(id)) router.replace(toHref('/admin/bingo-games'));
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Bingo Game"
      backHref="/admin/bingo-games"
      actions={
        <>
          <AdminStatusBadge status={status} />
          <AdminPreviewLink href={slug ? `/bingo/${slug}` : null} />
          <AdminButton
            label="Manage Squares"
            variant="secondary"
            icon="grid-view"
            onPress={() => router.push(toHref(`/admin/bingo-games/${id}/squares`))}
          />
          {status === 'draft' && (
            <AdminButton label="Publish" icon="publish" onPress={handlePublish} disabled={mutating} />
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
          <AdminButton label="Save" icon="save" onPress={handleSave} disabled={mutating} />
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
      <BingoGameForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete bingo game"
        message={`Permanently delete "${form.title}"? Its squares and issued boards go too. This cannot be undone.`}
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
