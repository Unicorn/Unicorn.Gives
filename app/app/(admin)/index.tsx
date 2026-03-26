import { View, Text, StyleSheet } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';

export default function AdminDashboard() {
  return (
    <View style={styles.page}>
      <AppHeader title="Admin" showBack />
      <View style={styles.container}>
        <Text style={styles.title}>Admin dashboard</Text>
        <Text style={styles.body}>Editor tools will be added here.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4' },
  container: { padding: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  body: { fontSize: 16, color: '#73796d' },
});
