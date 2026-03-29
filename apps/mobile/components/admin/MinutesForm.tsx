import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, spacing, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, DateField, SlugField, TagsField, FormRow, FormColumn } from './AdminForm';
import { AdminRichEditor } from './AdminRichEditor';
import { AdminFileUpload } from './AdminImageUpload';

const MEETING_TYPES = [
  { label: 'Regular Meeting', value: 'regular' },
  { label: 'Special Meeting', value: 'special' },
  { label: 'Public Hearing', value: 'public-hearing' },
  { label: 'Work Session', value: 'work-session' },
  { label: 'Committee', value: 'committee' },
];

const SOURCE_OPTIONS = [
  { label: 'Transcribed', value: 'transcribed' },
  { label: 'PDF', value: 'pdf' },
  { label: 'Original HTML', value: 'original-html' },
];

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
];

export interface MinutesFormData {
  title: string;
  slug: string;
  date: string;
  meeting_type: string;
  source: string;
  body: string;
  pdf_url: string;
  attendees_present: string[];
  attendees_absent: string[];
  attendees_also_present: string[];
  region_id: string;
}

export const EMPTY_MINUTES: MinutesFormData = {
  title: '', slug: '', date: '', meeting_type: 'regular', source: 'transcribed',
  body: '', pdf_url: '', attendees_present: [], attendees_absent: [],
  attendees_also_present: [], region_id: '',
};

interface MinutesFormProps {
  data: MinutesFormData;
  onChange: (data: MinutesFormData) => void;
  errors?: Record<string, string>;
}

export function MinutesForm({ data, onChange, errors = {} }: MinutesFormProps) {
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

  function set<K extends keyof MinutesFormData>(key: K, value: MinutesFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />

      <TextField label="Title" value={data.title} onChangeText={(v) => set('title', v)} placeholder="Meeting title" required error={errors.title} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />

      <FormRow>
        <FormColumn><DateField label="Date" value={data.date} onChangeText={(v) => set('date', v)} required error={errors.date} /></FormColumn>
        <FormColumn><SelectField label="Meeting Type" value={data.meeting_type} onValueChange={(v) => set('meeting_type', v)} options={MEETING_TYPES} required /></FormColumn>
        <FormColumn><SelectField label="Source" value={data.source} onValueChange={(v) => set('source', v)} options={SOURCE_OPTIONS} /></FormColumn>
      </FormRow>

      <AdminFileUpload label="PDF Document" value={data.pdf_url} onChange={(v) => set('pdf_url', v)} folder="minutes" hint="Upload PDF or paste URL" />

      <TagsField label="Present" value={data.attendees_present} onChange={(v) => set('attendees_present', v)} placeholder="Add name..." hint="Members present at the meeting" />
      <TagsField label="Absent" value={data.attendees_absent} onChange={(v) => set('attendees_absent', v)} placeholder="Add name..." hint="Members absent" />
      <TagsField label="Also Present" value={data.attendees_also_present} onChange={(v) => set('attendees_also_present', v)} placeholder="Add name..." hint="Non-members in attendance" />

      <AdminRichEditor label="Minutes Body" value={data.body} onChange={(v) => set('body', v)} placeholder="Meeting minutes content..." />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
