import { useMemo, useState } from 'react';
import { View, Text, Image, Pressable, Modal, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

interface GalleryItem {
  url: string;
  caption?: string;
}

interface GallerySectionProps {
  images: GalleryItem[];
}

export function GallerySection({ images }: GallerySectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [selected, setSelected] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Gallery</Text>
        <View style={styles.grid}>
          {images.map((img, i) => (
            <Pressable key={i} style={styles.thumb} onPress={() => setSelected(i)}>
              <Image source={{ uri: img.url }} style={styles.thumbImage} resizeMode="cover" />
              {img.caption && <Text style={styles.caption} numberOfLines={1}>{img.caption}</Text>}
            </Pressable>
          ))}
        </View>
      </View>

      {/* Lightbox modal */}
      <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.lightbox} onPress={() => setSelected(null)}>
          {selected !== null && (
            <View style={styles.lightboxInner}>
              <Image source={{ uri: images[selected].url }} style={styles.lightboxImage} resizeMode="contain" />
              {images[selected].caption && (
                <Text style={styles.lightboxCaption}>{images[selected].caption}</Text>
              )}
              <Pressable style={styles.closeBtn} onPress={() => setSelected(null)}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </Pressable>
            </View>
          )}
        </Pressable>
      </Modal>
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
    heading: {
      fontFamily: fonts.sansBold,
      fontSize: 28,
      color: colors.neutral,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      justifyContent: 'center',
    },
    thumb: {
      width: 200,
      borderRadius: radii.sm,
      overflow: 'hidden',
      backgroundColor: colors.surfaceContainer,
    },
    thumbImage: {
      width: 200,
      height: 150,
    },
    caption: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
      padding: spacing.xs + 2,
    },
    lightbox: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.85)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    lightboxInner: {
      alignItems: 'center',
      maxWidth: '90%' as any,
      maxHeight: '90%' as any,
    },
    lightboxImage: {
      width: 800,
      height: 600,
      maxWidth: '100%' as any,
    },
    lightboxCaption: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: '#fff',
      marginTop: spacing.md,
      textAlign: 'center',
    },
    closeBtn: {
      position: 'absolute',
      top: -40,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
