import { View, Text } from 'react-native';
import { useTheme, fonts, spacing } from '@/constants/theme';

export default function StubScreen({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl }}>
      <Text style={{ color: colors.neutralVariant, fontFamily: fonts.sans, fontSize: 16, textAlign: 'center' }}>{title}</Text>
    </View>
  );
}
