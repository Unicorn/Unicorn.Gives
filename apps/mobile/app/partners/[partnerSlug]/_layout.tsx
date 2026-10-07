import { Stack } from 'expo-router';
import { fetchPartnerSlugParams } from '@/lib/static-build-queries';

/**
 * A dynamic segment that owns a layout needs its params here too — the layout
 * is part of the route, so without this the static export cannot render the
 * segment and falls back to emitting a single `[partnerSlug]` shell.
 */
export async function generateStaticParams() {
  const fromDb = await fetchPartnerSlugParams();
  if (fromDb.length > 0) return fromDb;
  const { getPartnerStaticLandingParams } = await import('@/lib/partner-static-from-seed');
  return getPartnerStaticLandingParams();
}

export default function PartnerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[tab]" />
    </Stack>
  );
}
