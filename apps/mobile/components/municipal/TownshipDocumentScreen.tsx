import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';

interface Section {
  title: string;
  items: string[];
}

interface DocumentMeta {
  label: string;
  value: string;
  icon: string;
}

interface TownshipDocumentScreenProps {
  title: string;
  subtitle: string;
  adoptedDate: string;
  adoptedBy: string;
  description: string;
  pdfPath: string;
  pdfSizeMB: string;
  meta: DocumentMeta[];
  sections: Section[];
  tableOfContents?: string[];
}

export function TownshipDocumentScreen({
  title,
  subtitle,
  adoptedDate,
  adoptedBy,
  description,
  pdfPath,
  pdfSizeMB,
  meta,
  sections,
  tableOfContents,
}: TownshipDocumentScreenProps) {
  const { colors } = useTheme();

  const handleOpenPdf = () => {
    if (Platform.OS === 'web') {
      window.open(pdfPath, '_blank');
    } else {
      Linking.openURL(pdfPath);
    }
  };

  return (
    <Wrapper style={[styles.scroll, { backgroundColor: colors.background }]} contentContainerStyle={styles.scrollContent}>
      <Container>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.heroBar }]}>
          <Text style={[styles.headerEyebrow, { color: colors.gold }]}>{subtitle}</Text>
          <Text style={[styles.headerTitle, { color: colors.onHeroBar }]}>{title}</Text>
          <View style={styles.headerMeta}>
            <MaterialIcons name="event" size={14} color={colors.outline} />
            <Text style={[styles.headerMetaText, { color: colors.outline }]}>
              Adopted {adoptedDate} by {adoptedBy}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* PDF Download Card */}
          <TouchableOpacity
            onPress={handleOpenPdf}
            style={[styles.pdfCard, { backgroundColor: colors.primaryContainer, borderColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <View style={styles.pdfCardContent}>
              <MaterialIcons name="picture-as-pdf" size={32} color={colors.primary} />
              <View style={styles.pdfCardText}>
                <Text style={[styles.pdfCardTitle, { color: colors.primary }]}>
                  View Full Document (PDF)
                </Text>
                <Text style={[styles.pdfCardSize, { color: colors.neutralVariant }]}>
                  {pdfSizeMB} MB
                </Text>
              </View>
            </View>
            <MaterialIcons name="open-in-new" size={20} color={colors.primary} />
          </TouchableOpacity>

          {/* Description */}
          <Text style={[styles.description, { color: colors.neutral }]}>{description}</Text>

          {/* Quick Facts */}
          {meta.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.neutral }]}>Quick Facts</Text>
              {meta.map((item, i) => (
                <View key={i} style={[styles.metaRow, i < meta.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant }]}>
                  <MaterialIcons name={item.icon as any} size={20} color={colors.neutralVariant} />
                  <View style={styles.metaTextBlock}>
                    <Text style={[styles.metaLabel, { color: colors.neutralVariant }]}>{item.label}</Text>
                    <Text style={[styles.metaValue, { color: colors.neutral }]}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Content Sections */}
          {sections.map((section, si) => (
            <View key={si} style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.neutral }]}>{section.title}</Text>
              {section.items.map((item, ii) => (
                <View key={ii} style={styles.bulletRow}>
                  <Text style={[styles.bullet, { color: colors.primary }]}>{'  \u2022  '}</Text>
                  <Text style={[styles.bulletText, { color: colors.neutral }]}>{item}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* Table of Contents */}
          {tableOfContents && tableOfContents.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.neutral }]}>What's Inside</Text>
              {tableOfContents.map((chapter, i) => (
                <View key={i} style={[styles.tocRow, i < tableOfContents.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.outlineVariant }]}>
                  <Text style={[styles.tocNumber, { color: colors.primary }]}>{i + 1}</Text>
                  <Text style={[styles.tocText, { color: colors.neutral }]}>{chapter}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Bottom CTA */}
          <TouchableOpacity
            onPress={handleOpenPdf}
            style={[styles.bottomCta, { backgroundColor: colors.heroBar }]}
            activeOpacity={0.8}
          >
            <MaterialIcons name="picture-as-pdf" size={20} color={colors.onHeroBar} />
            <Text style={[styles.bottomCtaText, { color: colors.onHeroBar }]}>
              Download Full PDF ({pdfSizeMB} MB)
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  header: {
    padding: spacing.xxl,
    paddingTop: spacing.lg,
  },
  headerEyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  headerTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    marginBottom: spacing.sm,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerMetaText: {
    fontFamily: fonts.sans,
    fontSize: 13,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  pdfCard: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pdfCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  pdfCardText: {
    flex: 1,
  },
  pdfCardTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
  },
  pdfCardSize: {
    fontFamily: fonts.sans,
    fontSize: 13,
    marginTop: 2,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 24,
  },
  card: {
    borderRadius: radii.md,
    padding: spacing.xl,
    ...shadows.card,
  },
  cardTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 17,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  metaTextBlock: {
    flex: 1,
    gap: 2,
  },
  metaLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
  },
  metaValue: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  bullet: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    lineHeight: 22,
  },
  bulletText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
  tocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  tocNumber: {
    fontFamily: fonts.sansBold,
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  tocText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    flex: 1,
  },
  bottomCta: {
    borderRadius: radii.md,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  bottomCtaText: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
  },
});
