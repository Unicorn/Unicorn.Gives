import { View, StyleSheet } from 'react-native';
import { AppHeader } from '@/components/layout/AppHeader';
import { ElectionsCenter } from '@/components/cms/ElectionsCenter';

export default function ElectionsScreen() {
  return (
    <View style={styles.page}>
      <AppHeader title="Election Center" showBack={false} />
      <ElectionsCenter variant="full" />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4' },
});

