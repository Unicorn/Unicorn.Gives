import { useMemo } from 'react';
import { Link, Stack } from 'expo-router';
import { routes } from '@/lib/navigation';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

export default function NotFoundScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>

        <Link href={routes.home()} style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xl + 2,
    color: colors.neutral,
  },
  link: {
    marginTop: spacing.lg,
    paddingVertical: spacing.lg,
  },
  linkText: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
    color: colors.primary,
  },
});
