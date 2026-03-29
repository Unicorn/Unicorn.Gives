import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserProfileSection } from '@/components/user/UserProfileSection';
import { useTheme, fonts, fontSize, spacing, type ThemeColors } from '@/constants/theme';

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const scrollStyle = useMemo(
    () => StyleSheet.flatten([styles.scroll, { backgroundColor: colors.background }]),
    [styles.scroll, colors.background],
  );
  const contentContainerStyle = useMemo(
    () => StyleSheet.flatten([styles.content, { paddingBottom: insets.bottom + spacing.xl }]),
    [styles.content, insets.bottom],
  );

  return (
    <ScrollView
      style={scrollStyle}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.pageTitle}>Profile</Text>
      <Text style={styles.subtitle}>Update how you appear in the app.</Text>
      <UserProfileSection showSectionTitle={false} />
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: {
      padding: spacing.xl,
      gap: spacing.md,
      maxWidth: 560,
      alignSelf: 'center',
      width: '100%',
    },
    pageTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize['4xl'],
      color: colors.neutral,
    },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      lineHeight: 20,
      marginBottom: spacing.sm,
    },
  });
