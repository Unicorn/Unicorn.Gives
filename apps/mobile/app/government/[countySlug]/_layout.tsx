import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTheme } from '@/constants/theme';
import { isMunicipalDetailPath } from '@/lib/navigation';
import { fetchCountySlugParams } from '@/lib/static-build-queries';

/**
 * A dynamic segment that owns a layout needs its params here too — the layout
 * is part of the route, so without this the static export emits a single
 * `[countySlug]` shell instead of a page per county.
 */
export async function generateStaticParams() {
  return fetchCountySlugParams();
}

export default function CountySlugLayout() {
  const { colors } = useTheme();
  const pathname = usePathname();
  const showBack = isMunicipalDetailPath(pathname);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader showBack={showBack} />
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}
