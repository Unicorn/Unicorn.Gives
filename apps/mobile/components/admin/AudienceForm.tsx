import { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';

import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, type ThemeColors } from '@/constants/theme';
import {
  TextField,
  CheckboxField,
  SlugField,
  FormRow,
  FormColumn,
} from './AdminForm';

export interface AudienceFormData {
  label: string;
  slug: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

export const EMPTY_AUDIENCE: AudienceFormData = {
  label: '',
  slug: '',
  description: '',
  display_order: 0,
  is_active: true,
};

interface AudienceFormProps {
  data: AudienceFormData;
  onChange: (data: AudienceFormData) => void;
  errors?: Record<string, string>;
}

export function AudienceForm({ data, onChange, errors = {} }: AudienceFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.label);

  useEffect(() => {
    if (slug && !data.slug) {
      onChange({ ...data, slug });
    }
  }, [slug]);

  function set<K extends keyof AudienceFormData>(key: K, value: AudienceFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <TextField
        label="Label"
        value={data.label}
        onChangeText={(v) => set('label', v)}
        placeholder="Audience label (e.g. Residents)"
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

      <FormRow>
        <FormColumn>
          <TextField
            label="Display Order"
            value={String(data.display_order)}
            onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)}
            placeholder="0"
          />
        </FormColumn>
        <FormColumn>
          <CheckboxField
            label="Active"
            value={data.is_active}
            onValueChange={(v) => set('is_active', v)}
            hint="Inactive audiences won't appear in dropdowns"
          />
        </FormColumn>
      </FormRow>
    </View>
  );
}

const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    form: {
      gap: 0,
    },
  });
