import { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

export default function AdminIndex() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, padding: 20, gap: 12 },
  title: { fontSize: 30, fontWeight: '900', color: colors.neutral, marginTop: 14 },
  subtitle: { fontSize: 14, color: colors.neutralVariant, lineHeight: 20 },
  button: { marginTop: 18, backgroundColor: colors.neutral, paddingVertical: 12, paddingHorizontal: 16, borderRadius: radii.md, alignItems: 'center' },
  buttonText: { color: colors.background, fontWeight: '900' },
});
