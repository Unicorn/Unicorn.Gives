import { MaterialIcons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { radii, spacing, useTheme } from "@/constants/theme";
import { useAuth } from "@/lib/auth";

interface DetailEditBarProps {
	editHref: Href;
}

/**
 * Shown on public detail screens when the user is signed in — links to the
 * admin editor for that record (admin layout still enforces role).
 */
export function DetailEditBar({ editHref }: DetailEditBarProps) {
	const { user } = useAuth();
	const { colors } = useTheme();

	if (!user) return null;

	return (
		<View style={styles.wrap}>
			<Link href={editHref} asChild>
				<Pressable
					style={({ pressed }) => [
						styles.bar,
						{
							backgroundColor: colors.surfaceContainer,
							borderColor: colors.outline,
							opacity: pressed ? 0.85 : 1,
						},
					]}
					accessibilityRole="button"
					accessibilityLabel="Edit in admin"
				>
					<MaterialIcons name="edit" size={18} color={colors.primary} />
					<Text style={[styles.label, { color: colors.primary }]}>Edit</Text>
				</Pressable>
			</Link>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		marginBottom: spacing.md,
	},
	bar: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "flex-start",
		gap: spacing.xs,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		borderRadius: radii.sm,
		borderWidth: 1,
	},
	label: {
		fontSize: 14,
		fontWeight: "700",
	},
});
