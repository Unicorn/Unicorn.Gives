import { useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';

/* ── Field wrapper ── */

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, required, error, hint, children }: FieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {children}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

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
}: TextFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Field label={label} required={required} error={error} hint={hint}>
      <TextInput
        style={[
          styles.input,
          multiline && { minHeight: numberOfLines * 24, textAlignVertical: 'top' },
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.outlineVariant}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
      />
    </Field>
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
    <Field label={label} required={required} error={error}>
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
    </Field>
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
    <Field label={label} required={required} error={error}>
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
    </Field>
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
}

export function TagsField({ label, value, onChange, placeholder = 'Add tag...', hint }: TagsFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  function addTag(text: string) {
    const tag = text.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <Field label={label} hint={hint}>
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
          onSubmitEditing={(e) => {
            addTag(e.nativeEvent.text);
            (e.target as any).value = '';
          }}
        />
      </View>
    </Field>
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
    <Field label={label} hint={manuallyEdited ? 'Manually edited' : 'Auto-generated from title'}>
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
    </Field>
  );
}

/* ── Form row (horizontal layout) ── */

export function FormRow({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: 16 }}>{children}</View>;
}

export function FormColumn({ children, flex = 1 }: { children: React.ReactNode; flex?: number }) {
  return <View style={{ flex }}>{children}</View>;
}

/* ── Styles ── */

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    field: {
      gap: 4,
      marginBottom: spacing.md,
    },
    label: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
    },
    required: {
      color: colors.error,
    },
    hint: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutralVariant,
    },
    error: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.error,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutral,
    },
    inputError: {
      borderColor: colors.error,
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
      gap: 10,
      marginBottom: spacing.md,
    },
    checkboxLabel: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutral,
    },

    /* Tags */
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
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
      gap: 4,
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.pill,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    tagText: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutral,
    },
    tagInput: {
      flex: 1,
      minWidth: 80,
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutral,
      padding: 4,
    },

    /* Slug */
    slugRow: {
      flexDirection: 'row',
      gap: 8,
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
  });
