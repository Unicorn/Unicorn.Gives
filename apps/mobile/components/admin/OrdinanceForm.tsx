import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, DateField, SlugField, FormRow, FormColumn } from './AdminForm';
import { AdminRichEditor } from './AdminRichEditor';
import { AdminFileUpload } from './AdminImageUpload';

const ORDINANCE_CATEGORIES = [
  { label: 'Zoning', value: 'zoning' },
  { label: 'Public Safety', value: 'public-safety' },
  { label: 'Environment', value: 'environment' },
  { label: 'Property', value: 'property' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'General', value: 'general' },
];

export interface OrdinanceFormData {
  title: string;
  slug: string;
  number: string;
  description: string;
  body: string;
  category: string;
  adopted_date: string;
  amended_date: string;
  pdf_url: string;
  region_id: string;
}

export const EMPTY_ORDINANCE: OrdinanceFormData = {
  title: '', slug: '', number: '', description: '', body: '', category: 'general',
  adopted_date: '', amended_date: '', pdf_url: '', region_id: '',
};

interface OrdinanceFormProps {
  data: OrdinanceFormData;
  onChange: (data: OrdinanceFormData) => void;
  errors?: Record<string, string>;
}

export function OrdinanceForm({ data, onChange, errors = {} }: OrdinanceFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync slug
  useEffect(() => { if (slug && !data.slug) onChange({ ...data, slug }); }, [slug]);

  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    supabase.from('regions').select('id, name').eq('is_active', true).order('display_order')
      .then(({ data: r }) => { if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id }))); });
  }, []);

  function set<K extends keyof OrdinanceFormData>(key: K, value: OrdinanceFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />

      <FormRow>
        <FormColumn flex={2}><TextField label="Title" value={data.title} onChangeText={(v) => set('title', v)} placeholder="Ordinance title" required error={errors.title} /></FormColumn>
        <FormColumn><TextField label="Number" value={data.number} onChangeText={(v) => set('number', v)} placeholder="e.g. 44" /></FormColumn>
      </FormRow>
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />

      <TextField label="Description" value={data.description} onChangeText={(v) => set('description', v)} placeholder="Short description" multiline numberOfLines={2} />

      <FormRow>
        <FormColumn><SelectField label="Category" value={data.category} onValueChange={(v) => set('category', v)} options={ORDINANCE_CATEGORIES} required error={errors.category} /></FormColumn>
        <FormColumn><DateField label="Adopted Date" value={data.adopted_date} onChangeText={(v) => set('adopted_date', v)} /></FormColumn>
        <FormColumn><DateField label="Amended Date" value={data.amended_date} onChangeText={(v) => set('amended_date', v)} /></FormColumn>
      </FormRow>

      <AdminFileUpload label="PDF Document" value={data.pdf_url} onChange={(v) => set('pdf_url', v)} folder="ordinances" hint="Upload PDF or paste URL" />

      <AdminRichEditor label="Ordinance Body" value={data.body} onChange={(v) => set('body', v)} placeholder="Full ordinance text..." />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
