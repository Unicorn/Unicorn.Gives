import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, SlugField, FormRow, FormColumn } from './AdminForm';
import { AdminRichEditor } from './AdminRichEditor';

export interface PartnerPageFormData {
  title: string;
  slug: string;
  body: string;
  tab_slug: string;
  display_order: number;
  partner_id: string;
}

export const EMPTY_PARTNER_PAGE: PartnerPageFormData = {
  title: '', slug: '', body: '', tab_slug: '', display_order: 0, partner_id: '',
};

interface PartnerPageFormProps {
  data: PartnerPageFormData;
  onChange: (data: PartnerPageFormData) => void;
  errors?: Record<string, string>;
}

export function PartnerPageForm({ data, onChange, errors = {} }: PartnerPageFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync slug
  useEffect(() => { if (slug !== data.slug) onChange({ ...data, slug }); }, [slug]);

  const [partners, setPartners] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    supabase.from('partners').select('id, name').eq('is_active', true)
      .then(({ data: p }) => { if (p) setPartners(p.map((x) => ({ label: x.name, value: x.id }))); });
  }, []);

  function set<K extends keyof PartnerPageFormData>(key: K, value: PartnerPageFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Partner" value={data.partner_id} onValueChange={(v) => set('partner_id', v)} options={partners} required error={errors.partner_id} placeholder="Select partner..." />
      <TextField label="Title" value={data.title} onChangeText={(v) => set('title', v)} placeholder="Page title" required error={errors.title} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />
      <FormRow>
        <FormColumn><TextField label="Tab Slug" value={data.tab_slug} onChangeText={(v) => set('tab_slug', v)} placeholder="e.g. about, services" hint="Tab this page belongs to" /></FormColumn>
        <FormColumn><TextField label="Display Order" value={String(data.display_order)} onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)} placeholder="0" /></FormColumn>
      </FormRow>
      <AdminRichEditor label="Page Content" value={data.body} onChange={(v) => set('body', v)} placeholder="Write page content..." />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
