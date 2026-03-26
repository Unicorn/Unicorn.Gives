import { View, Text, StyleSheet } from 'react-native';

export default function ZoningScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Zoning</Text>
      <Text style={styles.placeholder}>
        Zoning map, district information, and regulation lookup will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4', padding: 20 },
  heading: { fontSize: 24, fontWeight: '800', color: '#2d4a4a', marginBottom: 12 },
  placeholder: { fontSize: 15, color: '#73796d', lineHeight: 22 },
});
