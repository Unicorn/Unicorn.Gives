import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, spacing, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, SlugField, CheckboxField, FormRow, FormColumn } from './AdminForm';

const BOARD_TYPES = [
  { label: 'Board', value: 'board' },
  { label: 'Commission', value: 'commission' },
  { label: 'Committee', value: 'committee' },
  { label: 'Authority', value: 'authority' },
  { label: 'Council', value: 'council' },
];

export interface BoardFormData {
  name: string;
  slug: string;
  description: string;
  body: string;
  board_type: string;
  department_id: string;
  meeting_schedule: string;
  meeting_location: string;
  membership_count: number;
  term_length_years: number;
  vacancy_count: number;
  accepting_applications: boolean;
  application_url: string;
  website: string;
  display_order: number;
  region_id: string;
}

export const EMPTY_BOARD: BoardFormData = {
  name: '', slug: '', description: '', body: '', board_type: 'board',
  department_id: '', meeting_schedule: '', meeting_location: '',
  membership_count: 0, term_length_years: 0, vacancy_count: 0,
  accepting_applications: false, application_url: '', website: '',
  display_order: 0, region_id: '',
};

interface Props {
  data: BoardFormData;
  onChange: (data: BoardFormData) => void;
  errors?: Record<string, string>;
}

export function BoardForm({ data, onChange, errors = {} }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.name);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync slug
  useEffect(() => { if (slug && !data.slug) onChange({ ...data, slug }); }, [slug]);

  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase.from('regions').select('id, name').eq('is_active', true).order('display_order')
      .then(({ data: r }) => { if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id }))); });
  }, []);

  useEffect(() => {
    if (!data.region_id) return;
    supabase.from('departments').select('id, name').eq('region_id', data.region_id).eq('status', 'published').order('name')
      .then(({ data: d }) => { if (d) setDepartments(d.map((x) => ({ label: x.name, value: x.id }))); });
  }, [data.region_id]);

  function set<K extends keyof BoardFormData>(key: K, value: BoardFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />

      <TextField label="Board / Commission Name" value={data.name} onChangeText={(v) => set('name', v)} placeholder="e.g. Planning Commission" required error={errors.name} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />

      <FormRow>
        <FormColumn><SelectField label="Type" value={data.board_type} onValueChange={(v) => set('board_type', v)} options={BOARD_TYPES} required /></FormColumn>
        <FormColumn><SelectField label="Department" value={data.department_id} onValueChange={(v) => set('department_id', v)} options={departments} placeholder="Select department..." /></FormColumn>
      </FormRow>

      <TextField label="Description" value={data.description} onChangeText={(v) => set('description', v)} placeholder="Brief overview of purpose and authority" multiline numberOfLines={3} />
      <TextField label="Body" value={data.body} onChangeText={(v) => set('body', v)} placeholder="Bylaws, charter info, detailed description" multiline numberOfLines={8} />

      <TextField label="Meeting Schedule" value={data.meeting_schedule} onChangeText={(v) => set('meeting_schedule', v)} placeholder="e.g. 2nd Tuesday of each month at 6:30pm" />
      <TextField label="Meeting Location" value={data.meeting_location} onChangeText={(v) => set('meeting_location', v)} placeholder="e.g. City Hall, Council Chambers" />

      <FormRow>
        <FormColumn><TextField label="Membership Count" value={String(data.membership_count || '')} onChangeText={(v) => set('membership_count', parseInt(v, 10) || 0)} placeholder="e.g. 7" /></FormColumn>
        <FormColumn><TextField label="Term Length (years)" value={String(data.term_length_years || '')} onChangeText={(v) => set('term_length_years', parseInt(v, 10) || 0)} placeholder="e.g. 4" /></FormColumn>
        <FormColumn><TextField label="Vacancies" value={String(data.vacancy_count || '')} onChangeText={(v) => set('vacancy_count', parseInt(v, 10) || 0)} placeholder="0" /></FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn><CheckboxField label="Accepting Applications" value={data.accepting_applications} onValueChange={(v) => set('accepting_applications', v)} /></FormColumn>
        <FormColumn><TextField label="Application URL" value={data.application_url} onChangeText={(v) => set('application_url', v)} placeholder="https://..." /></FormColumn>
      </FormRow>

      <TextField label="Website" value={data.website} onChangeText={(v) => set('website', v)} placeholder="https://..." />
      <TextField label="Display Order" value={String(data.display_order)} onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)} placeholder="0" />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
