import { View, Text, StyleSheet } from 'react-native';
export default function StubScreen({ title }: { title: string }) {
  return <View style={s.c}><Text style={s.t}>{title}</Text></View>;
}
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#fcf9f4', justifyContent: 'center', alignItems: 'center', padding: 24 }, t: { color: '#73796d', fontSize: 16, textAlign: 'center' } });
