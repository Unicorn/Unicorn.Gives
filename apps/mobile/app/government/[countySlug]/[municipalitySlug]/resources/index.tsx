import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRegion } from '@/lib/hooks/useRegion';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import {
  fetchResourceLanding,
  fetchResourceSubpages,
  type ResourcePageRow,
} from '@/lib/municipal/resourcePages';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { toHref } from '@/lib/navigation/paths';
import { routes } from '@/lib/navigation';

function iconForResourcePage(slug: string): keyof typeof MaterialIcons.glyphMap {
  if (slug.includes('master-plan')) return 'architecture';
  if (slug.includes('recreation')) return 'park';
  if (slug.includes('zoning')) return 'map';
  if (slug.includes('budget') || slug.includes('financial')) return 'account-balance';
  if (slug.includes('meeting') || slug.includes('minutes')) return 'groups';
  return 'description';
}

export default function ResourcesIndexScreen() {
  const { colors } = useTheme();
  const { countySlug, municipalitySlug, basePath } = useMunicipalRoute();
  const { region, isLoading } = useRegion(municipalitySlug);
  const [landing, setLanding] = useState<ResourcePageRow | null>(null);
  const [subpages, setSubpages] = useState<ResourcePageRow[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!region?.id) {
      return;
    }
    setReady(false);
    Promise.all([
      fetchResourceLanding(region.id),
      fetchResourceSubpages(region.id),
    ]).then(([l, s]) => {
      setLanding(l);
      setSubpages(s);
      setReady(true);
    });
  }, [region?.id]);

  if (isLoading || !region || !ready) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.neutralVariant }}>Loading...</Text>
      </View>
    );
  }

  if (!landing && subpages.length === 0) {
    return (
      <Redirect href={routes.government.municipality(countySlug, municipalitySlug)} />
    );
  }

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }}>
      <Container>
        <View style={styles.section}>
          <Text style={[styles.eyebrow, { color: colors.neutralVariant }]}>
            COMMUNITY RESOURCES
          </Text>
          <Text style={[styles.title, { color: colors.neutral }]}>
            {landing?.title ?? 'Resources'}
          </Text>
          {landing?.description ? (
            <Text style={[styles.subtitle, { color: colors.neutralVariant }]}>
              {landing.description}
            </Text>
          ) : null}
        </View>
        <View style={styles.list}>
          {subpages.map((page) => {
            const icon = iconForResourcePage(page.slug);
            const attachmentCount = page.attachments?.length ?? 0;
            return (
              <Link
                key={page.id}
                href={toHref(`${basePath}/resources/${page.slug}`)}
                asChild
              >
                <AnimatedPressable
                  variant="card"
                  style={StyleSheet.flatten([styles.card, { backgroundColor: colors.surface }])}
                >
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: colors.surfaceContainer },
                    ]}
                  >
                    <MaterialIcons name={icon} size={24} color={colors.primary} />
                  </View>
                  <View style={styles.textCol}>
                    <Text style={[styles.cardTitle, { color: colors.neutral }]}>
                      {page.title}
                    </Text>
                    {page.description ? (
                      <Text
                        style={[styles.cardSub, { color: colors.neutralVariant }]}
                        numberOfLines={2}
                      >
                        {page.description}
                      </Text>
                    ) : null}
                    {attachmentCount > 0 ? (
                      <View style={styles.attachmentBadge}>
                        <MaterialIcons
                          name="attach-file"
                          size={12}
                          color={colors.neutralVariant}
                        />
                        <Text
                          style={[
                            styles.attachmentText,
                            { color: colors.neutralVariant },
                          ]}
                        >
                          {attachmentCount} {attachmentCount === 1 ? 'file' : 'files'}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={22}
                    color={colors.neutralVariant}
                  />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  section: {
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
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
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
  cardSub: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18 },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  attachmentText: { fontFamily: fonts.sans, fontSize: 11 },
});
