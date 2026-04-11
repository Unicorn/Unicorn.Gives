import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Linking,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { ContentCoverImage } from "@/components/ContentCoverImage";
import { EventRowLayout } from "@/components/events/EventRowLayout";
import { BentoSection } from "@/components/layout/BentoSection";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
import { RegionHeroSection } from "@/components/municipal/sections/RegionHeroSection";
import { SeoHead } from "@/components/SeoHead";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { BentoGrid, type BentoItem } from "@/components/widgets";
// HomeTabBar removed — SubTabs in _layout.tsx handles navigation
import {
	DISCOVER_MISSION_LEDE,
	DISCOVER_PARAGRAPHS,
	DISCOVER_TAGLINE,
	HOME_BENTO_EVENTS_EMPTY,
	HOME_BENTO_EVENTS_TITLE,
	HOME_BENTO_GOV_DESC,
	HOME_BENTO_GOV_TITLE,
	HOME_BENTO_NEWS_TITLE,
	HOME_BENTO_REGION_TITLE,
	HOME_BENTO_SOLVE_DESC,
	HOME_BENTO_SOLVE_TITLE,
	HOME_HISTORY_CTA_LABEL,
	HOME_HISTORY_SECTION_TITLE,
	HOME_HISTORY_TEASER,
	HOME_NEWSLETTER_BODY,
	HOME_NEWSLETTER_CTA_EXTERNAL,
	HOME_NEWSLETTER_CTA_PRIMARY,
	HOME_NEWSLETTER_EMAIL_PLACEHOLDER,
	HOME_NEWSLETTER_SUBSCRIBE_BUTTON,
	HOME_NEWSLETTER_SUBSCRIBE_HELPER,
	HOME_NEWSLETTER_TITLE,
} from "@/constants/homeDiscoverHistory";
import {
	breakpoints,
	fonts,
	fontSize,
	letterSpacing,
	radii,
	shadows,
	spacing,
	useTheme,
	type ThemeColors,
} from "@/constants/theme";
import { useHydratedDimensions } from "@/hooks/useHydrated";
import { eventDateBoxFromIso } from "@/lib/events/eventDateFormat";
import { governmentHref } from "@/lib/governmentHref";
import { routes } from "@/lib/navigation";
import { toHref } from "@/lib/navigation/paths";
import { getDefaultDescription } from "@/lib/seo";
import { supabase } from "@/lib/supabase";

const SERVICE_DIRECTORY_ITEMS: BentoItem[] = [
	{
		key: "gov",
		icon: "account-balance",
		title: "Government & Civic Affairs",
		description:
			"Commissioner minutes, public hearings, voter registration, and county records.",
		span: "full",
		colorScheme: "surface",
		href: routes.government.county("clare-county"),
	},
	{
		key: "permits",
		icon: "description",
		title: "Permits & Licenses",
		description: "Building, zoning, and business operation applications.",
		span: "half",
		colorScheme: "surface",
		href: toHref("/guides"),
	},
	{
		key: "property",
		icon: "home",
		title: "Property & Building",
		description:
			"Building permits, pole barns, property splits, and zoning variances.",
		span: "half",
		colorScheme: "surface",
		href: toHref("/guides"),
	},
	{
		key: "nature",
		icon: "eco",
		title: "Nature & Conservation",
		description:
			"Native plants, burn permits, soil erosion, and forestry advice.",
		span: "half",
		colorScheme: "surface",
		href: toHref("/guides"),
	},
	{
		key: "safety",
		icon: "shield",
		title: "Safety & Emergency",
		description:
			"Emergency alerts, non-emergency reporting, and community safety.",
		span: "half",
		colorScheme: "surface",
		href: toHref("/guides"),
	},
];

const FALLBACK_COUNTY_SLUG = "clare-county";

const newsletterUrl =
	typeof process.env.EXPO_PUBLIC_NEWSLETTER_URL === "string" &&
	process.env.EXPO_PUBLIC_NEWSLETTER_URL.length > 0
		? process.env.EXPO_PUBLIC_NEWSLETTER_URL
		: undefined;

const newsletterSubscribeTemplate =
	typeof process.env.EXPO_PUBLIC_NEWSLETTER_SUBSCRIBE_URL === "string" &&
	process.env.EXPO_PUBLIC_NEWSLETTER_SUBSCRIBE_URL.length > 0
		? process.env.EXPO_PUBLIC_NEWSLETTER_SUBSCRIBE_URL
		: undefined;

interface Region {
	id: string;
	slug: string;
	name: string;
	type: string;
}

interface NewsItem {
	slug: string;
	title: string;
	date: string;
	category: string;
	image_url: string | null;
}
interface Event {
	slug: string;
	title: string;
	date: string;
	time: string | null;
	location: string | null;
	image_url: string | null;
}
interface Partner {
	slug: string;
	name: string;
	description: string | null;
}

export default function HomeScreen() {
	const { colors } = useTheme();
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [regions, setRegions] = useState<Region[]>([]);
	const [news, setNews] = useState<NewsItem[]>([]);
	const [events, setEvents] = useState<Event[]>([]);
	const [partners, setPartners] = useState<Partner[]>([]);

	useEffect(() => {
		supabase
			.from("regions")
			.select("id, slug, name, type")
			.eq("is_active", true)
			.order("display_order")
			.then(({ data }) => {
				if (data) setRegions(data);
			});
		supabase
			.from("news")
			.select("slug, title, date, category, image_url")
			.eq("status", "published")
			.in("visibility", ["global", "both"])
			.order("date", { ascending: false })
			.limit(3)
			.then(({ data }) => {
				if (data) setNews(data);
			});
		supabase
			.from("events")
			.select("slug, title, date, time, location, image_url")
			.eq("status", "published")
			.in("visibility", ["global", "both"])
			.gte("date", new Date().toISOString().split("T")[0])
			.order("date")
			.limit(4)
			.then(({ data }) => {
				if (data) setEvents(data);
			});
		supabase
			.from("partners")
			.select("slug, name, description")
			.eq("is_active", true)
			.then(({ data }) => {
				if (data) setPartners(data);
			});
	}, []);

	const govHref =
		regions.length > 0
			? governmentHref(regions[0])
			: routes.government.county(FALLBACK_COUNTY_SLUG);

	const { width } = useHydratedDimensions();
	const isTablet = width >= breakpoints.tablet;
	const isDesktop = width >= breakpoints.desktop;

	const styles = useMemo(() => createStyles(colors), [colors]);

	const openNewsletterWithEmail = (email: string) => {
		const trimmed = email.trim();
		if (newsletterSubscribeTemplate) {
			const url = newsletterSubscribeTemplate.includes("{email}")
				? newsletterSubscribeTemplate
						.split("{email}")
						.join(encodeURIComponent(trimmed))
				: `${newsletterSubscribeTemplate}${newsletterSubscribeTemplate.includes("?") ? "&" : "?"}email=${encodeURIComponent(trimmed)}`;
			void Linking.openURL(url);
			return true;
		}
		if (newsletterUrl) {
			const join = newsletterUrl.includes("?") ? "&" : "?";
			void Linking.openURL(
				`${newsletterUrl}${join}email=${encodeURIComponent(trimmed)}`,
			);
			return true;
		}
		return false;
	};

	const onNewsletterSubscribe = () => {
		const trimmed = newsletterEmail.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
			Alert.alert(
				"Check your email",
				"Enter a valid email address to subscribe.",
			);
			return;
		}
		if (!openNewsletterWithEmail(trimmed)) {
			const subject = encodeURIComponent("Subscribe to Unicorn Gives updates");
			const body = encodeURIComponent(`Please add me: ${trimmed}`);
			void Linking.openURL(`mailto:?subject=${subject}&body=${body}`);
		}
		setNewsletterEmail("");
	};

	const panelStyle = [
		styles.panel,
		isTablet && styles.panelTablet,
		isDesktop && styles.panelDesktop,
	];

	return (
		<Wrapper style={styles.container} contentContainerStyle={styles.content}>
			<SeoHead
				title="Home"
				description={`${DISCOVER_TAGLINE} ${getDefaultDescription()}`}
			/>
			<RegionHeroSection
				eyebrow="Proudly Local"
				headline="Land of the"
				headlineAccent="Unicorns"
				subheadline={DISCOVER_TAGLINE}
				primaryCta={{
					label: "Get Involved",
					url: routes.community.index() as string,
				}}
				secondaryCta={{
					label: "Land & lore",
					url: routes.history.index() as string,
				}}
			/>
			<Container style={styles.section}>
				{/* Discover content */}
				{
					<View style={panelStyle}>
						{DISCOVER_PARAGRAPHS.map((p) => (
							<Text key={p.id} style={styles.body}>
								{p.text}
							</Text>
						))}
						<View style={styles.missionCard}>
							<Text style={styles.missionLabel}>What we are building</Text>
							<Text style={styles.missionText}>{DISCOVER_MISSION_LEDE}</Text>
						</View>

						<Text style={[styles.sectionTitle, styles.historySectionTitle]}>
							{HOME_HISTORY_SECTION_TITLE}
						</Text>
						{HOME_HISTORY_TEASER.map((p) => (
							<Text key={p.id} style={styles.body}>
								{p.text}
							</Text>
						))}
						<Link href={routes.history.index()} asChild>
							<AnimatedPressable
								variant="button"
								style={StyleSheet.flatten([
									styles.historySectionCta,
									shadows.button,
								])}
							>
								<Text style={styles.ctaButtonText}>
									{HOME_HISTORY_CTA_LABEL}
								</Text>
							</AnimatedPressable>
						</Link>

						{partners.length > 0 && (
							<>
								<Text style={styles.sectionTitle}>Community partners</Text>
								<View style={styles.partnerFeatureRow}>
									{partners.slice(0, 2).map((p) => (
										<Link
											key={p.slug}
											href={routes.partners.index(p.slug)}
											asChild
										>
											<AnimatedPressable
												variant="card"
												style={StyleSheet.flatten([
													styles.partnerFeatureCard,
													(isTablet || isDesktop) &&
														styles.partnerFeatureCardTablet,
												])}
											>
												<View style={styles.partnerFeatureBanner}>
													<Text style={styles.partnerFeatureBannerLetter}>
														{p.name.charAt(0).toUpperCase()}
													</Text>
												</View>
												<View style={styles.partnerFeatureBody}>
													<Text style={styles.partnerFeatureName}>
														{p.name}
													</Text>
													{p.description ? (
														<Text
															style={styles.partnerFeatureDesc}
															numberOfLines={3}
														>
															{p.description}
														</Text>
													) : null}
													<Text style={styles.partnerFeatureCta}>
														Visit partner
													</Text>
												</View>
											</AnimatedPressable>
										</Link>
									))}
								</View>
								{partners.length > 2 && (
									<View style={styles.partnerChips}>
										{partners.slice(2).map((p) => (
											<Link
												key={p.slug}
												href={routes.partners.index(p.slug)}
												asChild
											>
												<AnimatedPressable
													variant="subtle"
													style={styles.partnerChip}
												>
													<Text style={styles.partnerChipText}>{p.name}</Text>
												</AnimatedPressable>
											</Link>
										))}
									</View>
								)}
							</>
						)}

						<Text style={[styles.sectionTitle, styles.bentoTitleSpacing]}>
							{HOME_BENTO_REGION_TITLE}
						</Text>
						<View
							style={[
								styles.bentoGrid,
								(isTablet || isDesktop) && styles.bentoGridTablet,
							]}
						>
							<Link href={routes.community.index()} asChild>
								<AnimatedPressable
									variant="card"
									style={StyleSheet.flatten([
										styles.bentoTile,
										!isDesktop && isTablet ? styles.bentoItemTwoThirds : null,
										isDesktop ? styles.bentoItemHalf : null,
									])}
								>
									<MaterialIcons
										name="explore"
										size={24}
										style={styles.bentoTileIcon}
									/>
									<Text style={styles.bentoTileHeading}>
										{HOME_BENTO_SOLVE_TITLE}
									</Text>
									<Text style={styles.bentoTileDesc}>
										{HOME_BENTO_SOLVE_DESC}
									</Text>
									<Text style={styles.bentoTileLink}>Open problem solver</Text>
								</AnimatedPressable>
							</Link>
							<Link href={govHref} asChild>
								<AnimatedPressable
									variant="card"
									style={StyleSheet.flatten([
										styles.bentoTile,
										!isDesktop && isTablet ? styles.bentoItemOneThird : null,
										isDesktop ? styles.bentoItemHalf : null,
									])}
								>
									<MaterialIcons
										name="account-balance"
										size={24}
										style={styles.bentoTileIcon}
									/>
									<Text style={styles.bentoTileHeading}>
										{HOME_BENTO_GOV_TITLE}
									</Text>
									<Text style={styles.bentoTileDesc}>
										{HOME_BENTO_GOV_DESC}
									</Text>
									<Text style={styles.bentoTileLink}>Browse government</Text>
								</AnimatedPressable>
							</Link>
							<View
								style={[
									styles.bentoEventsTile,
									!isDesktop && isTablet ? styles.bentoItemTwoThirds : null,
									isDesktop ? styles.bentoItemHalf : null,
								]}
							>
								<MaterialIcons
									name="event"
									size={24}
									style={styles.bentoEventsIcon}
								/>
								<Text
									style={[styles.bentoTileHeading, styles.bentoEventsHeading]}
								>
									{HOME_BENTO_EVENTS_TITLE}
								</Text>
								{events.length > 0 ? (
									events.slice(0, 2).map((e) => (
										<Link
											key={e.slug}
											href={routes.community.events.detail(e.slug)}
											asChild
										>
											<Pressable style={styles.bentoEventRow}>
												<EventRowLayout
													variant="compact"
													title={e.title}
													dateBox={eventDateBoxFromIso(e.date)}
													meta={
														[e.time, e.location].filter(Boolean).join(" · ") ||
														undefined
													}
													compactThumbnailUrl={e.image_url}
												/>
											</Pressable>
										</Link>
									))
								) : (
									<Text style={styles.bentoEventsEmpty}>
										{HOME_BENTO_EVENTS_EMPTY}
									</Text>
								)}
								<Link href={routes.community.events.index()} asChild>
									<AnimatedPressable
										variant="button"
										style={StyleSheet.flatten([
											styles.bentoEventsCta,
											shadows.button,
										])}
									>
										<Text style={styles.bentoEventsCtaText}>
											See full calendar
										</Text>
									</AnimatedPressable>
								</Link>
							</View>
							<View
								style={[
									styles.bentoNewsTile,
									!isDesktop && isTablet ? styles.bentoItemOneThird : null,
									isDesktop ? styles.bentoItemHalf : null,
								]}
							>
								<Text style={styles.bentoTileHeading}>
									{HOME_BENTO_NEWS_TITLE}
								</Text>
								{news[0] ? (
									<Link
										href={routes.community.news.detail(news[0].slug)}
										asChild
									>
										<AnimatedPressable variant="subtle">
											<ContentCoverImage
												imageUrl={news[0].image_url}
												variant="card"
												accessibilityLabel={news[0].title}
												style={styles.bentoNewsThumb}
											/>
											<Text style={styles.bentoNewsHeadline} numberOfLines={3}>
												{news[0].title}
											</Text>
										</AnimatedPressable>
									</Link>
								) : (
									<Text style={styles.bentoTileDesc}>
										Check back for civic updates.
									</Text>
								)}
								<Link href={routes.community.news.index()} asChild>
									<AnimatedPressable
										variant="subtle"
										style={styles.bentoNewsFooter}
									>
										<Text style={styles.bentoTileLink}>Open news feed</Text>
									</AnimatedPressable>
								</Link>
							</View>
						</View>

						{/* Service Directory Bento */}
						<BentoSection flushHorizontal>
							<BentoGrid
								eyebrow="Official Resources"
								title="Service Directories"
								subtitle="Access essential county services, township ordinances, and community resources in one central place."
								items={SERVICE_DIRECTORY_ITEMS}
							/>
						</BentoSection>

						<View style={styles.newsletterBand}>
							<Text style={styles.newsletterTitle}>
								{HOME_NEWSLETTER_TITLE}
							</Text>
							<Text style={styles.newsletterBody}>{HOME_NEWSLETTER_BODY}</Text>
							<Text style={styles.newsletterHelper}>
								{HOME_NEWSLETTER_SUBSCRIBE_HELPER}
							</Text>
							<TextInput
								style={[
									styles.newsletterInput,
									{
										borderColor: colors.outline,
										color: colors.neutral,
										backgroundColor: colors.surface,
									},
								]}
								placeholder={HOME_NEWSLETTER_EMAIL_PLACEHOLDER}
								placeholderTextColor={colors.neutralVariant}
								value={newsletterEmail}
								onChangeText={setNewsletterEmail}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
								accessibilityLabel={HOME_NEWSLETTER_EMAIL_PLACEHOLDER}
							/>
							<View style={styles.newsletterActions}>
								<AnimatedPressable
									variant="button"
									style={StyleSheet.flatten([
										styles.newsletterButton,
										shadows.button,
									])}
									onPress={onNewsletterSubscribe}
								>
									<Text style={styles.newsletterButtonText}>
										{HOME_NEWSLETTER_SUBSCRIBE_BUTTON}
									</Text>
								</AnimatedPressable>
								{newsletterUrl ? (
									<AnimatedPressable
										variant="button"
										style={styles.newsletterButtonOutline}
										onPress={() => Linking.openURL(newsletterUrl)}
									>
										<Text style={styles.newsletterButtonOutlineText}>
											{HOME_NEWSLETTER_CTA_EXTERNAL}
										</Text>
									</AnimatedPressable>
								) : (
									<Link href={routes.community.news.index()} asChild>
										<AnimatedPressable
											variant="button"
											style={styles.newsletterButtonOutline}
										>
											<Text style={styles.newsletterButtonOutlineText}>
												{HOME_NEWSLETTER_CTA_PRIMARY}
											</Text>
										</AnimatedPressable>
									</Link>
								)}
							</View>
						</View>
					</View>
				}
			</Container>
		</Wrapper>
	);
}

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: { flex: 1 },
		content: { paddingBottom: spacing.xxxl + spacing.sm },
		section: { paddingTop: spacing.xxl },
		panel: { padding: spacing.xl, paddingTop: spacing.xl },
		panelTablet: {
			padding: spacing.xl,
			paddingTop: spacing.xl,
		},
		panelDesktop: {
			padding: spacing.xxl,
			paddingTop: spacing.xl,
		},
		body: {
			fontSize: fontSize.base,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 24,
			marginBottom: spacing.lg - 2,
		},
		muted: {
			fontSize: fontSize.sm + 1,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 20,
			marginBottom: spacing.lg - 2,
		},
		missionCard: {
			borderRadius: radii.md,
			padding: spacing.lg,
			marginBottom: spacing.xl,
			borderLeftWidth: 4,
			borderLeftColor: colors.primary,
		},
		missionLabel: {
			fontSize: fontSize.xs,
			fontFamily: fonts.sansBold,
			color: colors.primary,
			letterSpacing: letterSpacing.wide,
			marginBottom: spacing.xs + 2,
			textTransform: "uppercase",
		},
		missionText: {
			fontSize: fontSize.base,
			fontFamily: fonts.sans,
			color: colors.primary,
			lineHeight: 22,
		},
		sectionTitle: {
			fontSize: fontSize["2xl"],
			fontFamily: fonts.serifBold,
			color: colors.neutral,
			marginBottom: spacing.md,
			marginTop: spacing.xxxl,
		},
		historySectionTitle: {
			marginTop: spacing.xl,
		},
		historySectionCta: {
			alignSelf: "flex-start",
			backgroundColor: colors.primary,
			paddingHorizontal: spacing.xl,
			paddingVertical: spacing.md,
			borderRadius: radii.pill,
			minHeight: 44,
			justifyContent: "center",
			marginTop: spacing.sm,
			marginBottom: spacing.md,
		},
		bentoTitleSpacing: { marginTop: spacing.xxxl },
		sectionHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: spacing.md,
		},
		viewAll: {
			fontSize: fontSize.md,
			fontFamily: fonts.sansMedium,
			color: colors.primary,
		},
		ctaRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: spacing.sm + 2,
			marginBottom: spacing.sm,
		},
		ctaButton: {
			backgroundColor: colors.primary,
			paddingHorizontal: spacing.xl,
			paddingVertical: spacing.md,
			borderRadius: radii.pill,
			minHeight: 44,
			justifyContent: "center",
		},
		ctaButtonText: {
			color: colors.onPrimary,
			fontFamily: fonts.sansBold,
			fontSize: fontSize.base,
		},
		ctaButtonOutline: {
			borderWidth: 2,
			borderColor: colors.primary,
			paddingHorizontal: spacing.xl,
			paddingVertical: spacing.sm + 2,
			borderRadius: radii.pill,
			minHeight: 44,
			justifyContent: "center",
		},
		ctaButtonOutlineText: {
			color: colors.primary,
			fontFamily: fonts.sansBold,
			fontSize: fontSize.base,
		},
		partnerFeatureRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: spacing.md,
			marginBottom: spacing.md,
		},
		partnerFeatureCard: {
			width: "100%",
			maxWidth: 360,
			flexGrow: 1,
			flexBasis: "45%",
			borderRadius: radii.md,
			overflow: "hidden",
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		partnerFeatureCardTablet: {
			width: "48%",
			maxWidth: 9999,
			flexGrow: 1,
			flexBasis: "45%",
		},
		partnerFeatureBanner: {
			height: 100,
			alignItems: "center",
			justifyContent: "center",
			borderBottomWidth: 1,
			borderBottomColor: colors.outline,
		},
		partnerFeatureBannerLetter: {
			fontSize: 40,
			fontFamily: fonts.serifBold,
			color: colors.neutral,
		},
		partnerFeatureBody: { padding: spacing.lg - 2 },
		partnerFeatureName: {
			fontSize: fontSize.xl,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
			marginBottom: spacing.xs + 2,
		},
		partnerFeatureDesc: {
			fontSize: fontSize.sm + 1,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 19,
			marginBottom: spacing.sm + 2,
		},
		partnerFeatureCta: {
			fontSize: fontSize.md,
			fontFamily: fonts.sansBold,
			color: colors.primary,
		},
		partnerChips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
		partnerChip: {
			paddingHorizontal: spacing.lg - 2,
			paddingVertical: spacing.sm + 2,
			borderRadius: radii.pill,
			borderWidth: 1,
			borderColor: colors.outline,
		},
		partnerChipText: {
			fontSize: fontSize.sm + 1,
			fontFamily: fonts.sansMedium,
			color: colors.primary,
		},
		bentoGrid: { gap: spacing.md },
		bentoGridTablet: {
			flexDirection: "row",
			flexWrap: "wrap",
		},
		bentoItemFull: {
			flexBasis: "100%",
			flexGrow: 0,
			flexShrink: 0,
		},
		bentoItemHalf: {
			flexBasis: "45%",
			flexGrow: 1,
			flexShrink: 0,
		},
		bentoItemTwoThirds: {
			flexBasis: "60%",
			flexGrow: 1,
			flexShrink: 0,
		},
		bentoItemOneThird: {
			flexBasis: "28%",
			flexGrow: 1,
			flexShrink: 0,
		},
		bentoTile: {
			borderRadius: radii.md,
			padding: spacing.xl - 2,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		bentoTileIcon: {
			fontSize: fontSize["2xl"],
			marginBottom: spacing.sm + 2,
			color: colors.primary,
		},
		bentoTileHeading: {
			fontSize: fontSize.xl,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
			marginBottom: spacing.sm,
		},
		bentoTileDesc: {
			fontSize: fontSize.sm + 1,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 20,
			marginBottom: spacing.md,
		},
		bentoTileLink: {
			fontSize: fontSize.md,
			fontFamily: fonts.sansBold,
			color: colors.primary,
		},
		bentoEventsTile: {
			borderRadius: radii.md,
			padding: spacing.xl - 2,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		bentoEventsIcon: { fontSize: fontSize["2xl"], marginBottom: spacing.sm },
		bentoEventsHeading: { color: colors.neutral },
		bentoEventRow: {
			marginBottom: spacing.sm + 2,
		},
		bentoEventsEmpty: {
			fontSize: fontSize.md,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			marginBottom: spacing.md,
		},
		bentoEventsCta: {
			marginTop: spacing.sm,
			backgroundColor: colors.primary,
			paddingVertical: spacing.md,
			borderRadius: radii.pill,
			alignItems: "center",
		},
		bentoEventsCtaText: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.md,
			color: colors.onPrimary,
		},
		bentoNewsTile: {
			borderRadius: radii.md,
			padding: spacing.xl - 2,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		bentoNewsThumb: {
			height: 72,
			marginBottom: spacing.sm,
			borderRadius: radii.sm,
			overflow: "hidden",
		},
		bentoNewsHeadline: {
			fontSize: fontSize.lg,
			fontFamily: fonts.serifItalic,
			color: colors.neutral,
			lineHeight: 24,
			marginBottom: spacing.md,
		},
		bentoNewsFooter: { alignSelf: "flex-start" },
		newsletterBand: {
			marginTop: spacing.xxxl,
			padding: spacing.xl,
			borderRadius: radii.md,
		},
		newsletterHelper: {
			fontSize: fontSize.sm + 1,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 20,
			marginBottom: spacing.md,
		},
		newsletterInput: {
			borderWidth: 1,
			borderRadius: radii.md,
			paddingHorizontal: spacing.lg,
			paddingVertical: spacing.md,
			fontSize: fontSize.lg,
			fontFamily: fonts.sans,
			marginBottom: spacing.md,
		},
		newsletterActions: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: spacing.sm,
			alignItems: "center",
		},
		newsletterTitle: {
			fontSize: fontSize["3xl"],
			fontFamily: fonts.serifBold,
			color: colors.neutral,
			marginBottom: spacing.sm + 2,
		},
		newsletterBody: {
			fontSize: fontSize.base,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 22,
			marginBottom: spacing.lg,
		},
		newsletterButton: {
			alignSelf: "flex-start",
			backgroundColor: colors.primary,
			paddingHorizontal: spacing.xxl - 2,
			paddingVertical: spacing.lg - 2,
			borderRadius: radii.pill,
		},
		newsletterButtonText: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.base,
			color: colors.onPrimary,
		},
		newsletterButtonOutline: {
			borderWidth: 2,
			borderColor: colors.primary,
			paddingHorizontal: spacing.xl,
			paddingVertical: spacing.md,
			borderRadius: radii.pill,
			minHeight: 44,
			justifyContent: "center",
		},
		newsletterButtonOutlineText: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.base,
			color: colors.primary,
		},
		grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm + 2 },
		card: {
			width: "48%",
			borderRadius: radii.md,
			padding: spacing.lg,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		cardIcon: { fontSize: fontSize["3xl"], marginBottom: spacing.xs + 2 },
		cardTitle: {
			fontSize: fontSize.sm + 1,
			fontFamily: fonts.sansMedium,
			color: colors.primary,
		},
		regionCard: {
			borderRadius: radii.md,
			padding: spacing.lg - 2,
			marginBottom: spacing.sm,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		regionType: {
			fontSize: fontSize.xs - 1,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			letterSpacing: letterSpacing.wide,
			marginBottom: 2,
		},
		regionName: {
			fontSize: fontSize.lg + 1,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
		},
		newsItem: {
			borderRadius: radii.sm,
			padding: spacing.md,
			marginBottom: spacing.xs + 2,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		newsCategory: {
			fontSize: fontSize.xs - 1,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			letterSpacing: letterSpacing.normal,
			marginBottom: 2,
		},
		newsTitle: {
			fontSize: fontSize.md,
			fontFamily: fonts.sansMedium,
			color: colors.neutral,
			marginBottom: 2,
		},
		newsDate: {
			fontSize: fontSize.sm,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
		},
		eventItem: {
			flexDirection: "row",
			borderRadius: radii.sm,
			padding: spacing.sm + 2,
			marginBottom: spacing.xs + 2,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
			gap: spacing.md,
			alignItems: "center",
		},
		dateBox: {
			width: 44,
			alignItems: "center",
			borderRadius: spacing.xs + 2,
			paddingVertical: spacing.xs + 1,
			borderWidth: 1,
			borderColor: colors.outline,
		},
		dateMonth: {
			fontSize: 9,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			letterSpacing: letterSpacing.wide,
		},
		dateDay: {
			fontSize: fontSize.xl,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
		},
		eventInfo: { flex: 1 },
		eventTitle: {
			fontSize: fontSize.md,
			fontFamily: fonts.sansMedium,
			color: colors.neutral,
			marginBottom: 1,
		},
		eventMeta: {
			fontSize: fontSize.sm,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
		},
		partnerName: {
			fontSize: fontSize.lg,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
			marginBottom: spacing.xs,
		},
		partnerDesc: {
			fontSize: fontSize.sm,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 18,
		},
		authBanner: {
			marginTop: spacing.xl,
			padding: spacing.lg,
			borderRadius: radii.md,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: spacing.md,
		},
		authText: {
			flex: 1,
			fontSize: fontSize.sm + 1,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
		},
		authButton: {
			backgroundColor: colors.primary,
			paddingHorizontal: spacing.lg,
			paddingVertical: spacing.sm,
			borderRadius: radii.sm,
		},
		authButtonText: {
			color: colors.onPrimary,
			fontFamily: fonts.sansBold,
			fontSize: fontSize.sm + 1,
		},
		loreCalloutTwilight: {
			borderRadius: radii.md,
			padding: spacing.lg,
			marginVertical: spacing.lg,
			borderLeftWidth: 4,
			borderLeftColor: colors.primary,
		},
		loreCalloutLabel: {
			fontSize: fontSize.xs,
			fontFamily: fonts.sansBold,
			color: colors.primary,
			letterSpacing: letterSpacing.wide,
			marginBottom: spacing.sm,
			textTransform: "uppercase",
		},
		loreCalloutBody: {
			fontSize: fontSize.base,
			fontFamily: fonts.serifItalic,
			color: colors.neutralVariant,
			lineHeight: 24,
		},
		loreCalloutAmber: {
			borderRadius: radii.md,
			padding: spacing.lg,
			marginVertical: spacing.lg,
			borderLeftWidth: 4,
			borderLeftColor: colors.primary,
		},
		loreCalloutLabelAmber: {
			fontSize: fontSize.xs,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			letterSpacing: letterSpacing.wide,
			marginBottom: spacing.sm,
			textTransform: "uppercase",
		},
		loreCalloutBodyDark: {
			fontSize: fontSize.base,
			fontFamily: fonts.serifItalic,
			color: colors.neutralVariant,
			lineHeight: 24,
		},
		loreTeaserCard: {
			borderRadius: radii.md,
			padding: spacing.lg - 2,
			marginBottom: spacing.sm + 2,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		loreTeaserKind: {
			fontSize: fontSize.xs - 1,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			marginBottom: spacing.xs,
			letterSpacing: letterSpacing.normal,
		},
		loreTeaserTitle: {
			fontSize: fontSize.lg + 1,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
			marginBottom: spacing.xs + 2,
		},
		loreTeaserBlurb: {
			fontSize: fontSize.md,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 21,
			marginBottom: spacing.sm,
		},
		loreTeaserLink: {
			fontSize: fontSize.md,
			fontFamily: fonts.sansBold,
			color: colors.primary,
		},
		citationBlock: {
			paddingVertical: spacing.md,
			borderBottomWidth: 1,
			borderBottomColor: colors.outline,
		},
		citationTitle: {
			fontSize: fontSize.base,
			fontFamily: fonts.sansBold,
			color: colors.primary,
			marginBottom: spacing.xs,
		},
		citationNote: {
			fontSize: fontSize.sm + 1,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			marginBottom: spacing.xs,
			lineHeight: 18,
		},
		citationUrl: {
			fontSize: fontSize.sm,
			fontFamily: fonts.sans,
			color: colors.primary,
		},
		emptyText: {
			fontSize: 15,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 22,
			marginBottom: 16,
		},
		fullWidthCta: {
			backgroundColor: colors.primary,
			paddingVertical: 14,
			borderRadius: radii.sm,
			alignItems: "center",
			marginTop: 8,
		},
		fullWidthCtaText: {
			color: colors.onPrimary,
			fontFamily: fonts.sansBold,
			fontSize: 15,
		},
	});
