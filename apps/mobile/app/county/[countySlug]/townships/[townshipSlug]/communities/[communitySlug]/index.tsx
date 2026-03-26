import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
export default function CommunityPage() {
  const { communitySlug } = useLocalSearchParams<{ communitySlug: string }>();
  return (
    <View style={s.c}>
      <Text style={s.t}>Community: {communitySlug?.replace(/-/g, ' ')}</Text>
      <Text style={s.sub}>Lake / place page — coming soon.</Text>
    </View>
  );
}
const s = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#fcf9f4', justifyContent: 'center', alignItems: 'center', padding: 24 },
  t: { fontSize: 18, fontWeight: '700', color: '#2d4a4a', marginBottom: 8, textAlign: 'center' },
  sub: { fontSize: 15, color: '#73796d', textAlign: 'center' },
});
