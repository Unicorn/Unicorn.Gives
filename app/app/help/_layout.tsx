import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { paths } from '@/lib/navigation';

export default function HelpLayout() {
  const pathname = usePathname();
  const isDetail = pathname !== paths.help.index;

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Get Help" showBack={isDetail} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
