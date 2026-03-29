import { MaterialIcons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import {
	type StyleProp,
	StyleSheet,
	Text,
	useWindowDimensions,
	View,
	type ViewStyle,
} from "react-native";
import {
	breakpoints,
	fonts,
	radii,
	shadows,
	spacing,
	useTheme,
} from "@/constants/theme";

export interface BentoItem {
	key: string;
	title: string;
	description: string;
	icon: string;
	href?: Href;
	span?: "full" | "half";
	colorScheme?: "primary" | "secondary" | "tertiary" | "surface" | "muted";
}

interface BentoGridProps {
	eyebrow?: string;
	title: string;
	subtitle?: string;
	items: BentoItem[];
}

function useSchemeStyles() {
	const { colors } = useTheme();
	const base = {
		bg: colors.surface,
		text: colors.neutral,
		desc: colors.neutralVariant,
		icon: colors.primary,
	};
	return {
		primary: base,
		secondary: base,
		tertiary: base,
		surface: base,
		muted: { ...base, bg: colors.surfaceContainer },
	} as const;
}

/**
 * Wide layouts matching home "Around the region" bento: one wrapping row,
 * tablet = ⅔ + ⅓ per half-pair, desktop = 48% + 48%, full = 100%.
 */
function buildWideCellStyles(
	items: BentoItem[],
	isDesktop: boolean,
): ViewStyle[] {
	const out: ViewStyle[] = [];
	let i = 0;
	while (i < items.length) {
		const item = items[i];
		if (item.span === "full") {
			out.push(styles.cellWideFull);
			i += 1;
			continue;
		}
		const run: BentoItem[] = [];
		while (i < items.length && items[i].span !== "full") {
			run.push(items[i]);
			i += 1;
		}
		for (let j = 0; j < run.length; j += 2) {
			const a = run[j];
			const b = run[j + 1];
			if (b) {
				out.push(isDesktop ? styles.cellWideHalf : styles.cellWideTwoThirds);
				out.push(isDesktop ? styles.cellWideHalf : styles.cellWideOneThird);
			} else if (a) {
				out.push(styles.cellWideFull);
			}
		}
	}
	return out;
}

function BentoCell({
	item,
	outerStyle,
}: {
	item: BentoItem;
	outerStyle?: StyleProp<ViewStyle>;
}) {
	const schemes = useSchemeStyles();
	const scheme = schemes[item.colorScheme || "surface"];

	const card = (
		<View
			style={[
				styles.card,
				{ backgroundColor: scheme.bg },
				shadows.cardElevated,
			]}
		>
			<MaterialIcons
				// biome-ignore lint/suspicious/noExplicitAny: icon string from bento item data
				name={item.icon as any}
				size={22}
				color={scheme.icon}
				style={styles.icon}
			/>
			<Text style={[styles.cardTitle, { color: scheme.text }]}>
				{item.title}
			</Text>
			<Text style={[styles.cardDesc, { color: scheme.desc }]}>
				{item.description}
			</Text>
		</View>
	);

	const wrapStyle = [styles.cellOuter, outerStyle];

	if (item.href) {
		return (
			<Link href={item.href} style={wrapStyle}>
				{card}
			</Link>
		);
	}

	return <View style={wrapStyle}>{card}</View>;
}

export function BentoGrid({ eyebrow, title, subtitle, items }: BentoGridProps) {
	const { width } = useWindowDimensions();
	const { colors } = useTheme();
	const isTablet = width >= breakpoints.tablet;
	const isDesktop = width >= breakpoints.desktop;
	const isWide = isTablet || isDesktop;
	const wideOuterStyles = buildWideCellStyles(items, isDesktop);

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				{eyebrow && (
					<Text style={[styles.eyebrow, { color: colors.neutralVariant }]}>
						{eyebrow}
					</Text>
				)}
				<Text style={[styles.title, { color: colors.neutral }]}>{title}</Text>
				{subtitle && (
					<Text style={[styles.subtitle, { color: colors.neutralVariant }]}>
						{subtitle}
					</Text>
				)}
			</View>
			<View style={[styles.grid, isWide && styles.gridWide]}>
				{items.map((item, index) => (
					<BentoCell
						key={item.key}
						item={item}
						outerStyle={
							isWide
								? (wideOuterStyles[index] ?? styles.cellWideFull)
								: undefined
						}
					/>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: spacing.lg,
	},
	header: {
		gap: spacing.xs,
	},
	eyebrow: {
		fontFamily: fonts.sansBold,
		fontSize: 11,
		letterSpacing: 1.5,
		textTransform: "uppercase",
	},
	title: {
		fontFamily: fonts.serifItalic,
		fontSize: 28,
	},
	subtitle: {
		fontFamily: fonts.sans,
		fontSize: 15,
		lineHeight: 22,
	},
	grid: {
		gap: spacing.md,
	},
	/** Matches home `bentoGrid` + `bentoGridTablet` (Around the region). */
	gridWide: {
		flexDirection: "row",
		flexWrap: "wrap",
		width: "100%",
	},
	cellOuter: {
		width: "100%",
	},
	cellWideFull: {
		flexBasis: "100%",
		flexGrow: 0,
		flexShrink: 0,
	},
	cellWideHalf: {
		flexBasis: "45%",
		flexGrow: 1,
		flexShrink: 0,
	},
	cellWideTwoThirds: {
		flexBasis: "60%",
		flexGrow: 1,
		flexShrink: 0,
	},
	cellWideOneThird: {
		flexBasis: "28%",
		flexGrow: 1,
		flexShrink: 0,
	},
	card: {
		padding: spacing.xl,
		borderRadius: radii.md,
		gap: spacing.sm,
	},
	icon: {
		marginBottom: spacing.md,
	},
	cardTitle: {
		fontFamily: fonts.sansBold,
		fontSize: 18,
	},
	cardDesc: {
		fontFamily: fonts.sans,
		fontSize: 13,
		lineHeight: 20,
	},
});
