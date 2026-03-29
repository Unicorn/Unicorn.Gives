import { StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import type { ReactNode } from 'react';
import { useTheme, radii, shadows } from '@/constants/theme';
import { EventRowLayout, type EventRowBadge } from '@/components/events/EventRowLayout';

export type { EventRowBadge };

interface EditorialCardProps {
  title: string;
  description?: string;
  badge?: EventRowBadge;
  href: Href;
  meta?: string;
  dateBox?: { month: string; day: number };
  footer?: ReactNode;
}

export function EditorialCard({
  title,
  description,
  badge,
  href,
  meta,
  dateBox,
  footer,
}: EditorialCardProps) {
  const { colors } = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable style={StyleSheet.flatten([styles.card, { backgroundColor: colors.surface }])}>
        <EventRowLayout
          variant="default"
          title={title}
          description={description}
          meta={meta}
          badge={badge}
          dateBox={dateBox}
          footer={footer}
        />
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
});
