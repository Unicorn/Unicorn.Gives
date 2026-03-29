import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  type ViewStyle,
} from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, radii, shadows } from '@/constants/theme';

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

function useSchemStyles() {
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

function BentoCard({ item, isTablet }: { item: BentoItem; isTablet: boolean }) {
  const schemes = useSchemStyles();
  const scheme = schemes[item.colorScheme || 'surface'];
  const isFullWidth = item.span === 'full';

  const card = (
    <View
      style={[
        styles.card,
        { backgroundColor: scheme.bg },
        shadows.cardElevated,
        isTablet && !isFullWidth && styles.cardHalf,
        isTablet && isFullWidth && styles.cardFull,
      ]}
    >
      <MaterialIcons name={item.icon as any} size={28} color={scheme.icon} style={styles.icon} />
      <Text style={[styles.cardTitle, { color: scheme.text }]}>{item.title}</Text>
      <Text style={[styles.cardDesc, { color: scheme.desc }]}>{item.description}</Text>
    </View>
  );

  const wrapperStyle = StyleSheet.flatten([
    isTablet && !isFullWidth ? styles.cardHalfWrapper : undefined,
    isTablet && isFullWidth ? styles.cardFullWrapper : undefined,
  ]) as ViewStyle;

  if (item.href) {
    return (
      <View style={wrapperStyle}>
        <Link href={item.href} style={{ textDecorationLine: 'none' }}>
          {card}
        </Link>
      </View>
    );
  }

  return (
    <View style={wrapperStyle}>
      {card}
    </View>
  );
}

export function BentoGrid({ eyebrow, title, subtitle, items }: BentoGridProps) {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isTablet = width >= 768;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {eyebrow && <Text style={[styles.eyebrow, { color: colors.neutralVariant }]}>{eyebrow}</Text>}
        <Text style={[styles.title, { color: colors.neutral }]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.neutralVariant }]}>{subtitle}</Text>}
      </View>
      <View style={[styles.grid, isTablet && styles.gridTablet]}>
        {items.map((item) => (
          <BentoCard key={item.key} item={item} isTablet={isTablet} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    gap: 4,
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
    gap: 10,
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    padding: 20,
    borderRadius: radii.md,
    gap: 6,
  },
  icon: {
    fontSize: 28,
    marginBottom: 4,
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
  cardHalfWrapper: {
    width: '48.5%',
  },
  cardFullWrapper: {
    width: '100%',
  },
  cardHalf: {
    flex: 1,
  },
  cardFull: {
    flex: 1,
  },
});
