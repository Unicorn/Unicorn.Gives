import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { ContactForm, EMPTY_CONTACT, type ContactFormData } from '@/components/admin/ContactForm';
import { toHref } from '@/lib/navigation';

export default function NewContactPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('contacts');
  const [form, setForm] = useState<ContactFormData>({ ...EMPTY_CONTACT });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    if (!form.department.trim()) errs.department = 'Department is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      slug: form.slug,
      role: form.role.trim() || null,
      department: form.department.trim() || null,
      phone: form.phone || null,
      phone_ext: form.phone_ext || null,
      email: form.email || null,
      address: form.address || null,
      hours: form.hours || null,
      website: form.website || null,
      display_order: form.display_order,
      region_id: form.region_id || null,
      status,
    };

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/contacts/${result.id}`));
    } else {
      if (Platform.OS === 'web') {
        window.alert('Failed to create contact. Check the console for details.');
      }
    }
  }

  return (
    <AdminPageShell
      title="New Contact"
      backHref="/admin/contacts"
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
      <ContactForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
