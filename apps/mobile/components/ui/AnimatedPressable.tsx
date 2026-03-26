import { forwardRef } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Platform,
  type ViewStyle,
  type StyleProp,
  type TouchableOpacityProps,
  type View,
} from 'react-native';

type Variant = 'button' | 'card' | 'subtle';

interface AnimatedPressableProps extends Omit<TouchableOpacityProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: Variant;
}

/**
 * Drop-in replacement for TouchableOpacity with hover effects on web.
 * Compatible with expo-router `<Link asChild>`.
 *
 * - Press: built-in TouchableOpacity activeOpacity
 * - Hover (web): CSS scale transform via injected stylesheet
 */
export const AnimatedPressable = forwardRef<View, AnimatedPressableProps>(
  function AnimatedPressable({ children, style, variant = 'subtle', ...rest }, ref) {
    const activeOpacity = variant === 'button' ? 0.85 : variant === 'card' ? 0.92 : 0.7;

    // React Native Web uses dataSet prop for data-* attributes
    const webDataSet =
      Platform.OS === 'web' && variant !== 'subtle'
        ? { dataSet: { pressableVariant: variant } }
        : {};

    return (
      <TouchableOpacity
        ref={ref as any}
        activeOpacity={activeOpacity}
        style={StyleSheet.flatten(style)}
        {...(webDataSet as any)}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  },
);

// Inject global CSS hover styles on web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const id = '__animated-pressable-hover';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      [data-pressable-variant="button"],
      [data-pressable-variant="card"] {
        transition: transform 0.15s ease, box-shadow 0.15s ease !important;
        cursor: pointer !important;
      }
      [data-pressable-variant="button"]:hover {
        transform: scale(1.03) !important;
      }
      [data-pressable-variant="card"]:hover {
        transform: scale(1.015) !important;
      }
      [data-pressable-variant="button"]:active,
      [data-pressable-variant="card"]:active {
        transform: scale(0.97) !important;
      }
    `;
    document.head.appendChild(s);
  }
}
