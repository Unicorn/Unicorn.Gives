import { View, Text, Pressable, Modal, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { routes, toHref } from '@/lib/navigation';
import { useTheme, fonts, fontSize, spacing, radii } from '@/constants/theme';
import { useThemeToggle } from '@/lib/themeToggle';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface HeaderUserMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function HeaderUserMenu({ visible, onClose }: HeaderUserMenuProps) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { colors, isDark } = useTheme();
  const toggleTheme = useThemeToggle();

  function handleAction(action: string) {
    onClose();
    switch (action) {
      case 'logout':
        signOut();
        break;
      case 'login':
        router.push(toHref('/sign-in'));
        break;
      case 'register':
        router.push(toHref('/sign-up'));
        break;
      case 'theme':
        toggleTheme();
        break;
      case 'account':
        router.push(routes.user.index());
        break;
      case 'profile':
        router.push(routes.user.profile());
        break;
      case 'settings':
        router.push(routes.user.settings());
        break;
    }
  }

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.popover, { backgroundColor: colors.surface }]}>
          <MenuItem
            icon={isDark ? 'light-mode' : 'dark-mode'}
            label={isDark ? 'Light mode' : 'Dark mode'}
            color={colors.neutral}
            onPress={() => handleAction('theme')}
          />

          <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

          {user ? (
            <>
              <MenuItem icon="manage-accounts" label="Account" color={colors.neutral} onPress={() => handleAction('account')} />
              <MenuItem icon="person" label="Profile" color={colors.neutral} onPress={() => handleAction('profile')} />
              <MenuItem icon="settings" label="Settings" color={colors.neutral} onPress={() => handleAction('settings')} />
              <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
              <MenuItem icon="logout" label="Logout" color={colors.error} onPress={() => handleAction('logout')} />
            </>
          ) : (
            <>
              <MenuItem icon="login" label="Log in" color={colors.neutral} onPress={() => handleAction('login')} />
              <MenuItem icon="person-add" label="Register" color={colors.neutral} onPress={() => handleAction('register')} />
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

function MenuItem({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <AnimatedPressable variant="subtle" style={styles.item} onPress={onPress}>
      <View style={styles.row}>
        <MaterialIcons name={icon} size={18} color={color} />
        <Text style={[styles.text, { color }]}>{label}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'web' ? 56 : 100,
    paddingRight: spacing.md,
  },
  popover: {
    borderRadius: radii.md,
    paddingVertical: spacing.xs,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  item: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
  },
  text: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.base,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.md,
  },
});
