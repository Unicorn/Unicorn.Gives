import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, spacing, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, SlugField, DateField, CheckboxField, FormRow, FormColumn } from './AdminForm';

const CONTACT_TYPES = [
  { label: 'Staff', value: 'staff' },
  { label: 'Elected Official', value: 'elected_official' },
  { label: 'Appointed Official', value: 'appointed_official' },
  { label: 'Board Member', value: 'board_member' },
];

export interface ContactFormData {
  name: string;
  slug: string;
  role: string;
  department: string;
  phone: string;
  phone_ext: string;
  email: string;
  address: string;
  hours: string;
  website: string;
  display_order: number;
  region_id: string;
  department_id: string;
  contact_type: string;
  photo_url: string;
  bio: string;
  term_start: string;
  term_end: string;
  is_department_head: boolean;
}

export const EMPTY_CONTACT: ContactFormData = {
  name: '', slug: '', role: '', department: '', phone: '', phone_ext: '',
  email: '', address: '', hours: '', website: '', display_order: 0, region_id: '',
  department_id: '', contact_type: 'staff', photo_url: '', bio: '',
  term_start: '', term_end: '', is_department_head: false,
};

interface ContactFormProps {
  data: ContactFormData;
  onChange: (data: ContactFormData) => void;
  errors?: Record<string, string>;
}

export function ContactForm({ data, onChange, errors = {} }: ContactFormProps) {
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

  function set<K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />

      <TextField label="Name" value={data.name} onChangeText={(v) => set('name', v)} placeholder="Full name" required error={errors.name} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />

      <FormRow>
        <FormColumn><TextField label="Title / Role" value={data.role} onChangeText={(v) => set('role', v)} placeholder="e.g. Supervisor" required error={errors.role} /></FormColumn>
        <FormColumn><TextField label="Department" value={data.department} onChangeText={(v) => set('department', v)} placeholder="e.g. Board of Trustees" required error={errors.department} /></FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn><TextField label="Phone" value={data.phone} onChangeText={(v) => set('phone', v)} placeholder="(555) 555-5555" /></FormColumn>
        <FormColumn><TextField label="Extension" value={data.phone_ext} onChangeText={(v) => set('phone_ext', v)} placeholder="Ext." /></FormColumn>
      </FormRow>

      <TextField label="Email" value={data.email} onChangeText={(v) => set('email', v)} placeholder="email@example.com" />
      <TextField label="Address" value={data.address} onChangeText={(v) => set('address', v)} placeholder="Street address" />
      <TextField label="Hours" value={data.hours} onChangeText={(v) => set('hours', v)} placeholder="e.g. Mon–Fri 8am–5pm" />
      <TextField label="Website" value={data.website} onChangeText={(v) => set('website', v)} placeholder="https://..." />
      <SelectField label="Department" value={data.department_id} onValueChange={(v) => set('department_id', v)} options={departments} placeholder="Select department..." />
      <SelectField label="Contact Type" value={data.contact_type} onValueChange={(v) => set('contact_type', v)} options={CONTACT_TYPES} />

      <TextField label="Photo URL" value={data.photo_url} onChangeText={(v) => set('photo_url', v)} placeholder="https://..." />
      <TextField label="Bio" value={data.bio} onChangeText={(v) => set('bio', v)} placeholder="Brief biography" multiline numberOfLines={4} />

      <FormRow>
        <FormColumn><DateField label="Term Start" value={data.term_start} onValueChange={(v) => set('term_start', v)} /></FormColumn>
        <FormColumn><DateField label="Term End" value={data.term_end} onValueChange={(v) => set('term_end', v)} /></FormColumn>
      </FormRow>

      <CheckboxField label="Department Head" value={data.is_department_head} onValueChange={(v) => set('is_department_head', v)} hint="This person is the head of their department" />
      <TextField label="Display Order" value={String(data.display_order)} onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)} placeholder="0" hint="Lower numbers appear first" />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) => StyleSheet.create({ form: { gap: 0 } });
