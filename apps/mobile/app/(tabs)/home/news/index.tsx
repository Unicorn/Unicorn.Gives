import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ContentCoverImage } from "@/components/ContentCoverImage";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { HeroFeature } from "@/components/widgets";
import { NEWS_TAB_HERO } from "@/constants/eventsTabContent";
import { breakpoints, fonts, fontSize, letterSpacing, radii, shadows, spacing, useTheme, type ThemeColors } from "@/constants/theme";
import { useHydratedDimensions } from "@/hooks/useHydrated";
import { routes } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";

interface NewsItem {
	id: string;
	slug: string;
	title: string;
	date: string;
	category: string;
	description: string | null;
	image_url: string | null;
	featured: boolean | null;
}

export default function NewsTab() {
	const { colors, chips } = useTheme();
	const { width } = useHydratedDimensions();
	const isTablet = width >= breakpoints.tablet;
	const [items, setItems] = useState<NewsItem[]>([]);

	useEffect(() => {
		supabase
			.from("news")
			.select("id, slug, title, date, category, description, image_url, featured")
			.eq("status", "published")
			.in("visibility", ["global", "both"])
			.order("date", { ascending: false })
			.limit(50)
			.then(({ data }) => {
				if (data) setItems(data);
			});
	}, []);

	const styles = useMemo(() => createStyles(colors), [colors]);

	const featuredItems = items.filter((n) => n.featured);
	const regularItems = items.filter((n) => !n.featured);

	const renderCard = (n: NewsItem) => (
		<Link
			key={n.id}
			href={routes.community.news.detail(n.slug)}
			asChild
		>
			<AnimatedPressable variant="card" style={styles.card}>
				<ContentCoverImage
					imageUrl={n.image_url}
					variant="card"
					accessibilityLabel={n.title}
				/>
				<View style={styles.cardBody}>
					<Text style={styles.category}>
						{n.category.replace(/-/g, " ").toUpperCase()}
					</Text>
					<Text style={styles.title}>{n.title}</Text>
					{n.description && (
						<Text style={styles.desc} numberOfLines={2}>
							{n.description}
						</Text>
					)}
					<Text style={styles.date}>
						{new Date(`${n.date}T00:00:00`).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</Text>
				</View>
			</AnimatedPressable>
		</Link>
	);

	const renderFeatured = (n: NewsItem) => {
		const d = new Date(`${n.date}T00:00:00`);
		const monthDay = d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
		const year = d.getFullYear();
		return (
			<Link
				key={n.id}
				href={routes.community.news.detail(n.slug)}
				style={StyleSheet.flatten(styles.featuredCard)}
			>
				<ContentCoverImage
					imageUrl={n.image_url}
					variant="card"
					accessibilityLabel={n.title}
					style={styles.featuredCover}
				/>
				<View style={isTablet ? styles.featuredBody : undefined}>
					<View
						style={StyleSheet.flatten([
							styles.featuredAccent,
							isTablet ? styles.featuredAccentTablet : undefined,
						])}
					>
						<View
							style={StyleSheet.flatten([
								styles.featuredBadge,
								{
									backgroundColor: chips.gold.backgroundColor,
									borderColor: chips.gold.borderColor,
								},
							])}
						>
							<Text
								style={StyleSheet.flatten([
									styles.featuredBadgeText,
									{ color: chips.gold.color },
								])}
							>
								Featured
							</Text>
						</View>
						<View style={styles.featuredDate}>
							<Text style={styles.featuredDateMonth}>{monthDay}</Text>
							<Text style={styles.featuredDateYear}>{year}</Text>
						</View>
						<Text style={styles.featuredCategory}>
							{n.category.replace(/-/g, " ").toUpperCase()}
						</Text>
					</View>

					<View
						style={StyleSheet.flatten([
							styles.featuredContent,
							isTablet ? styles.featuredContentTablet : undefined,
						])}
					>
						<Text
							style={StyleSheet.flatten([
								styles.featuredTitle,
								isTablet ? styles.featuredTitleTablet : undefined,
							])}
						>
							{n.title}
						</Text>
						{n.description && (
							<Text style={styles.featuredDesc} numberOfLines={3}>
								{n.description}
							</Text>
						)}
						<View style={styles.featuredCtaRow}>
							<View style={styles.featuredCta}>
								<Text style={styles.featuredCtaText}>Read article</Text>
							</View>
						</View>
					</View>
				</View>
			</Link>
		);
	};

	return (
		<Wrapper style={styles.container} contentContainerStyle={styles.content}>
			<Container>
				<View style={styles.stack}>
					<HeroFeature
						eyebrow={NEWS_TAB_HERO.eyebrow}
						title={NEWS_TAB_HERO.title}
						description={NEWS_TAB_HERO.description}
						ctaLabel={NEWS_TAB_HERO.ctaLabel}
						ctaHref={routes.community.events.index()}
						secondaryCta={{
							label: NEWS_TAB_HERO.secondaryCtaLabel,
							href: routes.partners.index("the-horn"),
						}}
					/>

					{featuredItems.map((n) => renderFeatured(n))}

					<View style={styles.listSection}>
						{regularItems.map((n) => renderCard(n))}
						{items.length === 0 && (
							<Text style={styles.empty}>
								No published news items yet. Check back soon for civic updates.
							</Text>
						)}
					</View>
				</View>
			</Container>
		</Wrapper>
	);
}

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: { flex: 1 },
		content: { padding: spacing.lg, paddingBottom: spacing.xxxl + spacing.sm },
		stack: { width: "100%", gap: spacing.xxxl + spacing.sm },
		listSection: { gap: spacing.sm },
		card: {
			borderRadius: radii.sm,
			overflow: "hidden",
			backgroundColor: colors.surface,
			...shadows.card,
		},
		featuredCard: {
			borderRadius: radii.lg,
			overflow: "hidden",
			backgroundColor: colors.surface,
			...shadows.card,
		},
		featuredCover: {
			height: 220,
		},
		featuredBody: {
			flexDirection: "row",
		},
		featuredAccent: {
			padding: spacing.xxl,
			gap: spacing.sm,
		},
		featuredAccentTablet: {
			width: "40%",
			justifyContent: "center",
		},
		featuredBadge: {
			alignSelf: "flex-start",
			paddingHorizontal: spacing.md,
			paddingVertical: spacing.xs,
			borderRadius: radii.pill,
			borderWidth: 1,
		},
		featuredBadgeText: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.xs - 1,
			letterSpacing: 1.2,
			textTransform: "uppercase",
		},
		featuredDate: {
			marginTop: spacing.sm,
		},
		featuredDateMonth: {
			fontFamily: fonts.serifBold,
			fontSize: fontSize["2xl"],
			color: colors.neutral,
		},
		featuredDateYear: {
			fontFamily: fonts.sans,
			fontSize: fontSize.md,
			color: colors.neutralVariant,
		},
		featuredCategory: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.xs,
			color: colors.neutralVariant,
			letterSpacing: 1,
			marginTop: spacing.xs,
		},
		featuredContent: {
			padding: spacing.xxl,
			gap: spacing.sm + 2,
			flex: 1,
		},
		featuredContentTablet: {
			justifyContent: "center",
		},
		featuredTitle: {
			fontFamily: fonts.serifItalic,
			fontSize: 26,
			lineHeight: 32,
			color: colors.neutral,
		},
		featuredTitleTablet: {
			fontSize: fontSize["5xl"],
			lineHeight: 36,
		},
		featuredDesc: {
			fontFamily: fonts.sans,
			fontSize: fontSize.md,
			lineHeight: 21,
			color: colors.neutralVariant,
		},
		featuredCtaRow: {
			flexDirection: "row",
			marginTop: spacing.xs,
		},
		featuredCta: {
			paddingHorizontal: spacing.xl,
			paddingVertical: spacing.sm + 2,
			borderRadius: radii.pill,
			backgroundColor: colors.primary,
		},
		featuredCtaText: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.sm + 1,
			color: colors.onPrimary,
		},
		cardBody: {
			padding: spacing.lg - 2,
		},
		category: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.xs,
			color: colors.neutralVariant,
			letterSpacing: letterSpacing.normal,
			marginBottom: spacing.xs,
		},
		title: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.lg,
			color: colors.neutral,
			marginBottom: spacing.xs,
		},
		desc: {
			fontFamily: fonts.sans,
			fontSize: fontSize.md,
			color: colors.neutral,
			lineHeight: 20,
			marginBottom: spacing.xs,
		},
		date: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
		empty: { fontFamily: fonts.sans, textAlign: "center", color: colors.neutralVariant, marginTop: spacing.xxxl + spacing.sm },
	});
