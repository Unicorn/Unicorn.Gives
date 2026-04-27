import { Pressable } from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import type { ReactNode } from 'react';
import { ContentCoverImage } from '@/components/ContentCoverImage';
import { EventRowLayout, type EventRowBadge } from '@/components/events/EventRowLayout';
import { Card } from '@/components/ui/Card';

export type { EventRowBadge };

interface EditorialCardProps {
  title: string;
  description?: string;
  badge?: EventRowBadge;
  href: Href;
  meta?: string;
  dateBox?: { month: string; day: number };
  footer?: ReactNode;
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
  return (
    <Link href={href} asChild>
      <Pressable>
        <Card hoverable>
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
        </Card>
      </Pressable>
    </Link>
  );
}
