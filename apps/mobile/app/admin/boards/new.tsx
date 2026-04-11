import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { BoardForm, EMPTY_BOARD, type BoardFormData } from '@/components/admin/BoardForm';
import { toHref } from '@/lib/navigation';

export default function NewBoardPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('boards_commissions');
  const [form, setForm] = useState<BoardFormData>({ ...EMPTY_BOARD });
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
      name: form.name.trim(), slug: form.slug, description: form.description || null,
      body: form.body || null, board_type: form.board_type,
      department_id: form.department_id || null,
      meeting_schedule: form.meeting_schedule || null,
      meeting_location: form.meeting_location || null,
      membership_count: form.membership_count || null,
      term_length_years: form.term_length_years || null,
      vacancy_count: form.vacancy_count,
      accepting_applications: form.accepting_applications,
      application_url: form.application_url || null,
      website: form.website || null,
      display_order: form.display_order,
      region_id: form.region_id, status,
    };
    const result = await insert(payload);
    if (result) router.replace(toHref(`/admin/boards/${result.id}`));
    else if (Platform.OS === 'web') window.alert('Failed to create board.');
  }

  return (
    <AdminPageShell title="New Board / Commission" backHref="/admin/boards" actions={
      <>
        <AdminButton label="Save Draft" variant="secondary" icon="save" onPress={() => handleSave('draft')} disabled={loading} />
        <AdminButton label="Publish" icon="publish" onPress={() => handleSave('published')} disabled={loading} />
      </>
    }>
      <BoardForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
