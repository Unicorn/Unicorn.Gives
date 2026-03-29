import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { MinutesForm, EMPTY_MINUTES, type MinutesFormData } from '@/components/admin/MinutesForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditMinutesPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, loading: mutating } = useAdminMutation('minutes');
  const [form, setForm] = useState<MinutesFormData>({ ...EMPTY_MINUTES });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  // Load minutes
  useEffect(() => {
    if (!id) return;
    supabase
      .from('minutes')
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
          date: data.date ?? '',
          meeting_type: data.meeting_type ?? 'regular',
          source: data.source ?? 'transcribed',
          body: data.body ?? '',
          pdf_url: data.pdf_url ?? '',
          attendees_present: data.attendees_present ?? [],
          attendees_absent: data.attendees_absent ?? [],
          attendees_also_present: data.attendees_also_present ?? [],
          region_id: data.region_id ?? '',
        });
        setStatus(data.status ?? 'draft');
        setLoading(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.date) errs.date = 'Date is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate() || !id) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      date: form.date,
      meeting_type: form.meeting_type || null,
      source: form.source || null,
      body: form.body || null,
      pdf_url: form.pdf_url || null,
      attendees_present: form.attendees_present.length > 0 ? form.attendees_present : null,
      attendees_absent: form.attendees_absent.length > 0 ? form.attendees_absent : null,
      attendees_also_present: form.attendees_also_present.length > 0 ? form.attendees_also_present : null,
      region_id: form.region_id,
    };

    const success = await update(id, payload);
    if (success && Platform.OS === 'web') {
      window.alert('Minutes saved successfully.');
    }
  }

  async function handleApprove() {
    if (!id) return;
    const success = await update(id, {
      status: 'approved',
      published_at: new Date().toISOString(),
    });
    if (success) setStatus('approved');
  }

  async function handleUnpublish() {
    if (!id) return;
    const success = await update(id, {
      status: 'pending',
      published_at: null,
    });
    if (success) setStatus('pending');
  }

  async function handleRevertToDraft() {
    if (!id) return;
    const success = await update(id, {
      status: 'draft',
      published_at: null,
    });
    if (success) setStatus('draft');
  }

  async function handleDelete() {
    if (!id) return;
    const success = await remove(id);
    if (success) {
      router.replace(toHref('/admin/minutes'));
    }
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading minutes...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Minutes"
      backHref="/admin/minutes"
      actions={
        <>
          <AdminStatusBadge status={status} />
          {status === 'draft' && (
            <AdminButton
              label="Approve"
              icon="check-circle"
              onPress={handleApprove}
              disabled={mutating}
            />
          )}
          {status === 'pending' && (
            <AdminButton
              label="Approve"
              icon="check-circle"
              onPress={handleApprove}
              disabled={mutating}
            />
          )}
          {status === 'approved' && (
            <AdminButton
              label="Unpublish"
              variant="secondary"
              icon="unpublished"
              onPress={handleUnpublish}
              disabled={mutating}
            />
          )}
          {status !== 'draft' && (
            <AdminButton
              label="Revert to Draft"
              variant="secondary"
              icon="undo"
              onPress={handleRevertToDraft}
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
      <MinutesForm
        data={form}
        onChange={setForm}
        errors={errors}
      />

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Minutes"
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
