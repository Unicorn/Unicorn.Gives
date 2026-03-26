import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function AdminIndex() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Admin</Text>
      <Text style={styles.subtitle}>Dashboard placeholder. Admin pages are role-gated.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          await supabase.auth.signOut();
        }}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4', padding: 20, gap: 12 },
  title: { fontSize: 30, fontWeight: '900', color: '#2d4a4a', marginTop: 14 },
  subtitle: { fontSize: 14, color: '#73796d', lineHeight: 20 },
  button: { marginTop: 18, backgroundColor: '#2d4a4a', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fcf9f4', fontWeight: '900' },
});

