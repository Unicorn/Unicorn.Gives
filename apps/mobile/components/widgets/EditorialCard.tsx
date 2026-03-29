import { StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import type { ReactNode } from 'react';
import { ContentCoverImage } from '@/components/ContentCoverImage';
import { EventRowLayout, type EventRowBadge } from '@/components/events/EventRowLayout';
import { useTheme, radii, shadows } from '@/constants/theme';

export type { EventRowBadge };

interface EditorialCardProps {
  title: string;
  description?: string;
  badge?: EventRowBadge;
  href: Href;
  meta?: string;
  dateBox?: { month: string; day: number };
  footer?: ReactNode;
  /** Raw `image_url` from API; shown as top thumbnail strip when resolvable */
  thumbnailUrl?: string | null;
}

export function EditorialCard({
  title,
  description,
  badge,
  href,
  meta,
  dateBox,
  footer,
  thumbnailUrl,
}: EditorialCardProps) {
  const { colors } = useTheme();

  return (
    <Link href={href} asChild>
      <Pressable style={StyleSheet.flatten([styles.card, { backgroundColor: colors.surface }])}>
        <ContentCoverImage
          imageUrl={thumbnailUrl}
          variant="card"
          accessibilityLabel={title}
        />
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
