import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { EventForm, EMPTY_EVENT, type EventFormData } from '@/components/admin/EventForm';
import { toHref } from '@/lib/navigation';

export default function NewEventPage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('events');
  const [form, setForm] = useState<EventFormData>({ ...EMPTY_EVENT });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.date) errs.date = 'Date is required';
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
      body: form.body || null,
      date: form.date,
      end_date: form.end_date || null,
      time: form.time || null,
      location: form.location || null,
      category: form.category,
      visibility: form.visibility,
      recurring: form.recurring,
      recurrence_rule: form.recurrence_rule || null,
      registration_url: form.registration_url || null,
      cost: form.cost || null,
      image_url: form.image_url || null,
      tags: form.tags.length > 0 ? form.tags : null,
      region_id: form.region_id || null,
      partner_id: form.partner_id || null,
      status,
    };

    if (status === 'published') {
      payload.published_at = new Date().toISOString();
    }

    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/events/${result.id}`));
    } else {
      if (Platform.OS === 'web') {
        window.alert('Failed to create event. Check the console for details.');
      }
    }
  }

  return (
    <AdminPageShell
      title="New Event"
      backHref="/admin/events"
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
      <EventForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
