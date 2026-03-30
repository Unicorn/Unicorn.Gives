import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { FormField } from './fields/FormField';

// Re-export FormField for direct use
export { FormField as Field };

/* ── Text input ── */

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  multiline?: boolean;
  numberOfLines?: number;
  onBlur?: () => void;
}

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  error,
  hint,
  multiline,
  numberOfLines = 4,
  onBlur,
}: TextFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <FormField label={label} required={required} error={error} hint={hint}>
      <TextInput
        style={[
          styles.input,
          multiline && { minHeight: numberOfLines * 24, textAlignVertical: 'top' },
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={colors.outlineVariant}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
      />
    </FormField>
  );
}

/* ── Select ── */

interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
  placeholder?: string;
}

export function SelectField({
  label,
  value,
  onValueChange,
  options,
  required,
  error,
  placeholder = 'Select...',
}: SelectFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <FormField label={label} required={required} error={error}>
      <View style={[styles.selectWrapper, error && styles.inputError]}>
        <select
          value={value}
          onChange={(e: any) => onValueChange(e.target.value)}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 14,
            fontFamily: 'inherit',
            border: 'none',
            backgroundColor: 'transparent',
            color: value ? colors.neutral : colors.outlineVariant,
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </View>
    </FormField>
  );
}

/* ── Date field (web-native) ── */

interface DateFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  error?: string;
}

export function DateField({ label, value, onChangeText, required, error }: DateFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <FormField label={label} required={required} error={error}>
      <View style={styles.input}>
        <input
          type="date"
          value={value}
          onChange={(e: any) => onChangeText(e.target.value)}
          style={{
            width: '100%',
            fontSize: 14,
            fontFamily: 'inherit',
            border: 'none',
            backgroundColor: 'transparent',
            color: colors.neutral,
            outline: 'none',
          }}
        />
      </View>
    </FormField>
  );
}

/* ── Checkbox ── */

interface CheckboxFieldProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  hint?: string;
}

export function CheckboxField({ label, value, onValueChange, hint }: CheckboxFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable style={styles.checkboxRow} onPress={() => onValueChange(!value)}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.outline, true: colors.primary }}
        thumbColor={colors.surface}
      />
      <View>
        <Text style={styles.checkboxLabel}>{label}</Text>
        {hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
    </Pressable>
  );
}

/* ── Tags input ── */

interface TagsFieldProps {
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  hint?: string;
  /** Pre-loaded tag suggestions: { label, value } pairs from useTags() */
  suggestions?: { label: string; value: string }[];
}

export function TagsField({ label, value, onChange, placeholder = 'Add tag...', hint, suggestions = [] }: TagsFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [inputText, setInputText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = useMemo(() => {
    if (!inputText.trim() || suggestions.length === 0) return [];
    const q = inputText.trim().toLowerCase();
    return suggestions
      .filter((s) => s.value.includes(q) || s.label.toLowerCase().includes(q))
      .filter((s) => !value.includes(s.value))
      .slice(0, 8);
  }, [inputText, suggestions, value]);

  function addTag(text: string) {
    const tag = text.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInputText('');
    setShowSuggestions(false);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <FormField label={label} hint={hint}>
      <View style={styles.tagsContainer}>
        {value.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
            <Pressable onPress={() => removeTag(tag)}>
              <MaterialIcons name="close" size={14} color={colors.neutralVariant} />
            </Pressable>
          </View>
        ))}
        <TextInput
          style={styles.tagInput}
          placeholder={placeholder}
          placeholderTextColor={colors.outlineVariant}
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setShowSuggestions(true);
          }}
          onSubmitEditing={() => {
            addTag(inputText);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow suggestion press to register
            setTimeout(() => setShowSuggestions(false), 150);
          }}
        />
      </View>
      {showSuggestions && filtered.length > 0 && (
        <View style={styles.suggestionsDropdown}>
          {filtered.map((s) => (
            <Pressable
              key={s.value}
              style={styles.suggestionItem}
              onPress={() => addTag(s.value)}
            >
              <Text style={styles.suggestionText}>{s.label}</Text>
              <Text style={styles.suggestionSlug}>{s.value}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </FormField>
  );
}

/* ── Slug field ── */

interface SlugFieldProps {
  label?: string;
  slug: string;
  onSlugChange: (slug: string) => void;
  manuallyEdited?: boolean;
  onReset?: () => void;
}

export function SlugField({
  label = 'URL Slug',
  slug,
  onSlugChange,
  manuallyEdited,
  onReset,
}: SlugFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <FormField label={label} hint={manuallyEdited ? 'Manually edited' : 'Auto-generated from title'}>
      <View style={styles.slugRow}>
        <TextInput
          style={[styles.input, styles.slugInput]}
          value={slug}
          onChangeText={onSlugChange}
          placeholder="url-slug"
          placeholderTextColor={colors.outlineVariant}
        />
        {manuallyEdited && onReset && (
          <Pressable style={styles.slugReset} onPress={onReset}>
            <MaterialIcons name="refresh" size={16} color={colors.neutralVariant} />
          </Pressable>
        )}
      </View>
    </FormField>
  );
}

/* ── Form row (horizontal layout) ── */

export function FormRow({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: spacing.lg }}>{children}</View>;
}

export function FormColumn({ children, flex = 1 }: { children: React.ReactNode; flex?: number }) {
  return <View style={{ flex }}>{children}</View>;
}

/* ── Styles ── */

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    inputError: {
      borderColor: colors.error,
    },
    hint: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
    selectWrapper: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      overflow: 'hidden',
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm + 2,
      marginBottom: spacing.md,
    },
    checkboxLabel: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs + 2,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      padding: spacing.sm,
      minHeight: 40,
      alignItems: 'center',
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
    },
    tagText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutral,
    },
    tagInput: {
      flex: 1,
      minWidth: 80,
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
      padding: spacing.xs,
    },
    slugRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      alignItems: 'center',
    },
    slugInput: {
      flex: 1,
      fontFamily: 'monospace',
    },
    slugReset: {
      width: 32,
      height: 32,
      borderRadius: radii.sm,
      backgroundColor: colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    suggestionsDropdown: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      marginTop: 4,
      maxHeight: 200,
      overflow: 'hidden',
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outlineVariant,
    },
    suggestionText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutral,
    },
    suggestionSlug: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.outlineVariant,
    },
  });
