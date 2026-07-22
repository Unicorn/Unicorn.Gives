import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { RequireModule } from '@/lib/routeGuards';
import { useTheme } from '@/constants/theme';

export default function GovernmentTabLayout() {
  const pathname = usePathname();
  const { colors } = useTheme();
  const isDeep = pathname !== '/government' && pathname.startsWith('/government/');

  return (
    <RequireModule module="municipal">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppHeader showBack={isDeep} />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </RequireModule>
  );
}
