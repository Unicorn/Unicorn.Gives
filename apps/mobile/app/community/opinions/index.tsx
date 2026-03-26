import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing } from '@/constants/theme';

export default function OpinionsIndex() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.neutral }]}>Community Opinions</Text>
      <Text style={[styles.placeholder, { color: colors.neutralVariant }]}>
        Community posts, discussions, and perspectives will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: spacing.md },
  placeholder: { fontSize: 15, lineHeight: 22 },
});
