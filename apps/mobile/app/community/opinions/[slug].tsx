import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function OpinionDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Opinion</Text>
      <Text style={styles.placeholder}>
        Opinion article "{slug}" will be loaded here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4', padding: 20 },
  heading: { fontSize: 24, fontWeight: '800', color: '#2d4a4a', marginBottom: 12 },
  placeholder: { fontSize: 15, color: '#73796d', lineHeight: 22 },
});
