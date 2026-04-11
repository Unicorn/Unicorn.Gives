import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { FacilityForm, EMPTY_FACILITY, type FacilityFormData } from '@/components/admin/FacilityForm';
import { toHref } from '@/lib/navigation';

export default function NewFacilityPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('facilities');
  const [form, setForm] = useState<FacilityFormData>({ ...EMPTY_FACILITY });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

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
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/facilities/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create facility. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Facility"
      backHref="/admin/facilities"
      actions={
        <>
          <AdminButton
            label="Save Draft"
            variant="secondary"
            icon="save"
            onPress={() => handleSave('draft')}
            disabled={loading}
          />
          <AdminButton
            label="Publish"
            icon="publish"
            onPress={() => handleSave('published')}
            disabled={loading}
          />
        </>
      }
    >
      <FacilityForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
