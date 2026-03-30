import { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

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

const CONTENT_TYPE_OPTIONS = [
  { label: 'Events', value: 'events' },
  { label: 'News', value: 'news' },
  { label: 'Guides', value: 'guides' },
  { label: 'Ordinances', value: 'ordinances' },
];

export interface CategoryFormData {
  label: string;
  slug: string;
  content_type: string;
  description: string;
  color: string;
  display_order: number;
  is_active: boolean;
}

export const EMPTY_CATEGORY: CategoryFormData = {
  label: '',
  slug: '',
  content_type: '',
  description: '',
  color: '',
  display_order: 0,
  is_active: true,
};

interface CategoryFormProps {
  data: CategoryFormData;
  onChange: (data: CategoryFormData) => void;
  errors?: Record<string, string>;
}

export function CategoryForm({ data, onChange, errors = {} }: CategoryFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.label);

  useEffect(() => {
    if (slug && !data.slug) {
      onChange({ ...data, slug });
    }
  }, [slug]);

  function set<K extends keyof CategoryFormData>(key: K, value: CategoryFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <TextField
        label="Label"
        value={data.label}
        onChangeText={(v) => set('label', v)}
        placeholder="Category label (e.g. Community)"
        required
        error={errors.label}
      />
      <SlugField
        slug={data.slug || slug}
        onSlugChange={(v) => {
          setSlug(v);
          set('slug', v);
        }}
        manuallyEdited={manuallyEdited}
        onReset={resetManual}
      />

      <FormRow>
        <FormColumn>
          <SelectField
            label="Content Type"
            value={data.content_type}
            onValueChange={(v) => set('content_type', v)}
            options={CONTENT_TYPE_OPTIONS}
            required
            error={errors.content_type}
          />
        </FormColumn>
        <FormColumn>
          <TextField
            label="Display Order"
            value={String(data.display_order)}
            onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)}
            placeholder="0"
          />
        </FormColumn>
      </FormRow>

      <TextField
        label="Description"
        value={data.description}
        onChangeText={(v) => set('description', v)}
        placeholder="Optional description"
        multiline
        numberOfLines={2}
      />

      <TextField
        label="Color"
        value={data.color}
        onChangeText={(v) => set('color', v)}
        placeholder="#hex color (optional)"
        hint="Hex color for UI chips, e.g. #2E7D6F"
      />

      <CheckboxField
        label="Active"
        value={data.is_active}
        onValueChange={(v) => set('is_active', v)}
        hint="Inactive categories won't appear in form dropdowns"
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    form: {
      gap: 0,
    },
  });
