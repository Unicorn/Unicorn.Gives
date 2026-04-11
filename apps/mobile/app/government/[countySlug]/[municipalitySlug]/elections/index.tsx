import { View, Text, StyleSheet } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { RegionHeroSection } from '@/components/municipal/sections/RegionHeroSection';
import { useRegion } from '@/lib/hooks/useRegion';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { useTheme, spacing } from '@/constants/theme';

export default function ElectionsIndex() {
  const { colors } = useTheme();
  const { municipalitySlug } = useMunicipalRoute();
  const { region } = useRegion(municipalitySlug);

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
      <RegionHeroSection
        eyebrow="Elections"
        headline={region?.name}
        subheadline="Polling locations, registration deadlines, and ballot measures."
      />
      <Container>
        <View style={styles.inner}>
          <Text style={[styles.placeholder, { color: colors.neutralVariant }]}>
            Polling locations, registration deadlines, and ballot measures will appear here.
          </Text>
        </View>
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  inner: { paddingTop: spacing.xxl, paddingHorizontal: spacing.xl },
  placeholder: { fontSize: 15, lineHeight: 22 },
});
