import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { spacing } from "@/constants/theme";

interface BentoSectionProps {
	children: ReactNode;
	style?: ViewStyle;
	/** Parent already applies horizontal padding (e.g. home discover panel). */
	flushHorizontal?: boolean;
}

/**
 * Shared spacing for Service Directories / Township Resources blocks using
 * {@link BentoGrid}. Matches municipal page inset when not flush.
 */
export function BentoSection({
	children,
	style,
	flushHorizontal,
}: BentoSectionProps) {
	return (
		<View
			style={[styles.root, flushHorizontal && styles.flushHorizontal, style]}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		width: "100%",
		marginTop: spacing.xxxl,
		paddingHorizontal: spacing.lg,
	},
	flushHorizontal: {
		paddingHorizontal: 0,
	},
});
