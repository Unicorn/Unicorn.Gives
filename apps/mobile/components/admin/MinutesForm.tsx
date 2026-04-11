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

const APPROVAL_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Tabled', value: 'tabled' },
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
  meeting_id: string;
  board_id: string;
  approval_date: string;
  approval_status: string;
}

export const EMPTY_MINUTES: MinutesFormData = {
  title: '', slug: '', date: '', meeting_type: 'regular', source: 'transcribed',
  body: '', pdf_url: '', attendees_present: [], attendees_absent: [],
  attendees_also_present: [], region_id: '',
  meeting_id: '', board_id: '', approval_date: '', approval_status: 'pending',
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync generated slug into form (only for new records)
  useEffect(() => { if (slug && !data.slug) onChange({ ...data, slug }); }, [slug]);

  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  const [boards, setBoards] = useState<{ label: string; value: string }[]>([]);
  const [meetingsList, setMeetingsList] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase.from('regions').select('id, name').eq('is_active', true).order('display_order')
      .then(({ data: r }) => { if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id }))); });
  }, []);

  useEffect(() => {
    if (!data.region_id) return;
    supabase.from('boards_commissions').select('id, name').eq('region_id', data.region_id).eq('status', 'published').order('name')
      .then(({ data: b }) => { if (b) setBoards(b.map((x) => ({ label: x.name, value: x.id }))); });
    supabase.from('meetings').select('id, title').eq('region_id', data.region_id).order('meeting_date', { ascending: false }).limit(50)
      .then(({ data: m }) => { if (m) setMeetingsList(m.map((x) => ({ label: x.title, value: x.id }))); });
  }, [data.region_id]);

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

      <FormRow>
        <FormColumn><SelectField label="Board / Commission" value={data.board_id} onValueChange={(v) => set('board_id', v)} options={boards} placeholder="Select board..." /></FormColumn>
        <FormColumn><SelectField label="Linked Meeting" value={data.meeting_id} onValueChange={(v) => set('meeting_id', v)} options={meetingsList} placeholder="Select meeting..." /></FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn><DateField label="Approval Date" value={data.approval_date} onValueChange={(v) => set('approval_date', v)} /></FormColumn>
        <FormColumn><SelectField label="Approval Status" value={data.approval_status} onValueChange={(v) => set('approval_status', v)} options={APPROVAL_STATUS_OPTIONS} /></FormColumn>
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
