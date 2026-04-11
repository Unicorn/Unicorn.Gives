import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { ServiceForm, EMPTY_SERVICE, type ServiceFormData } from '@/components/admin/ServiceForm';
import { toHref } from '@/lib/navigation';

export default function NewServicePage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('services');
  const [form, setForm] = useState<ServiceFormData>({ ...EMPTY_SERVICE });
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
      department_id: form.department_id || null,
      service_category: form.service_category,
      audience: form.audience,
      online_url: form.online_url || null,
      fee_schedule: form.fee_schedule || null,
      eligibility: form.eligibility || null,
      hours: form.hours || null,
      phone: form.phone || null,
      email: form.email || null,
      icon: form.icon || null,
      display_order: parseInt(String(form.display_order), 10) || 0,
      region_id: form.region_id || null,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/services/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create service. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Service"
      backHref="/admin/services"
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
      <ServiceForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
