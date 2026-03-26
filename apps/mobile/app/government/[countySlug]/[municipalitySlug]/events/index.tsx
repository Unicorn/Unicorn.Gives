import { useRegion } from '@/lib/hooks/useRegion';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { EventsList } from '@/components/events/EventsList';
import { View, Text } from 'react-native';

export default function MunicipalEventsIndex() {
  const { municipalitySlug } = useMunicipalRoute();
  const { region, isLoading } = useRegion(municipalitySlug);

  if (isLoading) return <View style={{ flex: 1, backgroundColor: '#fcf9f4' }}><Text style={{ padding: 24, color: '#73796d', textAlign: 'center' }}>Loading...</Text></View>;
  if (!region) return <View style={{ flex: 1, backgroundColor: '#fcf9f4' }}><Text style={{ padding: 24, color: '#73796d', textAlign: 'center' }}>Region not found</Text></View>;

  return <EventsList regionId={region.id} />;
}
