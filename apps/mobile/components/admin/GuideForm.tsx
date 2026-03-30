import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useCategories } from '@/hooks/useCategories';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import {
  TextField,
  SelectField,
  DateField,
  SlugField,
  FormRow,
  FormColumn,
} from './AdminForm';
import { AdminRichEditor } from './AdminRichEditor';

/* ── Constants ── */

const JURISDICTION_OPTIONS = [
  { label: 'Township', value: 'township' },
  { label: 'County', value: 'county' },
  { label: 'State', value: 'state' },
  { label: 'Federal', value: 'federal' },
];

/* ── Types ── */

export interface GuideContact {
  id?: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  display_order: number;
}

export interface GuideFormEntry {
  id?: string;
  name: string;
  url: string;
  format: string;
  display_order: number;
}

export interface GuideFormData {
  title: string;
  slug: string;
  description: string;
  body: string;
  category: string;
  scenario: string;
  icon: string;
  jurisdiction: string;
  last_verified: string;
  contacts: GuideContact[];
  forms: GuideFormEntry[];
}

export const EMPTY_GUIDE: GuideFormData = {
  title: '',
  slug: '',
  description: '',
  body: '',
  category: 'services',
  scenario: '',
  icon: '',
  jurisdiction: 'county',
  last_verified: '',
  contacts: [],
  forms: [],
};

interface GuideFormProps {
  data: GuideFormData;
  onChange: (data: GuideFormData) => void;
  errors?: Record<string, string>;
}

export function GuideForm({ data, onChange, errors = {} }: GuideFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { categories: guideCategories } = useCategories('guides');
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  useEffect(() => {
    if (slug && !data.slug) {
      onChange({ ...data, slug });
    }
  }, [slug]);

  function set<K extends keyof GuideFormData>(key: K, value: GuideFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  /* ── Contact helpers ── */
  function addContact() {
    set('contacts', [...data.contacts, { name: '', role: '', phone: '', email: '', display_order: data.contacts.length }]);
  }
  function updateContact(index: number, field: keyof GuideContact, value: string | number) {
    const updated = [...data.contacts];
    updated[index] = { ...updated[index], [field]: value };
    set('contacts', updated);
  }
  function removeContact(index: number) {
    set('contacts', data.contacts.filter((_, i) => i !== index));
  }

  /* ── Form helpers ── */
  function addForm() {
    set('forms', [...data.forms, { name: '', url: '', format: 'PDF', display_order: data.forms.length }]);
  }
  function updateForm(index: number, field: keyof GuideFormEntry, value: string | number) {
    const updated = [...data.forms];
    updated[index] = { ...updated[index], [field]: value };
    set('forms', updated);
  }
  function removeForm(index: number) {
    set('forms', data.forms.filter((_, i) => i !== index));
  }

  return (
    <View style={styles.form}>
      <TextField
        label="Title"
        value={data.title}
        onChangeText={(v) => set('title', v)}
        placeholder="Guide title"
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
        label="Scenario"
        value={data.scenario}
        onChangeText={(v) => set('scenario', v)}
        placeholder="e.g. I want to build a pole barn on my property"
        required
        error={errors.scenario}
        hint="The question or situation this guide answers"
      />

      <TextField
        label="Description"
        value={data.description}
        onChangeText={(v) => set('description', v)}
        placeholder="Short description for cards and search results"
        multiline
        numberOfLines={2}
      />

      <FormRow>
        <FormColumn>
          <SelectField
            label="Category"
            value={data.category}
            onValueChange={(v) => set('category', v)}
            options={guideCategories}
            required
            error={errors.category}
          />
        </FormColumn>
        <FormColumn>
          <SelectField
            label="Jurisdiction"
            value={data.jurisdiction}
            onValueChange={(v) => set('jurisdiction', v)}
            options={JURISDICTION_OPTIONS}
          />
        </FormColumn>
      </FormRow>

      <FormRow>
        <FormColumn>
          <TextField
            label="Icon"
            value={data.icon}
            onChangeText={(v) => set('icon', v)}
            placeholder="e.g. 🏠 or emoji"
            hint="Emoji displayed on guide cards"
          />
        </FormColumn>
        <FormColumn>
          <DateField
            label="Last Verified"
            value={data.last_verified}
            onChangeText={(v) => set('last_verified', v)}
          />
        </FormColumn>
      </FormRow>

      {/* Body */}
      <AdminRichEditor
        label="Guide Body"
        value={data.body}
        onChange={(v) => set('body', v)}
        placeholder="Write the step-by-step guide..."
      />

      {/* ── Guide Contacts (child table) ── */}
      <View style={styles.childSection}>
        <View style={styles.childHeader}>
          <Text style={styles.childTitle}>Contacts</Text>
          <Pressable style={styles.addBtn} onPress={addContact}>
            <MaterialIcons name="add" size={16} color={colors.primary} />
            <Text style={styles.addBtnText}>Add Contact</Text>
          </Pressable>
        </View>
        {data.contacts.length === 0 && (
          <Text style={styles.childEmpty}>No contacts added yet.</Text>
        )}
        {data.contacts.map((c, i) => (
          <View key={c.id ?? `new-${i}`} style={styles.childRow}>
            <View style={styles.childRowFields}>
              <FormRow>
                <FormColumn>
                  <TextField label="Name" value={c.name} onChangeText={(v) => updateContact(i, 'name', v)} placeholder="Contact name" required />
                </FormColumn>
                <FormColumn>
                  <TextField label="Role" value={c.role} onChangeText={(v) => updateContact(i, 'role', v)} placeholder="e.g. Zoning Administrator" />
                </FormColumn>
              </FormRow>
              <FormRow>
                <FormColumn>
                  <TextField label="Phone" value={c.phone} onChangeText={(v) => updateContact(i, 'phone', v)} placeholder="(555) 555-5555" />
                </FormColumn>
                <FormColumn>
                  <TextField label="Email" value={c.email} onChangeText={(v) => updateContact(i, 'email', v)} placeholder="email@example.com" />
                </FormColumn>
              </FormRow>
            </View>
            <Pressable style={styles.removeBtn} onPress={() => removeContact(i)}>
              <MaterialIcons name="close" size={16} color={colors.error} />
            </Pressable>
          </View>
        ))}
      </View>

      {/* ── Guide Forms (child table) ── */}
      <View style={styles.childSection}>
        <View style={styles.childHeader}>
          <Text style={styles.childTitle}>Forms & Documents</Text>
          <Pressable style={styles.addBtn} onPress={addForm}>
            <MaterialIcons name="add" size={16} color={colors.primary} />
            <Text style={styles.addBtnText}>Add Form</Text>
          </Pressable>
        </View>
        {data.forms.length === 0 && (
          <Text style={styles.childEmpty}>No forms added yet.</Text>
        )}
        {data.forms.map((f, i) => (
          <View key={f.id ?? `new-${i}`} style={styles.childRow}>
            <View style={styles.childRowFields}>
              <FormRow>
                <FormColumn flex={2}>
                  <TextField label="Name" value={f.name} onChangeText={(v) => updateForm(i, 'name', v)} placeholder="Form name" required />
                </FormColumn>
                <FormColumn>
                  <TextField label="Format" value={f.format} onChangeText={(v) => updateForm(i, 'format', v)} placeholder="PDF" />
                </FormColumn>
              </FormRow>
              <TextField label="URL" value={f.url} onChangeText={(v) => updateForm(i, 'url', v)} placeholder="https://..." required />
            </View>
            <Pressable style={styles.removeBtn} onPress={() => removeForm(i)}>
              <MaterialIcons name="close" size={16} color={colors.error} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    form: { gap: 0 },

    /* Child table sections */
    childSection: {
      marginTop: spacing.xl,
      marginBottom: spacing.md,
    },
    childHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    childTitle: {
      fontFamily: fonts.sansBold,
      fontSize: 16,
      color: colors.neutral,
    },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: 6,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    addBtnText: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      color: colors.primary,
    },
    childEmpty: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
      paddingVertical: spacing.md,
    },
    childRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.sm,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    childRowFields: {
      flex: 1,
    },
    removeBtn: {
      width: 28,
      height: 28,
      borderRadius: radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      marginTop: spacing.xl,
    },
  });
