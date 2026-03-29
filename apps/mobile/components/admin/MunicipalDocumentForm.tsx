import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, SlugField, FormRow, FormColumn } from './AdminForm';
import { AdminFileUpload } from './AdminImageUpload';

const KIND_OPTIONS = [
  { label: 'Master Plan', value: 'master_plan' },
  { label: 'Zoning Ordinance', value: 'zoning_ordinance' },
  { label: 'Recreation Plan', value: 'recreation_plan' },
  { label: 'Other', value: 'other' },
];

export interface MunicipalDocumentFormData {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  kind: string;
  adopted_date: string;
  adopted_by: string;
  pdf_url: string;
  pdf_size_label: string;
  display_order: number;
  region_id: string;
}

export const EMPTY_MUNICIPAL_DOCUMENT: MunicipalDocumentFormData = {
  title: '', slug: '', subtitle: '', description: '', kind: 'other',
  adopted_date: '', adopted_by: '', pdf_url: '', pdf_size_label: '',
  display_order: 0, region_id: '',
};

interface MunicipalDocumentFormProps {
  data: MunicipalDocumentFormData;
  onChange: (data: MunicipalDocumentFormData) => void;
  errors?: Record<string, string>;
}

export function MunicipalDocumentForm({ data, onChange, errors = {} }: MunicipalDocumentFormProps) {
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

  function set<K extends keyof MunicipalDocumentFormData>(key: K, value: MunicipalDocumentFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />

      <TextField label="Title" value={data.title} onChangeText={(v) => set('title', v)} placeholder="Document title" required error={errors.title} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />

      <TextField label="Subtitle" value={data.subtitle} onChangeText={(v) => set('subtitle', v)} placeholder="Document subtitle" required error={errors.subtitle} />
      <TextField label="Description" value={data.description} onChangeText={(v) => set('description', v)} placeholder="Brief description" multiline numberOfLines={3} required error={errors.description} />

      <FormRow>
        <FormColumn><SelectField label="Kind" value={data.kind} onValueChange={(v) => set('kind', v)} options={KIND_OPTIONS} required /></FormColumn>
        <FormColumn><TextField label="Adopted Date" value={data.adopted_date} onChangeText={(v) => set('adopted_date', v)} placeholder="e.g. March 2024" required error={errors.adopted_date} /></FormColumn>
        <FormColumn><TextField label="Adopted By" value={data.adopted_by} onChangeText={(v) => set('adopted_by', v)} placeholder="e.g. Lincoln Township Board" required error={errors.adopted_by} /></FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn flex={2}><AdminFileUpload label="PDF Document" value={data.pdf_url} onChange={(v) => set('pdf_url', v)} folder="municipal-documents" hint="Upload PDF or paste URL" /></FormColumn>
        <FormColumn><TextField label="PDF Size Label" value={data.pdf_size_label} onChangeText={(v) => set('pdf_size_label', v)} placeholder="e.g. 2.4 MB" required error={errors.pdf_size_label} /></FormColumn>
      </FormRow>

      <TextField label="Display Order" value={String(data.display_order)} onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)} placeholder="0" hint="Lower numbers appear first" />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
