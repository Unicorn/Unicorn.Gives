import { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';

interface CustomSectionProps {
  title?: string;
  body?: string;
  imageUrl?: string;
}

export function CustomSection({ title, body, imageUrl }: CustomSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!title && !body) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {title && <Text style={styles.title}>{title}</Text>}
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        )}
        {body && <MarkdownRenderer content={body} />}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxxl + 16,
    },
    inner: {
      maxWidth: 1000,
      alignSelf: 'center',
      width: '100%' as any,
    },
    title: {
      fontFamily: fonts.sansBold,
      fontSize: 32,
      color: colors.neutral,
      marginBottom: spacing.xl,
    },
    image: {
      width: '100%' as any,
      height: 300,
      borderRadius: radii.lg,
      marginBottom: spacing.xl,
    },
  });
