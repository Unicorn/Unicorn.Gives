import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserSettingsSection } from '@/components/user/UserSettingsSection';
import { useTheme, fonts, spacing } from '@/constants/theme';

export default function UserSettingsScreen() {
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
    <ScrollView style={scrollStyle} contentContainerStyle={contentContainerStyle}>
      <Text style={styles.pageTitle}>Settings</Text>
      <Text style={styles.subtitle}>Appearance and notification preferences.</Text>
      <UserSettingsSection showSectionTitle={false} />
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
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
      fontSize: 28,
      color: colors.neutral,
    },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
      lineHeight: 20,
      marginBottom: spacing.sm,
    },
  });
