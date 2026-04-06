import { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, fontSize, spacing, type ThemeColors } from '@/constants/theme';

interface AboutSectionProps {
  title?: string | null;
  body?: string | null;
  imageUrl?: string | null;
}

export function AboutSection({ title, body, imageUrl }: AboutSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!title && !body) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {imageUrl ? (
          <View style={styles.twoCol}>
            <View style={styles.textCol}>
              {title && <Text style={styles.title}>{title}</Text>}
              {body && <MarkdownRenderer content={body} />}
            </View>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
          </View>
        ) : (
          <>
            {title && <Text style={styles.title}>{title}</Text>}
            {body && <MarkdownRenderer content={body} />}
          </>
        )}
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
    twoCol: {
      flexDirection: 'row',
      gap: spacing.xl,
      flexWrap: 'wrap',
    },
    textCol: {
      flex: 1,
      minWidth: 280,
    },
    image: {
      width: 360,
      height: 280,
      borderRadius: 12,
    },
  });
