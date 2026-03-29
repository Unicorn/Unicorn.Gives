import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTheme } from '@/constants/theme';
import { isMunicipalDetailPath } from '@/lib/navigation';

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
