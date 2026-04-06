import { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

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
      lineHeight: 40,
    },
    twoCol: {
      flexDirection: 'row',
      gap: spacing.xxxl,
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
    textCol: {
      flex: 1,
      minWidth: 280,
    },
    image: {
      width: 400,
      height: 320,
      borderRadius: radii.lg,
    },
  });
