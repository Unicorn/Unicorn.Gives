import { Link } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { HeroFeature } from "@/components/widgets";
import { HISTORY_TAB_HERO } from "@/constants/homeDiscoverHistory";
import { fonts, fontSize, letterSpacing, radii, shadows, spacing, useTheme, type ThemeColors } from "@/constants/theme";
import { getLoreDoc, LORE_ORDER } from "@/lib/lore";
import { routes } from "@/lib/navigation";

export default function HistoryTab() {
	const { colors } = useTheme();
	const styles = useMemo(() => createStyles(colors), [colors]);

	return (
		<Wrapper style={styles.container} contentContainerStyle={styles.content}>
			<Container>
				<View style={styles.stack}>
					<HeroFeature
						eyebrow={HISTORY_TAB_HERO.eyebrow}
						title={HISTORY_TAB_HERO.title}
						description={HISTORY_TAB_HERO.description}
						ctaLabel={HISTORY_TAB_HERO.ctaLabel}
						ctaHref={routes.history.detail("dogman")}
						secondaryCta={{
							label: HISTORY_TAB_HERO.secondaryCtaLabel,
							href: routes.history.detail("anishinaabe"),
						}}
					/>

					<Text style={styles.intro}>
						Choose a story below to read more — tier zero is folklore and
						teaching, not legal or scientific authority.
					</Text>
					{LORE_ORDER.map((slug) => {
						const doc = getLoreDoc(slug);
						if (!doc) return null;
						return (
							<Link key={slug} href={routes.history.detail(slug)} asChild>
								<AnimatedPressable variant="card" style={styles.card}>
									<Text style={styles.eyebrow}>{doc.eyebrow}</Text>
									<Text style={styles.title}>{doc.title}</Text>
									<Text style={styles.blurb} numberOfLines={3}>
										{doc.intro}
									</Text>
								</AnimatedPressable>
							</Link>
						);
					})}
				</View>
			</Container>
		</Wrapper>
	);
}

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: { flex: 1 },
		content: { padding: spacing.lg, paddingBottom: spacing.xxxl + spacing.sm },
		stack: { width: "100%", gap: spacing.lg },
		intro: {
			fontFamily: fonts.sans,
			fontSize: fontSize.base,
			color: colors.neutralVariant,
			lineHeight: 24,
		},
		card: {
			backgroundColor: colors.surface,
			borderRadius: radii.md,
			padding: spacing.xl - 2,
			...shadows.card,
			borderLeftWidth: 4,
			borderLeftColor: colors.primary,
		},
		eyebrow: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.xs,
			color: colors.neutralVariant,
			letterSpacing: letterSpacing.wide,
			textTransform: "uppercase",
			marginBottom: spacing.xs + 2,
		},
		title: {
			fontFamily: fonts.serif,
			fontSize: fontSize["2xl"],
			color: colors.neutral,
			marginBottom: spacing.sm + 2,
		},
		blurb: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant, lineHeight: 21 },
	});
