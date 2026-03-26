import { View, Text, StyleSheet } from 'react-native';
import { useTheme, spacing } from '@/constants/theme';

export default function ElectionsIndex() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.neutral }]}>Elections</Text>
      <Text style={[styles.placeholder, { color: colors.neutralVariant }]}>
        Polling locations, registration deadlines, and ballot measures will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: spacing.md },
  placeholder: { fontSize: 15, lineHeight: 22 },
});
