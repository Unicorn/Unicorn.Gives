import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, SlugField, FormRow, FormColumn } from './AdminForm';
import { AdminRichEditor } from './AdminRichEditor';

export interface RegionPageFormData {
  title: string;
  slug: string;
  description: string;
  body: string;
  category: string;
  display_order: number;
  region_id: string;
}

export const EMPTY_REGION_PAGE: RegionPageFormData = {
  title: '', slug: '', description: '', body: '', category: '', display_order: 0, region_id: '',
};

interface RegionPageFormProps {
  data: RegionPageFormData;
  onChange: (data: RegionPageFormData) => void;
  errors?: Record<string, string>;
}

export function RegionPageForm({ data, onChange, errors = {} }: RegionPageFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync slug
  useEffect(() => { if (slug !== data.slug) onChange({ ...data, slug }); }, [slug]);

  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    supabase.from('regions').select('id, name').eq('is_active', true).order('display_order')
      .then(({ data: r }) => { if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id }))); });
  }, []);

  function set<K extends keyof RegionPageFormData>(key: K, value: RegionPageFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />
      <TextField label="Title" value={data.title} onChangeText={(v) => set('title', v)} placeholder="Page title" required error={errors.title} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />
      <TextField label="Description" value={data.description} onChangeText={(v) => set('description', v)} placeholder="Short description" multiline numberOfLines={2} />
      <FormRow>
        <FormColumn><TextField label="Category" value={data.category} onChangeText={(v) => set('category', v)} placeholder="e.g. services, info" /></FormColumn>
        <FormColumn><TextField label="Display Order" value={String(data.display_order)} onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)} placeholder="0" /></FormColumn>
      </FormRow>
      <AdminRichEditor label="Page Content" value={data.body} onChange={(v) => set('body', v)} placeholder="Write page content..." />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
