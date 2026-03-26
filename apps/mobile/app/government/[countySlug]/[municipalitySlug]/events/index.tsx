import { useRegion } from '@/lib/hooks/useRegion';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { EventsList } from '@/components/events/EventsList';
import { View, Text } from 'react-native';
import { useTheme, spacing } from '@/constants/theme';

export default function MunicipalEventsIndex() {
  const { colors } = useTheme();
  const { municipalitySlug } = useMunicipalRoute();
  const { region, isLoading } = useRegion(municipalitySlug);

  if (isLoading) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' }}>Loading...</Text></View>;
  if (!region) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' }}>Region not found</Text></View>;

  return <EventsList regionId={region.id} />;
}
