import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, spacing, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, SlugField, CheckboxField, DateField, FormRow, FormColumn } from './AdminForm';

const MEETING_TYPES = [
  { label: 'Regular', value: 'regular' },
  { label: 'Special', value: 'special' },
  { label: 'Emergency', value: 'emergency' },
  { label: 'Work Session', value: 'work_session' },
  { label: 'Public Hearing', value: 'public_hearing' },
];

export interface MeetingFormData {
  title: string;
  slug: string;
  board_id: string;
  meeting_type: string;
  meeting_date: string;
  start_time: string;
  end_time: string;
  location: string;
  location_url: string;
  agenda_url: string;
  agenda_body: string;
  packet_url: string;
  video_url: string;
  minutes_id: string;
  is_cancelled: boolean;
  cancellation_notice: string;
  region_id: string;
}

export const EMPTY_MEETING: MeetingFormData = {
  title: '', slug: '', board_id: '', meeting_type: 'regular',
  meeting_date: '', start_time: '', end_time: '',
  location: '', location_url: '', agenda_url: '', agenda_body: '',
  packet_url: '', video_url: '', minutes_id: '',
  is_cancelled: false, cancellation_notice: '', region_id: '',
};

interface Props {
  data: MeetingFormData;
  onChange: (data: MeetingFormData) => void;
  errors?: Record<string, string>;
}

export function MeetingForm({ data, onChange, errors = {} }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync slug
  useEffect(() => { if (slug && !data.slug) onChange({ ...data, slug }); }, [slug]);

  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  const [boards, setBoards] = useState<{ label: string; value: string }[]>([]);
  const [minutesList, setMinutesList] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase.from('regions').select('id, name').eq('is_active', true).order('display_order')
      .then(({ data: r }) => { if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id }))); });
  }, []);

  useEffect(() => {
    if (!data.region_id) return;
    supabase.from('boards_commissions').select('id, name').eq('region_id', data.region_id).eq('status', 'published').order('name')
      .then(({ data: b }) => { if (b) setBoards(b.map((x) => ({ label: x.name, value: x.id }))); });
    supabase.from('minutes').select('id, title').eq('region_id', data.region_id).order('date', { ascending: false }).limit(50)
      .then(({ data: m }) => { if (m) setMinutesList(m.map((x) => ({ label: x.title, value: x.id }))); });
  }, [data.region_id]);

  function set<K extends keyof MeetingFormData>(key: K, value: MeetingFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />

      <TextField label="Meeting Title" value={data.title} onChangeText={(v) => set('title', v)} placeholder="e.g. City Commission Regular Meeting" required error={errors.title} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />

      <FormRow>
        <FormColumn><SelectField label="Board / Commission" value={data.board_id} onValueChange={(v) => set('board_id', v)} options={boards} placeholder="Select board..." /></FormColumn>
        <FormColumn><SelectField label="Meeting Type" value={data.meeting_type} onValueChange={(v) => set('meeting_type', v)} options={MEETING_TYPES} required /></FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn><DateField label="Meeting Date" value={data.meeting_date} onValueChange={(v) => set('meeting_date', v)} required error={errors.meeting_date} /></FormColumn>
        <FormColumn><TextField label="Start Time" value={data.start_time} onChangeText={(v) => set('start_time', v)} placeholder="e.g. 6:30 PM" /></FormColumn>
        <FormColumn><TextField label="End Time" value={data.end_time} onChangeText={(v) => set('end_time', v)} placeholder="e.g. 8:00 PM" /></FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn><TextField label="Location" value={data.location} onChangeText={(v) => set('location', v)} placeholder="e.g. City Hall, Council Chambers" /></FormColumn>
        <FormColumn><TextField label="Location URL" value={data.location_url} onChangeText={(v) => set('location_url', v)} placeholder="https://maps.google.com/..." /></FormColumn>
      </FormRow>

      <TextField label="Agenda URL" value={data.agenda_url} onChangeText={(v) => set('agenda_url', v)} placeholder="https://..." hint="Link to agenda PDF" />
      <TextField label="Agenda Body" value={data.agenda_body} onChangeText={(v) => set('agenda_body', v)} placeholder="Inline agenda content" multiline numberOfLines={6} />
      <TextField label="Packet URL" value={data.packet_url} onChangeText={(v) => set('packet_url', v)} placeholder="https://..." hint="Meeting packet PDF" />
      <TextField label="Video URL" value={data.video_url} onChangeText={(v) => set('video_url', v)} placeholder="https://..." hint="Meeting recording link" />

      <SelectField label="Linked Minutes" value={data.minutes_id} onValueChange={(v) => set('minutes_id', v)} options={minutesList} placeholder="None" />

      <CheckboxField label="Meeting Cancelled" value={data.is_cancelled} onValueChange={(v) => set('is_cancelled', v)} />
      {data.is_cancelled && (
        <TextField label="Cancellation Notice" value={data.cancellation_notice} onChangeText={(v) => set('cancellation_notice', v)} placeholder="Reason for cancellation" multiline numberOfLines={3} />
      )}
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
