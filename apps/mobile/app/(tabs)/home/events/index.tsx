import { EventsList } from '@/components/events/EventsList';
import { SeoHead } from '@/components/SeoHead';

export default function EventsTab() {
  return (
    <>
      <SeoHead title="Events" />
      <EventsList />
    </>
  );
}
