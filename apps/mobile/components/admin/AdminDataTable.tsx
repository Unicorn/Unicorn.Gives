import { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AdminStatusBadge } from './AdminStatusBadge';

/* ── Types ── */

export interface Column<T> {
  key: string;
  label: string;
  /** Width of the column (default: flex) */
  width?: number;
  /** Render custom cell content */
  render?: (row: T) => React.ReactNode;
  /** Show as status badge */
  isStatus?: boolean;
  /** Allow sorting by this column (key used for orderBy) */
  sortKey?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  /** Row click handler — receives the row */
  onRowPress?: (row: T) => void;
  /** Total record count for pagination */
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  /** Empty state message */
  emptyMessage?: string;
  /** Key extractor, defaults to 'id' */
  keyExtractor?: (row: T) => string;
  /** Current sort column key */
  sortKey?: string;
  /** Current sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Called when a sortable header is clicked */
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

export function AdminDataTable<T extends Record<string, any>>({
  columns,
  data,
  loading,
  error,
  onRowPress,
  total = 0,
  page = 1,
  pageSize = 25,
  onPageChange,
  emptyMessage = 'No records found',
  keyExtractor = (row) => String(row.id ?? row.slug ?? Math.random()),
  sortKey,
  sortDirection,
  onSort,
}: AdminDataTableProps<T>) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const totalPages = Math.ceil(total / pageSize);

  function handleHeaderPress(col: Column<T>) {
    if (!col.sortKey || !onSort) return;
    const nextDir =
      sortKey === col.sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(col.sortKey, nextDir);
  }

  if (loading) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.stateText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.stateContainer}>
        <MaterialIcons name="error-outline" size={24} color={colors.error} />
        <Text style={[styles.stateText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.stateContainer}>
        <MaterialIcons name="inbox" size={32} color={colors.outlineVariant} />
        <Text style={styles.stateText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.headerRow}>
            {columns.map((col) => {
              const isSortable = !!col.sortKey && !!onSort;
              const isActive = sortKey === col.sortKey;
              return (
                <Pressable
                  key={col.key}
                  style={[
                    styles.headerCell,
                    col.width ? { width: col.width } : styles.flexCell,
                    isSortable && styles.headerCellSortable,
                  ]}
                  onPress={() => isSortable && handleHeaderPress(col)}
                  disabled={!isSortable}
                >
                  <Text style={[styles.headerText, isActive && { color: colors.primary }]}>
                    {col.label}
                  </Text>
                  {isSortable && isActive && (
                    <MaterialIcons
                      name={sortDirection === 'asc' ? 'arrow-upward' : 'arrow-downward'}
                      size={12}
                      color={colors.primary}
                    />
                  )}
                  {isSortable && !isActive && (
                    <MaterialIcons name="unfold-more" size={12} color={colors.outlineVariant} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Rows */}
          {data.map((row) => (
            <Pressable
              key={keyExtractor(row)}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
                onRowPress && styles.rowClickable,
              ]}
              onPress={() => onRowPress?.(row)}
              disabled={!onRowPress}
            >
              {columns.map((col) => (
                <View
                  key={col.key}
                  style={[styles.cell, col.width ? { width: col.width } : styles.flexCell]}
                >
                  {col.isStatus ? (
                    <AdminStatusBadge status={String(row[col.key] ?? 'draft')} />
                  ) : col.render ? (
                    col.render(row)
                  ) : (
                    <Text style={styles.cellText} numberOfLines={1}>
                      {formatValue(row[col.key])}
                    </Text>
                  )}
                </View>
              ))}
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Pagination */}
      {totalPages > 1 && onPageChange && (
        <View style={styles.pagination}>
          <Text style={styles.paginationText}>
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </Text>
          <View style={styles.paginationBtns}>
            <Pressable
              style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
              onPress={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <MaterialIcons name="chevron-left" size={18} color={page <= 1 ? colors.outlineVariant : colors.neutral} />
            </Pressable>
            <Pressable
              style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
              onPress={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <MaterialIcons name="chevron-right" size={18} color={page >= totalPages ? colors.outlineVariant : colors.neutral} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return '—';
  if (val instanceof Date) return val.toLocaleDateString();
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (Array.isArray(val)) return val.join(', ');
  return String(val);
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      overflow: 'hidden',
    },
    table: {
      minWidth: 600,
      width: '100%' as any,
    },
    headerRow: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceContainer,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    headerCell: {
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    headerCellSortable: {
      cursor: 'pointer' as any,
    },
    headerText: {
      fontFamily: fonts.sansBold,
      fontSize: 11,
      color: colors.neutralVariant,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    flexCell: {
      flex: 1,
      minWidth: 100,
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    rowClickable: {
      cursor: 'pointer' as any,
    },
    rowPressed: {
      backgroundColor: colors.surfaceContainer,
    },
    cell: {
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      justifyContent: 'center',
    },
    cellText: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutral,
    },

    /* States */
    stateContainer: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      padding: spacing.xxxl,
      alignItems: 'center',
      gap: 8,
    },
    stateText: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
    },

    /* Pagination */
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.outlineVariant,
    },
    paginationText: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutralVariant,
    },
    paginationBtns: {
      flexDirection: 'row',
      gap: 4,
    },
    pageBtn: {
      width: 28,
      height: 28,
      borderRadius: radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceContainer,
    },
    pageBtnDisabled: {
      opacity: 0.5,
    },
  });
