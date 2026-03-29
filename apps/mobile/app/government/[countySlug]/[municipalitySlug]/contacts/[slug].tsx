import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { useTheme, spacing } from '@/constants/theme';
import { fetchContactsStaticParams } from '@/lib/static-build-queries';

export async function generateStaticParams() {
  return fetchContactsStaticParams();
}

export default function ContactDetail() {
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
      <Container>
        <View style={styles.inner}>
          <Text style={[styles.heading, { color: colors.neutral }]}>Contact</Text>
          <Text style={[styles.placeholder, { color: colors.neutralVariant }]}>Contact detail for "{slug}"</Text>
        </View>
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  inner: { padding: spacing.xl },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: spacing.md },
  placeholder: { fontSize: 15 },
});
