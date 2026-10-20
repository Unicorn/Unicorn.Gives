import { useMemo } from 'react';
import { Link } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

import { SeoHead } from '@/components/SeoHead';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { routes } from '@/lib/navigation';
import { toHref } from '@/lib/navigation/paths';
import { useFeatureModules } from '@/lib/featureModules';
import { isPublicPathEnabled } from '@/constants/featureModules';
import {
  useTheme,
  fonts,
  fontSize,
  spacing,
  radii,
  letterSpacing,
  type ThemeColors,
} from '@/constants/theme';

const DESTINATIONS = [
  { label: 'Home', href: routes.home() },
  { label: 'Guides', href: toHref('/guides') },
  { label: 'Government', href: toHref('/government') },
] as const;

export default function NotFoundScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  // Don't suggest a section that's switched off (#129).
  const { flags } = useFeatureModules();
  const destinations = DESTINATIONS.filter((d) => isPublicPathEnabled(d.href as string, flags));

  return (
    <Wrapper>
      <SeoHead title="Page Not Found" noIndex />
      <Container>
        <View style={styles.block}>
          <Text style={styles.eyebrow}>404</Text>
          <Text role="heading" aria-level={1} style={styles.title}>
            We can't find that page.
          </Text>
          <Text style={styles.body}>
            The link may be out of date, or the page may have moved. Try one of these instead.
          </Text>
          <View style={styles.actions}>
            {destinations.map((d, i) => (
              <Link key={d.label} href={d.href} style={[styles.button, i === 0 && styles.buttonPrimary]}>
                <Text style={[styles.buttonText, i === 0 && styles.buttonTextPrimary]}>{d.label}</Text>
              </Link>
            ))}
          </View>
        </View>
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    block: {
      paddingVertical: spacing.xxxl * 2,
      maxWidth: 560,
    },
    eyebrow: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.sm,
      letterSpacing: 1.5,
      color: colors.neutralVariant,
      marginBottom: spacing.md,
    },
    title: {
      fontFamily: fonts.serifBold,
      fontSize: 38,
      lineHeight: 44,
      letterSpacing: letterSpacing.display,
      color: colors.neutral,
    },
    body: {
      fontFamily: fonts.sans,
      fontSize: fontSize.lg,
      lineHeight: 26,
      color: colors.neutralVariant,
      marginTop: spacing.lg,
    },
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      marginTop: spacing.xxl,
    },
    button: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    buttonPrimary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    buttonText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    buttonTextPrimary: {
      color: colors.onPrimary,
    },
  });
