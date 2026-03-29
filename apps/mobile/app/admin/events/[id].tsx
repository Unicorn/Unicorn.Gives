import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { EventForm, EMPTY_EVENT, type EventFormData } from '@/components/admin/EventForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditEventPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('events');
  const [form, setForm] = useState<EventFormData>({ ...EMPTY_EVENT });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  // Load event
  useEffect(() => {
    if (!id) return;
    supabase
      .from('events')
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
          date: data.date ?? '',
          end_date: data.end_date ?? '',
          time: data.time ?? '',
          location: data.location ?? '',
          category: data.category ?? 'community',
          visibility: data.visibility ?? 'global',
          recurring: data.recurring ?? false,
          recurrence_rule: data.recurrence_rule ?? '',
          registration_url: data.registration_url ?? '',
          cost: data.cost ?? '',
          image_url: data.image_url ?? '',
          tags: data.tags ?? [],
          region_id: data.region_id ?? '',
          partner_id: data.partner_id ?? '',
        });
        setStatus(data.status ?? 'draft');
        setLoading(false);
      });
  }, [id]);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.date) errs.date = 'Date is required';
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
      body: form.body || null,
      date: form.date,
      end_date: form.end_date || null,
      time: form.time || null,
      location: form.location || null,
      category: form.category,
      visibility: form.visibility,
      recurring: form.recurring,
      recurrence_rule: form.recurrence_rule || null,
      registration_url: form.registration_url || null,
      cost: form.cost || null,
      image_url: form.image_url || null,
      tags: form.tags.length > 0 ? form.tags : null,
      region_id: form.region_id || null,
      partner_id: form.partner_id || null,
    };

    const success = await update(id, payload);
    if (success && Platform.OS === 'web') {
      window.alert('Event saved successfully.');
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
      router.replace(toHref('/admin/events'));
    }
    setShowDelete(false);
  }

  const persistEventImageUrl = useCallback(
    async (url: string | null) => {
      if (!id) return false;
      return update(id, { image_url: url || null });
    },
    [id, update],
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading event...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Event"
      backHref="/admin/events"
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
      <EventForm
        data={form}
        onChange={setForm}
        errors={errors}
        eventId={id}
        onPersistImageUrl={persistEventImageUrl}
      />

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Event"
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
