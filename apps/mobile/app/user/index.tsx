import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Href } from 'expo-router';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { routes } from '@/lib/navigation';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export default function UserIndexScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.pageTitle}>Your account</Text>
      <Text style={styles.subtitle}>Manage your profile and app preferences.</Text>

      <View style={styles.list}>
        {rows.map((row) => (
          <Link key={row.label} href={row.href} asChild>
            <AnimatedPressable variant="subtle" style={[styles.row, { borderColor: colors.outline, backgroundColor: colors.surface }]}>
              <View style={[styles.iconWrap, { backgroundColor: colors.outlineVariant }]}>
                <MaterialIcons name={row.icon} size={22} color={colors.neutral} />
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: colors.neutral }]}>{row.label}</Text>
                <Text style={[styles.rowDesc, { color: colors.neutralVariant }]}>{row.description}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.neutralVariant} />
            </AnimatedPressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
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
      fontSize: 28,
      color: colors.neutral,
    },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: 14,
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
      fontSize: 16,
    },
    rowDesc: {
      fontFamily: fonts.sans,
      fontSize: 13,
    },
  });
