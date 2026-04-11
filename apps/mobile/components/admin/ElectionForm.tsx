import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, DateField, SlugField, FormRow, FormColumn } from './AdminForm';
import { AdminRichEditor } from './AdminRichEditor';

const ELECTION_TYPES = [
  { label: 'General', value: 'general' },
  { label: 'Primary', value: 'primary' },
  { label: 'Special', value: 'special' },
  { label: 'Local', value: 'local' },
];

export interface ElectionFormData {
  title: string;
  slug: string;
  description: string;
  body: string;
  election_date: string;
  type: string;
  registration_deadline: string;
  absentee_deadline: string;
  filing_deadline: string;
  sample_ballot_url: string;
  voter_info_url: string;
  region_id: string;
}

export const EMPTY_ELECTION: ElectionFormData = {
  title: '', slug: '', description: '', body: '', election_date: '', type: 'general',
  registration_deadline: '', absentee_deadline: '', filing_deadline: '',
  sample_ballot_url: '', voter_info_url: '', region_id: '',
};

interface ElectionFormProps {
  data: ElectionFormData;
  onChange: (data: ElectionFormData) => void;
  errors?: Record<string, string>;
}

export function ElectionForm({ data, onChange, errors = {} }: ElectionFormProps) {
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

  function set<K extends keyof ElectionFormData>(key: K, value: ElectionFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />

      <TextField label="Title" value={data.title} onChangeText={(v) => set('title', v)} placeholder="Election title" required error={errors.title} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />

      <TextField label="Description" value={data.description} onChangeText={(v) => set('description', v)} placeholder="Short description" multiline numberOfLines={2} />

      <FormRow>
        <FormColumn><DateField label="Election Date" value={data.election_date} onChangeText={(v) => set('election_date', v)} required error={errors.election_date} /></FormColumn>
        <FormColumn><SelectField label="Type" value={data.type} onValueChange={(v) => set('type', v)} options={ELECTION_TYPES} required /></FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn><DateField label="Registration Deadline" value={data.registration_deadline} onChangeText={(v) => set('registration_deadline', v)} /></FormColumn>
        <FormColumn><DateField label="Absentee Deadline" value={data.absentee_deadline} onChangeText={(v) => set('absentee_deadline', v)} /></FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn><DateField label="Filing Deadline" value={data.filing_deadline} onChangeText={(v) => set('filing_deadline', v)} /></FormColumn>
        <FormColumn />
      </FormRow>

      <TextField label="Sample Ballot URL" value={data.sample_ballot_url} onChangeText={(v) => set('sample_ballot_url', v)} placeholder="https://..." hint="Link to the sample ballot PDF or page" />
      <TextField label="Voter Info URL" value={data.voter_info_url} onChangeText={(v) => set('voter_info_url', v)} placeholder="https://..." hint="Link to voter information page" />

      <AdminRichEditor label="Election Details" value={data.body} onChange={(v) => set('body', v)} placeholder="Election information, polling locations, candidates..." />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
