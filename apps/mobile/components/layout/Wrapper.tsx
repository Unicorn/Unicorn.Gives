import { ScrollView, type ScrollViewProps } from 'react-native';
import { useTheme } from '@/constants/theme';
import type { ReactNode } from 'react';

interface WrapperProps extends ScrollViewProps {
  children: ReactNode;
}

/**
 * Full-width ScrollView for page-level scrolling.
 * Pair with <Container> inside to constrain content to max-width.
 */
export function Wrapper({ children, style, contentContainerStyle, ...rest }: WrapperProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
}
