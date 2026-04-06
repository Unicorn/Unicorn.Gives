/**
 * Generic repeatable list editor for managing JSONB arrays in admin forms.
 * Used for services, team members, testimonials, gallery images, custom sections, etc.
 */
import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image';
  placeholder?: string;
  required?: boolean;
}

interface RepeatableListEditorProps<T extends object> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldConfig[];
  /** Factory function returning a new empty item */
  createEmpty: () => T;
  /** Render function for each item's fields — gives full control */
  renderItem: (item: T, index: number, updateItem: (updates: Partial<T>) => void) => React.ReactNode;
  /** Max items allowed */
  maxItems?: number;
  hint?: string;
}

export function RepeatableListEditor<T extends object>({
  label,
  items,
  onChange,
  createEmpty,
  renderItem,
  maxItems = 20,
  hint,
}: RepeatableListEditorProps<T>) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  function addItem() {
    if (items.length >= maxItems) return;
    onChange([...items, createEmpty()]);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  }

  function updateItem(index: number, updates: Partial<T>) {
    const updated = [...items];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.count}>{items.length}{maxItems < 20 ? `/${maxItems}` : ''}</Text>
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}

      {items.map((item, index) => (
        <View key={index} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemIndex}>#{index + 1}</Text>
            <View style={styles.itemActions}>
              <Pressable
                style={[styles.iconBtn, index === 0 && styles.iconBtnDisabled]}
                onPress={() => moveItem(index, 'up')}
                disabled={index === 0}
              >
                <MaterialIcons name="arrow-upward" size={16} color={index === 0 ? colors.outlineVariant : colors.neutralVariant} />
              </Pressable>
              <Pressable
                style={[styles.iconBtn, index === items.length - 1 && styles.iconBtnDisabled]}
                onPress={() => moveItem(index, 'down')}
                disabled={index === items.length - 1}
              >
                <MaterialIcons name="arrow-downward" size={16} color={index === items.length - 1 ? colors.outlineVariant : colors.neutralVariant} />
              </Pressable>
              <Pressable style={styles.iconBtnDanger} onPress={() => removeItem(index)}>
                <MaterialIcons name="delete-outline" size={16} color={colors.error} />
              </Pressable>
            </View>
          </View>
          <View style={styles.itemBody}>
            {renderItem(item, index, (updates) => updateItem(index, updates))}
          </View>
        </View>
      ))}

      {items.length < maxItems && (
        <Pressable style={styles.addBtn} onPress={addItem}>
          <MaterialIcons name="add" size={18} color={colors.primary} />
          <Text style={styles.addBtnText}>Add item</Text>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    label: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm + 1,
      color: colors.neutral,
    },
    count: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
    hint: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
      marginBottom: spacing.sm,
    },
    itemCard: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      marginBottom: spacing.sm,
      overflow: 'hidden',
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outlineVariant,
      backgroundColor: colors.surface,
    },
    itemIndex: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
    itemActions: {
      flexDirection: 'row',
      gap: 4,
    },
    iconBtn: {
      width: 28,
      height: 28,
      borderRadius: radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBtnDisabled: {
      opacity: 0.4,
    },
    iconBtnDanger: {
      width: 28,
      height: 28,
      borderRadius: radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemBody: {
      padding: spacing.md,
    },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: spacing.sm + 2,
      borderWidth: 1,
      borderColor: colors.primary,
      borderStyle: 'dashed',
      borderRadius: radii.sm,
      marginTop: spacing.xs,
    },
    addBtnText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm + 1,
      color: colors.primary,
    },
  });
