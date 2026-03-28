import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';

export default function CommunityNewsLayout() {
  const pathname = usePathname();
  const isDetail = pathname.startsWith('/community/news/');

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBack={isDetail} />
      <ContentContainer style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </ContentContainer>
    </View>
  );
}
