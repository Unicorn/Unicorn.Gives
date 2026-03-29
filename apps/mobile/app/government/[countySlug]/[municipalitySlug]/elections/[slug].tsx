import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { useTheme, spacing } from '@/constants/theme';

export default function ElectionDetail() {
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
      <Container>
        <View style={styles.inner}>
          <Text style={[styles.heading, { color: colors.neutral }]}>Election</Text>
          <Text style={[styles.placeholder, { color: colors.neutralVariant }]}>Election detail for "{slug}"</Text>
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
