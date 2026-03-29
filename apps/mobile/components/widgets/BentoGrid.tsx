import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, radii, shadows, spacing } from '@/constants/theme';

export interface BentoItem {
  key: string;
  title: string;
  description: string;
  icon: string;
  href?: Href;
  span?: 'full' | 'half';
  colorScheme?: 'primary' | 'secondary' | 'tertiary' | 'surface' | 'muted';
}

interface BentoGridProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: BentoItem[];
}

function useSchemeStyles() {
  const { colors } = useTheme();
  const base = {
    bg: colors.surface,
    text: colors.neutral,
    desc: colors.neutralVariant,
    icon: colors.primary,
  };
  return {
    primary: base,
    secondary: base,
    tertiary: base,
    surface: base,
    muted: { ...base, bg: colors.surfaceContainer },
  } as const;
}

/** Tablet/desktop: group items into rows (full = solo row; half = pairs). */
function chunkItemsIntoRows(items: BentoItem[]): BentoItem[][] {
  const rows: BentoItem[][] = [];
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (item.span === 'full') {
      rows.push([item]);
      i += 1;
    } else {
      const next = items[i + 1];
      if (next && next.span !== 'full') {
        rows.push([item, next]);
        i += 2;
      } else {
        rows.push([item]);
        i += 1;
      }
    }
  }
  return rows;
}

function BentoCell({
  item,
  layout,
}: {
  item: BentoItem;
  layout: 'stack' | 'rowHalf' | 'rowFull';
}) {
  const schemes = useSchemeStyles();
  const scheme = schemes[item.colorScheme || 'surface'];

  const card = (
    <View
      style={[
        styles.card,
        { backgroundColor: scheme.bg },
        shadows.cardElevated,
        layout === 'rowHalf' && styles.cardRowHalf,
      ]}
    >
      <MaterialIcons
        // biome-ignore lint/suspicious/noExplicitAny: icon string from bento item data
        name={item.icon as any}
        size={28}
        color={scheme.icon}
        style={styles.icon}
      />
      <Text style={[styles.cardTitle, { color: scheme.text }]}>{item.title}</Text>
      <Text style={[styles.cardDesc, { color: scheme.desc }]}>{item.description}</Text>
    </View>
  );

  const linkWrapperStyle =
    layout === 'rowHalf'
      ? styles.cellRowHalf
      : styles.cellFullWidth;

  if (item.href) {
    return (
      <Link href={item.href} style={linkWrapperStyle}>
        {card}
      </Link>
    );
  }

  return <View style={linkWrapperStyle}>{card}</View>;
}

export function BentoGrid({ eyebrow, title, subtitle, items }: BentoGridProps) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isTablet = width >= 768;
  const rows = chunkItemsIntoRows(items);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {eyebrow && <Text style={[styles.eyebrow, { color: colors.neutralVariant }]}>{eyebrow}</Text>}
        <Text style={[styles.title, { color: colors.neutral }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.neutralVariant }]}>{subtitle}</Text>}
      </View>
      <View style={styles.grid}>
        {isTablet
          ? rows.map((row) => (
              <View key={row.map((c) => c.key).join('-')} style={styles.tabletRow}>
                {row.map((item) => (
                  <BentoCell
                    key={item.key}
                    item={item}
                    layout={row.length === 2 ? 'rowHalf' : 'rowFull'}
                  />
                ))}
              </View>
            ))
          : items.map((item) => <BentoCell key={item.key} item={item} layout="stack" />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.serifItalic,
    fontSize: 28,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  grid: {
    gap: spacing.md,
  },
  tabletRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
    alignItems: 'stretch',
  },
  cellFullWidth: {
    width: '100%',
    flexGrow: 1,
    flexShrink: 0,
  },
  cellRowHalf: {
    flex: 1,
    minWidth: 0,
  },
  card: {
    padding: spacing.xl,
    borderRadius: radii.md,
    gap: spacing.sm,
    minHeight: 120,
  },
  cardRowHalf: {
    flex: 1,
  },
  icon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  cardTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 17,
  },
  cardDesc: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
});
