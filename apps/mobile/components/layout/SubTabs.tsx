import { type Href, Link, usePathname } from "expo-router";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { breakpoints, useTheme, fonts, fontSize, spacing } from "@/constants/theme";
import { useHydratedDimensions } from "@/hooks/useHydrated";
import { hrefToPathString } from "@/lib/navigation";

export interface SubTabItem {
	label: string;
	href: Href;
}

interface SubTabsProps {
	tabs: SubTabItem[];
}

export function SubTabs({ tabs }: SubTabsProps) {
	const pathname = usePathname();
	const { colors } = useTheme();
	const { width } = useHydratedDimensions();
	const isWide = width >= breakpoints.tablet;

	return (
		<View style={[styles.container, { borderBottomColor: colors.outline }]}>
			<View style={styles.inner}>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={[
						styles.scrollContent,
						isWide && styles.scrollContentCentered,
					]}
				>
					{tabs.map((tab) => {
						const tabPath = hrefToPathString(tab.href);
						const firstPath = tabs[0] ? hrefToPathString(tabs[0].href) : "";
						const isActive =
							pathname === tabPath ||
							(tabPath !== firstPath && pathname.startsWith(tabPath));

						return (
							<Link key={tabPath} href={tab.href} asChild>
								<Pressable
									style={StyleSheet.flatten([
										styles.tab,
										isActive && [
											styles.tabActive,
											{ borderBottomColor: colors.neutral },
										],
									])}
								>
									<Text
										style={StyleSheet.flatten([
											styles.tabText,
											{ color: colors.neutralVariant },
											isActive && { color: colors.neutral, fontWeight: "700" },
										])}
									>
										{tab.label}
									</Text>
								</Pressable>
							</Link>
						);
					})}
				</ScrollView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: 1,
	},
	inner: {
		maxWidth: 1100,
		width: "100%",
		alignSelf: "center",
	},
	scrollContent: {
		paddingHorizontal: spacing.md,
		gap: spacing.xs,
	},
	scrollContentCentered: {
		flex: 1,
		justifyContent: "center",
	},
	tab: {
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		borderBottomWidth: 2,
		borderBottomColor: "transparent",
	},
	tabActive: {},
	tabText: {
		fontFamily: fonts.sansMedium,
		fontSize: fontSize.md,
	},
});
