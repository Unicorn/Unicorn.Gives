import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { MunicipalDocumentForm, EMPTY_MUNICIPAL_DOCUMENT, type MunicipalDocumentFormData } from '@/components/admin/MunicipalDocumentForm';
import { toHref } from '@/lib/navigation';

export default function NewMunicipalDocumentPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('municipal_documents');
  const [form, setForm] = useState<MunicipalDocumentFormData>({ ...EMPTY_MUNICIPAL_DOCUMENT });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.subtitle.trim()) errs.subtitle = 'Subtitle is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    if (!form.adopted_date.trim()) errs.adopted_date = 'Adopted date is required';
    if (!form.adopted_by.trim()) errs.adopted_by = 'Adopted by is required';
    if (!form.pdf_url.trim()) errs.pdf_url = 'PDF URL is required';
    if (!form.pdf_size_label.trim()) errs.pdf_size_label = 'PDF size label is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;
    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      kind: form.kind,
      adopted_date: form.adopted_date.trim(),
      adopted_by: form.adopted_by.trim(),
      pdf_url: form.pdf_url.trim(),
      pdf_size_label: form.pdf_size_label.trim(),
      display_order: form.display_order,
      region_id: form.region_id,
      status,
    };
    if (status === 'published') payload.published_at = new Date().toISOString();

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/municipal-documents/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create document.');
    }
  }

  return (
    <AdminPageShell title="New Municipal Document" backHref="/admin/municipal-documents"
      actions={<>
        <AdminButton label="Save Draft" variant="secondary" icon="save" onPress={() => handleSave('draft')} disabled={loading} />
        <AdminButton label="Publish" icon="publish" onPress={() => handleSave('published')} disabled={loading} />
      </>}>
      <MunicipalDocumentForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
