import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { JobPostingForm, EMPTY_JOB_POSTING, type JobPostingFormData } from '@/components/admin/JobPostingForm';
import { toHref } from '@/lib/navigation';

export default function NewJobPostingPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('job_postings');
  const [form, setForm] = useState<JobPostingFormData>({ ...EMPTY_JOB_POSTING });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
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
      body: form.body || null,
      department_id: form.department_id || null,
      employment_type: form.employment_type,
      salary_range: form.salary_range || null,
      benefits_summary: form.benefits_summary || null,
      qualifications: form.qualifications || null,
      application_url: form.application_url || null,
      posting_date: form.posting_date || null,
      closing_date: form.closing_date || null,
      is_open: form.is_open,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      region_id: form.region_id || null,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/job-postings/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create job posting. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Job Posting"
      backHref="/admin/job-postings"
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
      <JobPostingForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
