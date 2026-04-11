import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRegion } from '@/lib/hooks/useRegion';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import {
  fetchMunicipalDocumentsForRegion,
  type MunicipalDocumentRow,
} from '@/lib/municipal/municipalDocuments';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { RegionHeroSection } from '@/components/municipal/sections/RegionHeroSection';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { toHref } from '@/lib/navigation/paths';
import { routes } from '@/lib/navigation';

function iconForMunicipalDoc(kind: MunicipalDocumentRow['kind']): keyof typeof MaterialIcons.glyphMap {
  switch (kind) {
    case 'master_plan':
      return 'architecture';
    case 'recreation_plan':
      return 'park';
    case 'zoning_ordinance':
      return 'map';
    default:
      return 'description';
  }
}

export default function MunicipalDocumentsIndexScreen() {
  const { colors } = useTheme();
  const { countySlug, municipalitySlug, basePath } = useMunicipalRoute();
  const { region, isLoading } = useRegion(municipalitySlug);
  const [docs, setDocs] = useState<MunicipalDocumentRow[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!region?.id) {
      setDocs([]);
      setReady(true);
      return;
    }
    fetchMunicipalDocumentsForRegion(region.id).then((d) => {
      setDocs(d);
      setReady(true);
    });
  }, [region?.id]);

  if (isLoading || !ready) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.neutralVariant }}>Loading...</Text>
      </View>
    );
  }

  if (!region) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.neutralVariant }}>Municipality not found</Text>
      </View>
    );
  }

  if (docs.length === 0) {
    return (
      <Redirect href={routes.government.municipality(countySlug, municipalitySlug)} />
    );
  }

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }}>
      <RegionHeroSection
        eyebrow="Official Documents"
        headline={region.name}
        subheadline="Planning, zoning, and official municipal documents."
      />
      <Container>
        <View style={styles.list}>
          {docs.map((doc) => {
            const icon = iconForMunicipalDoc(doc.kind);
            return (
              <Link key={doc.id} href={toHref(`${basePath}/documents/${doc.slug}`)} asChild>
                <AnimatedPressable
                  variant="card"
                  style={[styles.card, { backgroundColor: colors.surface }, shadows.cardElevated]}
                >
                  <View style={[styles.iconBox, { backgroundColor: colors.surfaceContainer }]}>
                    <MaterialIcons name={icon} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.textCol}>
                    <Text style={[styles.cardTitle, { color: colors.neutral }]}>{doc.title}</Text>
                    <Text style={[styles.cardSub, { color: colors.neutralVariant }]}>
                      Adopted {doc.adopted_date}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color={colors.neutralVariant} />
                </AnimatedPressable>
              </Link>
            );
          })}
        </View>
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: { flex: 1, gap: 2 },
  cardTitle: { fontFamily: fonts.sansBold, fontSize: 15 },
  cardSub: { fontFamily: fonts.sans, fontSize: 13 },
});
