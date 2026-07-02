import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import {
  BingoGameForm,
  EMPTY_BINGO_GAME,
  type BingoGameFormData,
} from '@/components/admin/BingoGameForm';
import { buildGamePayload } from '@/components/admin/bingoGamePayload';
import { toHref } from '@/lib/navigation';

export default function NewBingoGamePage() {
  const router = useRouter();
  const { insert, loading } = useAdminMutation('bingo_games');
  const [form, setForm] = useState<BingoGameFormData>({ ...EMPTY_BINGO_GAME });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave(status: 'draft' | 'published') {
    if (!validate()) return;
    const payload = buildGamePayload(form, status);
    const result = await insert(payload);
    if (result) {
      router.replace(toHref(`/admin/bingo-games/${result.id}`));
    } else if (Platform.OS === 'web') {
      window.alert('Failed to create game. Check the console for details.');
    }
  }

  return (
    <AdminPageShell
      title="New Bingo Game"
      backHref="/admin/bingo-games"
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
      <BingoGameForm data={form} onChange={setForm} errors={errors} />
    </AdminPageShell>
  );
}
