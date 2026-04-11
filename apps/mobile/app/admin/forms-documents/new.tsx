import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { FormsDocumentForm, EMPTY_FORMS_DOCUMENT, type FormsDocumentFormData } from '@/components/admin/FormsDocumentForm';
import { toHref } from '@/lib/navigation';

export default function NewFormsDocumentPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('forms_documents');
  const [form, setForm] = useState<FormsDocumentFormData>({ ...EMPTY_FORMS_DOCUMENT });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.file_url.trim()) errs.file_url = 'File URL is required';
    if (!form.region_id) errs.region_id = 'Region is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      slug: form.slug,
      description: form.description || null,
      document_type: form.document_type,
      file_url: form.file_url.trim(),
      file_size_label: form.file_size_label || null,
      file_format: form.file_format,
      department_id: form.department_id || null,
      form_number: form.form_number || null,
      effective_date: form.effective_date || null,
      revision_date: form.revision_date || null,
      is_fillable: form.is_fillable,
      is_current: form.is_current,
      submission_url: form.submission_url || null,
      instructions: form.instructions || null,
      display_order: parseInt(String(form.display_order), 10) || 0,
      region_id: form.region_id || null,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/forms-documents/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create document. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Document"
      backHref="/admin/forms-documents"
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
      <FormsDocumentForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
