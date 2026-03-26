import { View, Text, StyleSheet } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { useTheme, spacing } from '@/constants/theme';

export default function CalendarScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Calendar" showBack />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.heading, { color: colors.neutral }]}>Events Calendar</Text>
        <Text style={[styles.placeholder, { color: colors.neutralVariant }]}>
          Calendar view of community events will be displayed here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: spacing.md },
  placeholder: { fontSize: 15, lineHeight: 22 },
});
