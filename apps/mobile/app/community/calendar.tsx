import { View, Text, StyleSheet } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';

export default function CalendarScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Calendar" showBack />
      <View style={styles.container}>
        <Text style={styles.heading}>Events Calendar</Text>
        <Text style={styles.placeholder}>
          Calendar view of community events will be displayed here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4', padding: 20 },
  heading: { fontSize: 24, fontWeight: '800', color: '#2d4a4a', marginBottom: 12 },
  placeholder: { fontSize: 15, color: '#73796d', lineHeight: 22 },
});
