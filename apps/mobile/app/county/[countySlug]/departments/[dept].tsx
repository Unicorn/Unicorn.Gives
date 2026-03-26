import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';

export default function DepartmentPage() {
  const { dept } = useLocalSearchParams<{ dept: string }>();
  return (
    <View style={styles.page}>
      <AppHeader title={dept?.replace(/-/g, ' ') ?? 'Department'} showBack />
      <View style={styles.body}>
        <Text style={styles.text}>Department page — content coming soon.</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4' },
  body: { padding: 24 },
  text: { fontSize: 16, color: '#73796d' },
});
