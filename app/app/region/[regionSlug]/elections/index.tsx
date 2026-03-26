import { View, Text, StyleSheet } from 'react-native';

export default function ElectionsIndex() {
  return <View style={s.c}><Text style={s.t}>Elections — coming soon</Text></View>;
}
const s = StyleSheet.create({ c: { flex: 1, backgroundColor: '#fcf9f4', justifyContent: 'center', alignItems: 'center' }, t: { color: '#73796d', fontSize: 16 } });
