import { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, spacing, type ThemeColors } from '@/constants/theme';

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
      paddingVertical: spacing.xxl,
    },
    inner: {
      maxWidth: 900,
      alignSelf: 'center',
      width: '100%' as any,
    },
    title: {
      fontFamily: fonts.sansBold,
      fontSize: 28,
      color: colors.neutral,
      marginBottom: spacing.lg,
    },
    image: {
      width: '100%' as any,
      height: 300,
      borderRadius: 12,
      marginBottom: spacing.lg,
    },
  });
