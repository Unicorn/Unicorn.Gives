import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import {
	BentoGrid,
	HeroFeature,
	InfoRowGroup,
	QuoteCallout,
} from "@/components/widgets";
import {
	HORN_HERO,
	HORN_INFO,
	HORN_MISSION,
	HORN_PERKS,
	HORN_QUOTE,
} from "@/constants/hornContent";
import { fonts, fontSize, radii, shadows, spacing, useTheme, type ThemeColors } from "@/constants/theme";
import { routes } from "@/lib/navigation";

export default function CommunityTab() {
	const { colors } = useTheme();
	const styles = useMemo(() => createStyles(colors), [colors]);

	return (
		<Wrapper style={styles.container} contentContainerStyle={styles.content}>
			<Container>
				<View style={styles.stack}>
					{/* Hero: The Horn */}
					<HeroFeature
						eyebrow={HORN_HERO.eyebrow}
						title={HORN_HERO.title}
						description={HORN_HERO.description}
						ctaLabel={HORN_HERO.ctaLabel}
						ctaHref={routes.partners.index("the-horn")}
						secondaryCta={{
							label: HORN_HERO.secondaryCtaLabel,
							href: routes.partners.index("the-horn"),
						}}
					/>

					{/* Mission Quote */}
					<QuoteCallout quote={HORN_MISSION} variant="centered" />

					{/* Member Perks Bento */}
					<BentoGrid
						eyebrow="Member Benefits"
						title="Member Perks"
						subtitle="Designed for the modern Northern resident — balancing professional needs with the ultimate comfort."
						items={HORN_PERKS}
					/>

					{/* Visit Info */}
					<InfoRowGroup title={HORN_INFO.title} rows={[...HORN_INFO.rows]} />

					{/* Decorative quote */}
					<QuoteCallout
						quote={HORN_QUOTE.quote}
						attribution={HORN_QUOTE.attribution}
						variant="aside"
					/>

					{/* Existing navigation links */}
					<View style={styles.navSection}>
						<Text style={styles.navSectionTitle}>Explore Community</Text>
						<Link href={routes.community.events.index()} asChild>
							<AnimatedPressable variant="card" style={styles.navCard}>
								<MaterialIcons
									name="event"
									size={24}
									color={colors.neutralVariant}
								/>
								<View style={styles.navCardText}>
									<Text style={styles.navCardTitle}>Events</Text>
									<Text style={styles.navCardDesc}>
										Upcoming and past community events
									</Text>
								</View>
							</AnimatedPressable>
						</Link>

						<Link href={routes.community.news.index()} asChild>
							<AnimatedPressable variant="card" style={styles.navCard}>
								<MaterialIcons
									name="article"
									size={24}
									color={colors.neutralVariant}
								/>
								<View style={styles.navCardText}>
									<Text style={styles.navCardTitle}>News</Text>
									<Text style={styles.navCardDesc}>
										Civic updates, stories, and community perspectives
									</Text>
								</View>
							</AnimatedPressable>
						</Link>
					</View>
				</View>
			</Container>
		</Wrapper>
	);
}

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: { flex: 1 },
		content: {
			padding: spacing.lg,
			paddingBottom: spacing.xxxl + spacing.sm,
		},
		stack: { width: "100%", gap: spacing.xxxl + spacing.sm },
		navSection: { gap: spacing.md, marginTop: spacing.lg },
		navSectionTitle: {
			fontFamily: fonts.serifItalic,
			fontSize: fontSize["3xl"],
			color: colors.primary,
			marginBottom: spacing.xs,
		},
		navCard: {
			flexDirection: "row",
			borderRadius: radii.md,
			padding: spacing.lg,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
			gap: spacing.lg - 2,
			alignItems: "center",
		},
		navCardIcon: { fontSize: fontSize["3xl"], width: 36, textAlign: "center" },
		navCardText: { flex: 1, gap: 2 },
		navCardTitle: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.lg,
			color: colors.neutral,
		},
		navCardDesc: {
			fontFamily: fonts.sans,
			fontSize: fontSize.sm + 1,
			color: colors.neutralVariant,
			lineHeight: 19,
		},
	});
