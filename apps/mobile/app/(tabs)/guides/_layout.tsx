import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { useTheme } from '@/constants/theme';

export default function GuidesLayout() {
  const pathname = usePathname();
  const { colors } = useTheme();
  const isDetail = pathname !== '/guides' && pathname.startsWith('/guides/');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader showBack={isDetail} />
      <ContentContainer flush style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </ContentContainer>
    </View>
  );
}
