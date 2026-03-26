import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';

export default function GuidesLayout() {
  const pathname = usePathname();
  const isDetail = pathname !== '/guides' && pathname.startsWith('/guides/');

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBack={isDetail} />
      <ContentContainer>
        <Stack screenOptions={{ headerShown: false }} />
      </ContentContainer>
    </View>
  );
}
