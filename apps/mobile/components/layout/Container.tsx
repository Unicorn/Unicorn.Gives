import type { ReactNode } from "react";
import {
	StyleSheet,
	View,
	type ViewStyle,
} from "react-native";
import { breakpoints } from "@/constants/theme";
import { useHydratedDimensions } from "@/hooks/useHydrated";

interface ContainerProps {
	children: ReactNode;
	style?: ViewStyle;
	/** Apply max-width + centering only, no horizontal padding. Use at layout level. */
	flush?: boolean;
}

/**
 * Max-width centered container. Use inside <Wrapper> or any full-width parent
 * to constrain content width on tablet/desktop.
 */
export function Container({ children, style, flush }: ContainerProps) {
	const { width } = useHydratedDimensions();
	const isTablet = width >= breakpoints.tablet;
	const isDesktop = width >= breakpoints.desktop;

	return (
		<View
			style={[
				styles.base,
				isTablet && (flush ? styles.tabletFlush : styles.tablet),
				isDesktop && (flush ? styles.desktopFlush : styles.desktop),
				style,
			]}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	base: {
		width: "100%",
		paddingHorizontal: 16,
	},
	tablet: {
		maxWidth: 1280,
		alignSelf: "center",
		paddingHorizontal: 24,
	},
	desktop: {
		maxWidth: 1280,
		alignSelf: "center",
		paddingHorizontal: 28,
	},
	tabletFlush: {
		maxWidth: 1280,
		alignSelf: "center",
		paddingHorizontal: 0,
	},
	desktopFlush: {
		maxWidth: 1280,
		alignSelf: "center",
		paddingHorizontal: 0,
	},
});
