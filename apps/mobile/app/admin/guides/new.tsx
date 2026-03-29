import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { GuideForm, EMPTY_GUIDE, type GuideFormData } from '@/components/admin/GuideForm';
import { toHref } from '@/lib/navigation';

export default function NewGuidePage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('guides');
  const [form, setForm] = useState<GuideFormData>({ ...EMPTY_GUIDE });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.scenario.trim()) errs.scenario = 'Scenario is required';
    if (!form.category) errs.category = 'Category is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

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
      status,
    };
    if (status === 'published') payload.published_at = new Date().toISOString();

    const result = await insert(payload);
    if (!result) {
      if (Platform.OS === 'web') window.alert('Failed to create guide.');
      return;
    }

    // Save child contacts and forms
    if (form.contacts.length > 0) {
      await supabase.from('guide_contacts').insert(
        form.contacts.map((c, i) => ({
          guide_id: result.id,
          name: c.name,
          role: c.role || null,
          phone: c.phone || null,
          email: c.email || null,
          display_order: i,
        })),
      );
    }
    if (form.forms.length > 0) {
      await supabase.from('guide_forms').insert(
        form.forms.map((f, i) => ({
          guide_id: result.id,
          name: f.name,
          url: f.url,
          format: f.format || 'PDF',
          display_order: i,
        })),
      );
    }

    router.replace(toHref(`/admin/guides/${result.id}`));
  }

  return (
    <AdminPageShell
      title="New Guide"
      backHref="/admin/guides"
      actions={
        <>
          <AdminButton label="Save Draft" variant="secondary" icon="save" onPress={() => handleSave('draft')} disabled={loading} />
          <AdminButton label="Publish" icon="publish" onPress={() => handleSave('published')} disabled={loading} />
        </>
      }
    >
      <GuideForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
