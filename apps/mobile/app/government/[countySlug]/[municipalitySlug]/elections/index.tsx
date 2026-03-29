import { View, Text, StyleSheet } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { useTheme, spacing } from '@/constants/theme';

export default function ElectionsIndex() {
  const { colors } = useTheme();
  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
      <Container>
        <View style={styles.inner}>
          <Text style={[styles.heading, { color: colors.neutral }]}>Elections</Text>
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
  inner: { padding: spacing.xl },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: spacing.md },
  placeholder: { fontSize: 15, lineHeight: 22 },
});
