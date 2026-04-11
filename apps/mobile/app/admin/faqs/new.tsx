import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { FaqForm, EMPTY_FAQ, type FaqFormData } from '@/components/admin/FaqForm';
import { toHref } from '@/lib/navigation';

export default function NewFaqPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('faqs');
  const [form, setForm] = useState<FaqFormData>({ ...EMPTY_FAQ });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.question.trim()) errs.question = 'Question is required';
    if (!form.answer.trim()) errs.answer = 'Answer is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      question: form.question.trim(),
      slug: form.slug,
      answer: form.answer.trim(),
      department_id: form.department_id || null,
      category_id: form.category_id || null,
      audience: form.audience,
      display_order: parseInt(String(form.display_order), 10) || 0,
      region_id: form.region_id || null,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/faqs/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create FAQ. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New FAQ"
      backHref="/admin/faqs"
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
      <FaqForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
