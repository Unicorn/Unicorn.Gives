import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { homeColors, homeFonts, homeRadii } from '@/constants/homeTheme';

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

const SCHEME_STYLES: Record<
  NonNullable<BentoItem['colorScheme']>,
  { bg: string; text: string; desc: string; icon: string }
> = {
  primary: {
    bg: homeColors.primaryContainer,
    text: homeColors.onPrimary,
    desc: 'rgba(255,255,255,0.8)',
    icon: homeColors.onPrimary,
  },
  secondary: {
    bg: homeColors.secondaryContainer,
    text: homeColors.onSecondaryContainer,
    desc: 'rgba(255,251,255,0.8)',
    icon: homeColors.onSecondaryContainer,
  },
  tertiary: {
    bg: '#c3ab2e',
    text: '#211b00',
    desc: '#4a3f00',
    icon: '#211b00',
  },
  surface: {
    bg: homeColors.surfaceContainerHigh,
    text: homeColors.onSurface,
    desc: homeColors.onSurfaceVariant,
    icon: homeColors.primary,
  },
  muted: {
    bg: homeColors.surfaceContainer,
    text: homeColors.onSurface,
    desc: homeColors.onSurfaceVariant,
    icon: homeColors.secondary,
  },
};

function BentoCard({ item, isTablet }: { item: BentoItem; isTablet: boolean }) {
  const scheme = SCHEME_STYLES[item.colorScheme || 'surface'];
  const isFullWidth = item.span === 'full';

  const card = (
    <View
      style={[
        styles.card,
        { backgroundColor: scheme.bg },
        isTablet && !isFullWidth && styles.cardHalf,
        isTablet && isFullWidth && styles.cardFull,
      ]}
    >
      <Text style={[styles.icon, { color: scheme.icon }]}>{item.icon}</Text>
      <Text style={[styles.cardTitle, { color: scheme.text }]}>{item.title}</Text>
      <Text style={[styles.cardDesc, { color: scheme.desc }]}>{item.description}</Text>
    </View>
  );

  if (item.href) {
    return (
      <Link href={item.href} asChild>
        <TouchableOpacity
          style={[
            isTablet && !isFullWidth && styles.cardHalfWrapper,
            isTablet && isFullWidth && styles.cardFullWrapper,
          ]}
        >
          {card}
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <View
      style={[
        isTablet && !isFullWidth && styles.cardHalfWrapper,
        isTablet && isFullWidth && styles.cardFullWrapper,
      ]}
    >
      {card}
    </View>
  );
}

export function BentoGrid({ eyebrow, title, subtitle, items }: BentoGridProps) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
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
    fontFamily: homeFonts.sansBold,
    fontSize: 11,
    color: homeColors.secondary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: homeFonts.serifItalic,
    fontSize: 28,
    color: homeColors.primary,
  },
  subtitle: {
    fontFamily: homeFonts.sans,
    fontSize: 15,
    color: homeColors.onSurfaceVariant,
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
    borderRadius: homeRadii.md,
    gap: 6,
  },
  icon: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: homeFonts.sansBold,
    fontSize: 17,
  },
  cardDesc: {
    fontFamily: homeFonts.sans,
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
