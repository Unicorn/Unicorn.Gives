import { View, Text, StyleSheet, Pressable, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import type { ResourceAttachment } from '@/lib/municipal/resourcePages';

interface ResourcePageContentProps {
  title: string;
  description: string | null;
  body: string;
  attachments: ResourceAttachment[];
}

function iconForMimeType(mime: string): keyof typeof MaterialIcons.glyphMap {
  if (mime === 'application/pdf') return 'picture-as-pdf';
  if (mime.startsWith('image/')) return 'image';
  return 'insert-drive-file';
}

function handleDownload(url: string) {
  if (Platform.OS === 'web') {
    window.open(url, '_blank');
  } else {
    Linking.openURL(url);
  }
}

export function ResourcePageContent({
  title,
  description,
  body,
  attachments,
}: ResourcePageContentProps) {
  const { colors } = useTheme();

  return (
    <Wrapper
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Container>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: colors.neutralVariant }]}>
            RESOURCES
          </Text>
          <Text style={[styles.title, { color: colors.neutral }]}>{title}</Text>
          {description ? (
            <Text style={[styles.description, { color: colors.neutralVariant }]}>
              {description}
            </Text>
          ) : null}
        </View>

        {/* Body content */}
        {body ? (
          <View style={styles.bodySection}>
            <MarkdownRenderer content={body} />
          </View>
        ) : null}

        {/* Attachments */}
        {attachments.length > 0 ? (
          <View style={styles.attachmentsSection}>
            <Text style={[styles.attachmentsTitle, { color: colors.neutral }]}>
              Downloads
            </Text>
            <View style={styles.attachmentsList}>
              {attachments.map((att, i) => (
                <Pressable
                  key={`${att.url}-${i}`}
                  style={[
                    styles.attachmentCard,
                    { backgroundColor: colors.surface },
                    shadows.cardElevated,
                  ]}
                  onPress={() => handleDownload(att.url)}
                >
                  <View
                    style={[
                      styles.attachmentIcon,
                      { backgroundColor: colors.primaryContainer },
                    ]}
                  >
                    <MaterialIcons
                      name={iconForMimeType(att.mime_type)}
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.attachmentText}>
                    <Text
                      style={[styles.attachmentLabel, { color: colors.neutral }]}
                      numberOfLines={2}
                    >
                      {att.label}
                    </Text>
                    {att.size_label ? (
                      <Text
                        style={[
                          styles.attachmentSize,
                          { color: colors.neutralVariant },
                        ]}
                      >
                        {att.size_label}
                      </Text>
                    ) : null}
                  </View>
                  <MaterialIcons
                    name="download"
                    size={20}
                    color={colors.primary}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 48 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: 4,
  },
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: fonts.serifItalic,
    fontSize: 28,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  bodySection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  attachmentsSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  attachmentsTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
  },
  attachmentsList: {
    gap: spacing.sm,
  },
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentText: {
    flex: 1,
    gap: 2,
  },
  attachmentLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
  attachmentSize: {
    fontFamily: fonts.sans,
    fontSize: 12,
  },
});
