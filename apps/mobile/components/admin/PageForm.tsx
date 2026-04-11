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
import { AdminRichEditor } from './AdminRichEditor';

/* ── Options ── */

const PAGE_TYPE_OPTIONS = [
  { label: 'Standard', value: 'standard' },
  { label: 'Department Landing', value: 'department_landing' },
  { label: 'Service Landing', value: 'service_landing' },
  { label: 'Redirect', value: 'redirect' },
  { label: 'Landing Page', value: 'landing_page' },
];

const AUDIENCE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Residents', value: 'residents' },
  { label: 'Businesses', value: 'businesses' },
  { label: 'Visitors', value: 'visitors' },
  { label: 'Internal', value: 'internal' },
];

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
  department_id: string;
  parent_page_id: string;
  page_type: string;
  redirect_url: string;
  audience: string;
  template: string;
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
  department_id: '',
  parent_page_id: '',
  page_type: 'standard',
  redirect_url: '',
  audience: '',
  template: '',
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

  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);
  const [pages, setPages] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase.from('departments').select('id, name').order('name')
      .then(({ data: d }) => { if (d) setDepartments(d.map((x) => ({ label: x.name, value: x.id }))); });
    supabase.from('pages').select('id, title').order('title')
      .then(({ data: p }) => { if (p) setPages(p.map((x) => ({ label: x.title, value: x.id }))); });
  }, []);

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

      <FormRow>
        <FormColumn>
          <SelectField
            label="Department"
            value={data.department_id}
            onValueChange={(v) => set('department_id', v)}
            options={departments}
            placeholder="None"
          />
        </FormColumn>
        <FormColumn>
          <SelectField
            label="Parent Page"
            value={data.parent_page_id}
            onValueChange={(v) => set('parent_page_id', v)}
            options={pages}
            placeholder="None (top-level)"
          />
        </FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn>
          <SelectField
            label="Page Type"
            value={data.page_type}
            onValueChange={(v) => set('page_type', v)}
            options={PAGE_TYPE_OPTIONS}
          />
        </FormColumn>
        <FormColumn>
          <SelectField
            label="Audience"
            value={data.audience}
            onValueChange={(v) => set('audience', v)}
            options={AUDIENCE_OPTIONS}
            placeholder="Not specified"
          />
        </FormColumn>
      </FormRow>

      {data.page_type === 'redirect' && (
        <TextField
          label="Redirect URL"
          value={data.redirect_url}
          onChangeText={(v) => set('redirect_url', v)}
          placeholder="https://... or /path"
          hint="Users visiting this page will be redirected to this URL"
        />
      )}

      <TextField
        label="Template"
        value={data.template}
        onChangeText={(v) => set('template', v)}
        placeholder="Template identifier (optional)"
        hint="Custom template key for special page layouts"
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
