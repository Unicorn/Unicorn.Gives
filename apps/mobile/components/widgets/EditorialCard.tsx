import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { homeColors, homeFonts, homeRadii } from '@/constants/homeTheme';

interface Badge {
  label: string;
  bg: string;
  text: string;
}

interface EditorialCardProps {
  title: string;
  description?: string;
  badge?: Badge;
  href: Href;
  meta?: string;
  dateBox?: { month: string; day: number };
}

export function EditorialCard({
  title,
  description,
  badge,
  href,
  meta,
  dateBox,
}: EditorialCardProps) {
  return (
    <Link href={href} asChild>
      <Pressable style={styles.card}>
        <View style={styles.body}>
          <View style={styles.topRow}>
            {badge && (
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
              </View>
            )}
            {dateBox && (
              <View style={styles.dateBox}>
                <Text style={styles.dateMonth}>{dateBox.month}</Text>
                <Text style={styles.dateDay}>{dateBox.day}</Text>
              </View>
            )}
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}
          {meta && <Text style={styles.meta}>{meta}</Text>}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.md,
    borderWidth: 1,
    borderColor: homeColors.outline,
    overflow: 'hidden',
  },
  body: {
    padding: 16,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: homeRadii.pill,
  },
  badgeText: {
    fontFamily: homeFonts.sansBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dateBox: {
    backgroundColor: homeColors.heroBar,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 44,
  },
  dateMonth: {
    fontFamily: homeFonts.sansBold,
    fontSize: 9,
    color: homeColors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontFamily: homeFonts.sansBold,
    fontSize: 18,
    color: homeColors.onPrimary,
  },
  title: {
    fontFamily: homeFonts.sansBold,
    fontSize: 16,
    color: homeColors.onSurface,
    lineHeight: 22,
  },
  description: {
    fontFamily: homeFonts.sans,
    fontSize: 13,
    color: homeColors.onSurfaceVariant,
    lineHeight: 19,
  },
  meta: {
    fontFamily: homeFonts.sans,
    fontSize: 12,
    color: homeColors.muted,
    marginTop: 2,
  },
});
