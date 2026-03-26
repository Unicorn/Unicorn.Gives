import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { paths } from '@/lib/navigation';

export default function HistoryLayout() {
  const pathname = usePathname();
  const isDetail =
    pathname !== paths.history.index && pathname.startsWith(`${paths.history.index}/`);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBack={isDetail} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
