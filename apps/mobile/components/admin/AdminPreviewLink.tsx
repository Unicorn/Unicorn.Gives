/**
 * "Preview on site" button for admin edit pages.
 * Opens the public-facing URL in a new tab (web) or navigates to it.
 */
import { useMemo } from 'react';
import { Pressable, Text, Linking, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';

interface AdminPreviewLinkProps {
  href: string | null;
}

export function AdminPreviewLink({ href }: AdminPreviewLinkProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!href) return null;

  function handlePress() {
    if (!href) return;
    if (Platform.OS === 'web') {
      window.open(href, '_blank');
    } else {
      void Linking.openURL(href);
    }
  }

  return (
    <Pressable style={styles.btn} onPress={handlePress}>
      <MaterialIcons name="open-in-new" size={14} color={colors.primary} />
      <Text style={styles.text}>Preview</Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.surfaceContainer,
    },
    text: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      color: colors.primary,
    },
  });
