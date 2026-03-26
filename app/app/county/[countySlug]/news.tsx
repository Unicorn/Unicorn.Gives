import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { useRegion } from '@/lib/hooks/useRegion';

export default function CountyNews() {
  const { countySlug } = useLocalSearchParams<{ countySlug: string }>();
  const { region } = useRegion(countySlug);
  return (
    <View style={styles.page}>
      <AppHeader title={region?.name ? `${region.name} news` : 'County news'} showBack />
      <View style={styles.body}>
        <Text style={styles.text}>County-scoped news feed — coming soon.</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4' },
  body: { padding: 24 },
  text: { fontSize: 16, color: '#73796d' },
});
