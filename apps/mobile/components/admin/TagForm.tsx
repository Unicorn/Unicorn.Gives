import { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, type ThemeColors } from '@/constants/theme';
import {
  TextField,
  CheckboxField,
  SlugField,
} from './AdminForm';

export interface TagFormData {
  label: string;
  slug: string;
  description: string;
  is_active: boolean;
}

export const EMPTY_TAG: TagFormData = {
  label: '',
  slug: '',
  description: '',
  is_active: true,
};

interface TagFormProps {
  data: TagFormData;
  onChange: (data: TagFormData) => void;
  errors?: Record<string, string>;
}

export function TagForm({ data, onChange, errors = {} }: TagFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.label);

  useEffect(() => {
    if (slug && !data.slug) {
      onChange({ ...data, slug });
    }
  }, [slug]);

  function set<K extends keyof TagFormData>(key: K, value: TagFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <TextField
        label="Label"
        value={data.label}
        onChangeText={(v) => set('label', v)}
        placeholder="Tag label (e.g. outdoor)"
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

      <TextField
        label="Description"
        value={data.description}
        onChangeText={(v) => set('description', v)}
        placeholder="Optional description"
        multiline
        numberOfLines={2}
      />

      <CheckboxField
        label="Active"
        value={data.is_active}
        onValueChange={(v) => set('is_active', v)}
        hint="Inactive tags won't appear in autocomplete suggestions"
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
