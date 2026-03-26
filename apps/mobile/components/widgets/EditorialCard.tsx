import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { useTheme, fonts, radii, shadows } from '@/constants/theme';

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
  const { colors } = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable style={StyleSheet.flatten([styles.card, { backgroundColor: colors.surface }])}>
        <View style={styles.body}>
          <View style={styles.topRow}>
            {badge && (
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
              </View>
            )}
            {dateBox && (
              <View style={[styles.dateBox, { borderColor: colors.neutral }]}>
                <Text style={[styles.dateMonth, { color: colors.neutralVariant }]}>{dateBox.month}</Text>
                <Text style={[styles.dateDay, { color: colors.neutral }]}>{dateBox.day}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.title, { color: colors.neutral }]} numberOfLines={2}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.description, { color: colors.neutralVariant }]} numberOfLines={2}>
              {description}
            </Text>
          )}
          {meta && <Text style={[styles.meta, { color: colors.neutralVariant }]}>{meta}</Text>}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    overflow: 'hidden',
    ...shadows.card,
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
    borderRadius: radii.pill,
  },
  badgeText: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dateBox: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 44,
  },
  dateMonth: {
    fontFamily: fonts.sansBold,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontFamily: fonts.sansBold,
    fontSize: 18,
  },
  title: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    lineHeight: 22,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 12,
    marginTop: 2,
  },
});
