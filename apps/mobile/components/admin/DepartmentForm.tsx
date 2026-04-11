import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, spacing, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, SlugField, CheckboxField, FormRow, FormColumn } from './AdminForm';

export interface DepartmentFormData {
  name: string;
  slug: string;
  short_name: string;
  description: string;
  body: string;
  phone: string;
  fax: string;
  email: string;
  address: string;
  hours: string;
  website: string;
  hero_image_url: string;
  icon: string;
  display_order: number;
  hide_from_nav: boolean;
  parent_department_id: string;
  region_id: string;
}

export const EMPTY_DEPARTMENT: DepartmentFormData = {
  name: '', slug: '', short_name: '', description: '', body: '',
  phone: '', fax: '', email: '', address: '', hours: '', website: '',
  hero_image_url: '', icon: '', display_order: 0, hide_from_nav: false,
  parent_department_id: '', region_id: '',
};

interface Props {
  data: DepartmentFormData;
  onChange: (data: DepartmentFormData) => void;
  errors?: Record<string, string>;
}

export function DepartmentForm({ data, onChange, errors = {} }: Props) {
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
    supabase.from('departments').select('id, name').eq('region_id', data.region_id).order('name')
      .then(({ data: d }) => { if (d) setDepartments(d.map((x) => ({ label: x.name, value: x.id }))); });
  }, [data.region_id]);

  function set<K extends keyof DepartmentFormData>(key: K, value: DepartmentFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />

      <TextField label="Department Name" value={data.name} onChangeText={(v) => set('name', v)} placeholder="e.g. Police Department" required error={errors.name} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />

      <FormRow>
        <FormColumn><TextField label="Short Name" value={data.short_name} onChangeText={(v) => set('short_name', v)} placeholder="e.g. Police" hint="Used in navigation" /></FormColumn>
        <FormColumn><TextField label="Icon" value={data.icon} onChangeText={(v) => set('icon', v)} placeholder="e.g. shield" hint="MaterialIcons name" /></FormColumn>
      </FormRow>

      <TextField label="Description" value={data.description} onChangeText={(v) => set('description', v)} placeholder="Brief department overview" multiline numberOfLines={3} />
      <TextField label="Body" value={data.body} onChangeText={(v) => set('body', v)} placeholder="Full department page content (rich text)" multiline numberOfLines={8} />

      <FormRow>
        <FormColumn><TextField label="Phone" value={data.phone} onChangeText={(v) => set('phone', v)} placeholder="(555) 555-5555" /></FormColumn>
        <FormColumn><TextField label="Fax" value={data.fax} onChangeText={(v) => set('fax', v)} placeholder="(555) 555-5555" /></FormColumn>
      </FormRow>

      <TextField label="Email" value={data.email} onChangeText={(v) => set('email', v)} placeholder="department@city.gov" />
      <TextField label="Address" value={data.address} onChangeText={(v) => set('address', v)} placeholder="Street address" />
      <TextField label="Hours" value={data.hours} onChangeText={(v) => set('hours', v)} placeholder="e.g. Mon–Fri 8am–5pm" />
      <TextField label="Website" value={data.website} onChangeText={(v) => set('website', v)} placeholder="https://..." />
      <TextField label="Hero Image URL" value={data.hero_image_url} onChangeText={(v) => set('hero_image_url', v)} placeholder="https://..." />

      <SelectField label="Parent Department" value={data.parent_department_id} onValueChange={(v) => set('parent_department_id', v)} options={departments} placeholder="None (top-level)" />

      <FormRow>
        <FormColumn><TextField label="Display Order" value={String(data.display_order)} onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)} placeholder="0" hint="Lower numbers appear first" /></FormColumn>
        <FormColumn><CheckboxField label="Hide from Navigation" value={data.hide_from_nav} onValueChange={(v) => set('hide_from_nav', v)} /></FormColumn>
      </FormRow>
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
