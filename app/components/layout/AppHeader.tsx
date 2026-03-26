import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
}

export function AppHeader({ title = 'Unicorn Gives', showBack = false }: AppHeaderProps) {
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {showBack ? (
          <Pressable style={styles.iconButton} onPress={() => router.back()}>
            <Text style={styles.iconText}>←</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            accessibilityLabel="Open menu"
            accessibilityRole="button"
          >
            <View style={styles.hamburger}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </Pressable>
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Spacer to keep title centered */}
        <View style={styles.iconButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d4a4a',
    paddingTop: Platform.OS === 'web' ? 0 : 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
    color: '#fcf9f4',
    fontWeight: '700',
  },
  hamburger: {
    width: 22,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    backgroundColor: '#fcf9f4',
    borderRadius: 1,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#fcf9f4',
    textAlign: 'center',
  },
});
