import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { FacilityForm, EMPTY_FACILITY, type FacilityFormData } from '@/components/admin/FacilityForm';
import { useTheme, fonts, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function EditFacilityPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { update, remove, publish, unpublish, archive, loading: mutating } = useAdminMutation('facilities');
  const [form, setForm] = useState<FacilityFormData>({ ...EMPTY_FACILITY });
  const [status, setStatus] = useState('draft');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('facilities')
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
          description: data.description ?? '',
          body: data.body ?? '',
          facility_type: data.facility_type ?? 'park',
          department_id: data.department_id ?? '',
          address: data.address ?? '',
          latitude: data.latitude != null ? String(data.latitude) : '',
          longitude: data.longitude != null ? String(data.longitude) : '',
          map_url: data.map_url ?? '',
          hours: data.hours ?? '',
          seasonal_dates: data.seasonal_dates ?? '',
          amenities: data.amenities ?? '',
          rental_available: data.rental_available ?? false,
          rental_rates: data.rental_rates ?? '',
          rental_form_url: data.rental_form_url ?? '',
          rules_url: data.rules_url ?? '',
          hero_image_url: data.hero_image_url ?? '',
          display_order: String(data.display_order ?? 0),
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
      description: form.description || null,
      body: form.body || null,
      facility_type: form.facility_type,
      department_id: form.department_id || null,
      address: form.address || null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      map_url: form.map_url || null,
      hours: form.hours || null,
      seasonal_dates: form.seasonal_dates || null,
      amenities: form.amenities || null,
      rental_available: form.rental_available,
      rental_rates: form.rental_rates || null,
      rental_form_url: form.rental_form_url || null,
      rules_url: form.rules_url || null,
      hero_image_url: form.hero_image_url || null,
      display_order: parseInt(String(form.display_order), 10) || 0,
      region_id: form.region_id || null,
    };

    const success = await update(id, payload);
    if (success && Platform.OS === 'web') {
      window.alert('Facility saved successfully.');
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
      router.replace(toHref('/admin/facilities'));
    }
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading facility...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title="Edit Facility"
      backHref="/admin/facilities"
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
      <FacilityForm data={form} onChange={setForm} errors={errors} />

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Facility"
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
