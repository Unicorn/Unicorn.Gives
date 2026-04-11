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

const LINK_GROUP_OPTIONS = [
  { label: 'Homepage Tiles', value: 'homepage_tiles' },
  { label: 'I Want To...', value: 'i_want_to' },
  { label: 'Footer', value: 'footer' },
  { label: 'Utility Bar', value: 'utility_bar' },
];

const STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export interface QuickLinkFormData {
  title: string;
  slug: string;
  url: string;
  description: string;
  icon: string;
  link_group: string;
  is_external: boolean;
  open_in_new_tab: boolean;
  display_order: number;
  region_id: string;
  status: string;
}

export const EMPTY_QUICK_LINK: QuickLinkFormData = {
  title: '',
  slug: '',
  url: '',
  description: '',
  icon: '',
  link_group: 'homepage_tiles',
  is_external: false,
  open_in_new_tab: false,
  display_order: 0,
  region_id: '',
  status: 'published',
};

interface QuickLinkFormProps {
  data: QuickLinkFormData;
  onChange: (data: QuickLinkFormData) => void;
  errors?: Record<string, string>;
}

export function QuickLinkForm({ data, onChange, errors = {} }: QuickLinkFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync slug
  useEffect(() => { if (slug && !data.slug) onChange({ ...data, slug }); }, [slug]);

  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    supabase.from('regions').select('id, name').eq('is_active', true).order('display_order')
      .then(({ data: r }) => { if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id }))); });
  }, []);

  function set<K extends keyof QuickLinkFormData>(key: K, value: QuickLinkFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  return (
    <View style={styles.form}>
      <TextField
        label="Title"
        value={data.title}
        onChangeText={(v) => set('title', v)}
        placeholder="Link title"
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
        label="URL"
        value={data.url}
        onChangeText={(v) => set('url', v)}
        placeholder="https://example.com or /path"
        required
        error={errors.url}
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
            label="Icon"
            value={data.icon}
            onChangeText={(v) => set('icon', v)}
            placeholder="Material icon name (e.g. home)"
            hint="MaterialIcons name or emoji"
          />
        </FormColumn>
        <FormColumn>
          <SelectField
            label="Link Group"
            value={data.link_group}
            onValueChange={(v) => set('link_group', v)}
            options={LINK_GROUP_OPTIONS}
            required
          />
        </FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn>
          <SelectField
            label="Region"
            value={data.region_id}
            onValueChange={(v) => set('region_id', v)}
            options={regions}
            placeholder="Global (no region)"
          />
        </FormColumn>
        <FormColumn>
          <SelectField
            label="Status"
            value={data.status}
            onValueChange={(v) => set('status', v)}
            options={STATUS_OPTIONS}
            required
          />
        </FormColumn>
      </FormRow>

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
          <View style={{ gap: 8 }}>
            <CheckboxField
              label="External link"
              value={data.is_external}
              onValueChange={(v) => set('is_external', v)}
              hint="Link points to an external website"
            />
            <CheckboxField
              label="Open in new tab"
              value={data.open_in_new_tab}
              onValueChange={(v) => set('open_in_new_tab', v)}
            />
          </View>
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
