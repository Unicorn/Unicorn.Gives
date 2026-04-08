import type { EventItem } from '@/components/events/eventTypes';
import { routes } from '@/lib/navigation';
import { FeaturedContentCard } from './FeaturedContentCard';

interface FeaturedEventCardProps {
  event: EventItem & { description?: string | null; location?: string | null };
}

/**
 * Thin wrapper around FeaturedContentCard for events. Kept for backwards
 * compatibility with existing callers.
 */
export function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  return (
    <FeaturedContentCard
      href={routes.community.events.detail(event.slug)}
      title={event.title}
      description={event.description}
      date={event.date}
      time={event.time}
      location={event.location}
      category={event.category}
      imageUrl={event.image_url}
      ctaLabel="View details"
    />
  );
}
