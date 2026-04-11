import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, type ThemeColors } from '@/constants/theme';
import {
  TextField,
  SelectField,
  CheckboxField,
  SlugField,
  FormRow,
  FormColumn,
} from './AdminForm';

const LOCATION_OPTIONS = [
  { label: 'Header', value: 'header' },
  { label: 'Footer', value: 'footer' },
  { label: 'Sidebar', value: 'sidebar' },
  { label: 'Utility Bar', value: 'utility_bar' },
  { label: 'Mobile', value: 'mobile' },
];

export interface NavMenuFormData {
  name: string;
  slug: string;
  description: string;
  location: string;
  region_id: string;
  is_active: boolean;
}

export const EMPTY_NAV_MENU: NavMenuFormData = {
  name: '',
  slug: '',
  description: '',
  location: 'header',
  region_id: '',
  is_active: true,
};

interface NavMenuFormProps {
  data: NavMenuFormData;
  onChange: (data: NavMenuFormData) => void;
  errors?: Record<string, string>;
}

export function NavMenuForm({ data, onChange, errors = {} }: NavMenuFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.name);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync slug
  useEffect(() => { if (slug && !data.slug) onChange({ ...data, slug }); }, [slug]);

  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    supabase.from('regions').select('id, name').eq('is_active', true).order('display_order')
      .then(({ data: r }) => { if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id }))); });
  }, []);

  function set<K extends keyof NavMenuFormData>(key: K, value: NavMenuFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <TextField
        label="Name"
        value={data.name}
        onChangeText={(v) => set('name', v)}
        placeholder="Menu name (e.g. Main Navigation)"
        required
        error={errors.name}
      />
      <SlugField
        slug={data.slug || slug}
        onSlugChange={(v) => { setSlug(v); set('slug', v); }}
        manuallyEdited={manuallyEdited}
        onReset={resetManual}
      />

      <TextField
        label="Description"
        value={data.description}
        onChangeText={(v) => set('description', v)}
        placeholder="Optional description"
        multiline
        numberOfLines={2}
      />

      <FormRow>
        <FormColumn>
          <SelectField
            label="Location"
            value={data.location}
            onValueChange={(v) => set('location', v)}
            options={LOCATION_OPTIONS}
            required
          />
        </FormColumn>
        <FormColumn>
          <SelectField
            label="Region"
            value={data.region_id}
            onValueChange={(v) => set('region_id', v)}
            options={regions}
            placeholder="Global (no region)"
          />
        </FormColumn>
      </FormRow>

      <CheckboxField
        label="Active"
        value={data.is_active}
        onValueChange={(v) => set('is_active', v)}
        hint="Inactive menus won't be rendered on the site"
      />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    form: {
      gap: 0,
    },
  });
