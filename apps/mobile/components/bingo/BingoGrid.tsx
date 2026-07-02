import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import type { BingoCategory, BoardCell } from '@/lib/bingo/engine';

interface BingoGridProps {
  cells: BoardCell[];
  boardSize: number;
  marked: number[];
  categories?: BingoCategory[];
  onToggle?: (index: number) => void;
  readOnly?: boolean;
}

const GAP = spacing.xs + 2;

export function BingoGrid({
  cells,
  boardSize,
  marked,
  categories = [],
  onToggle,
  readOnly = false,
}: BingoGridProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [width, setWidth] = useState(0);

  const markedSet = useMemo(() => new Set(marked), [marked]);
  const colorFor = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of categories) if (c.color) map[c.key] = c.color;
    return map;
  }, [categories]);

  const cellSize = width > 0 ? (width - GAP * (boardSize - 1)) / boardSize : 0;
  const center = Math.floor((boardSize * boardSize) / 2);

  return (
    <View
      style={styles.grid}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {cells.map((cell, i) => {
        const isMarked = i === center || markedSet.has(i);
        const accent = cell.category ? colorFor[cell.category] : undefined;
        const Wrapper = readOnly || !onToggle ? View : Pressable;
        return (
          <Wrapper
            key={i}
            style={[
              styles.cell,
              cellSize > 0 && { width: cellSize, height: cellSize },
              isMarked && styles.cellMarked,
              cell.free && styles.cellFree,
            ]}
            onPress={readOnly || !onToggle ? undefined : () => onToggle(i)}
          >
            {accent && !isMarked ? <View style={[styles.accentBar, { backgroundColor: accent }]} /> : null}
            {cell.free ? (
              <MaterialIcons name="star" size={cellSize > 0 ? cellSize * 0.32 : 16} color={colors.onPrimary} />
            ) : null}
            <Text
              style={[styles.cellText, isMarked && styles.cellTextMarked, cell.free && styles.cellTextFree]}
              numberOfLines={4}
            >
              {cell.text}
            </Text>
            {isMarked && !cell.free ? (
              <MaterialIcons name="check-circle" size={16} color={colors.onPrimary} style={styles.checkIcon} />
            ) : null}
          </Wrapper>
        );
      })}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: GAP,
      width: '100%',
    },
    cell: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xs,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    cellMarked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    cellFree: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    accentBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 3,
    },
    cellText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm - 1,
      lineHeight: fontSize.sm + 2,
      color: colors.neutral,
      textAlign: 'center',
    },
    cellTextMarked: {
      color: colors.onPrimary,
    },
    cellTextFree: {
      color: colors.onPrimary,
      fontFamily: fonts.sansBold,
    },
    checkIcon: {
      position: 'absolute',
      bottom: 2,
      right: 2,
    },
  });
