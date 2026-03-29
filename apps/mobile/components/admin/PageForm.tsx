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
import { AdminRichEditor } from './AdminRichEditor';

/* ── Types ── */

export interface PageFormData {
  title: string;
  slug: string;
  description: string;
  body: string;
  category: string;
  subcategory: string;
  nav_title: string;
  hide_from_nav: boolean;
  display_order: number;
}

export const EMPTY_PAGE: PageFormData = {
  title: '',
  slug: '',
  description: '',
  body: '',
  category: '',
  subcategory: '',
  nav_title: '',
  hide_from_nav: false,
  display_order: 0,
};

interface PageFormProps {
  data: PageFormData;
  onChange: (data: PageFormData) => void;
  errors?: Record<string, string>;
}

export function PageForm({ data, onChange, errors = {} }: PageFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  useEffect(() => {
    if (slug && !data.slug) {
      onChange({ ...data, slug });
    }
  }, [slug]);

  function set<K extends keyof PageFormData>(key: K, value: PageFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <TextField
        label="Title"
        value={data.title}
        onChangeText={(v) => set('title', v)}
        placeholder="Page title"
        required
        error={errors.title}
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
        placeholder="Page description (for SEO and previews)"
        multiline
        numberOfLines={2}
      />

      <FormRow>
        <FormColumn>
          <TextField
            label="Category"
            value={data.category}
            onChangeText={(v) => set('category', v)}
            placeholder="e.g. about, legal, help"
          />
        </FormColumn>
        <FormColumn>
          <TextField
            label="Subcategory"
            value={data.subcategory}
            onChangeText={(v) => set('subcategory', v)}
            placeholder="Optional subcategory"
          />
        </FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn>
          <TextField
            label="Nav Title"
            value={data.nav_title}
            onChangeText={(v) => set('nav_title', v)}
            placeholder="Short title for navigation (optional)"
            hint="If blank, the full title is used"
          />
        </FormColumn>
        <FormColumn>
          <TextField
            label="Display Order"
            value={String(data.display_order)}
            onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)}
            placeholder="0"
            hint="Lower numbers appear first"
          />
        </FormColumn>
      </FormRow>

      <CheckboxField
        label="Hide from navigation"
        value={data.hide_from_nav}
        onValueChange={(v) => set('hide_from_nav', v)}
        hint="Page will still be accessible by direct URL"
      />

      <AdminRichEditor
        label="Page Content"
        value={data.body}
        onChange={(v) => set('body', v)}
        placeholder="Write the page content..."
      />
    </View>
  );
}

const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    form: { gap: 0 },
  });
