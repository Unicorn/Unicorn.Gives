import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Href } from 'expo-router';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { routes } from '@/lib/navigation';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export default function UserIndexScreen() {
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

  const rows: { label: string; description: string; href: Href; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    {
      label: 'Profile',
      description: 'Name, email, and avatar',
      href: routes.user.profile(),
      icon: 'person',
    },
    {
      label: 'Settings',
      description: 'Appearance and notifications',
      href: routes.user.settings(),
      icon: 'settings',
    },
  ];

  return (
    <ScrollView style={scrollStyle} contentContainerStyle={contentContainerStyle}>
      <Text style={styles.pageTitle}>Account</Text>
      <Text style={styles.subtitle}>Manage your profile and app preferences.</Text>

      <View style={styles.list}>
        {rows.map((row) => (
          <Link key={row.label} href={row.href} asChild>
            <AnimatedPressable
              variant="subtle"
              style={StyleSheet.flatten([
                styles.row,
                { borderColor: colors.outline, backgroundColor: colors.surface },
              ])}
            >
              <View
                style={StyleSheet.flatten([
                  styles.iconWrap,
                  { backgroundColor: colors.outlineVariant },
                ])}
              >
                <MaterialIcons name={row.icon} size={22} color={colors.neutral} />
              </View>
              <View style={styles.rowText}>
                <Text style={StyleSheet.flatten([styles.rowLabel, { color: colors.neutral }])}>
                  {row.label}
                </Text>
                <Text style={StyleSheet.flatten([styles.rowDesc, { color: colors.neutralVariant }])}>
                  {row.description}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.neutralVariant} />
            </AnimatedPressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: {
      padding: spacing.xl,
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
      marginTop: spacing.sm,
      marginBottom: spacing.xl,
    },
    list: { gap: spacing.md },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii.md,
      borderWidth: 1,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowText: { flex: 1, gap: 2 },
    rowLabel: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
    },
    rowDesc: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm + 1,
    },
  });
