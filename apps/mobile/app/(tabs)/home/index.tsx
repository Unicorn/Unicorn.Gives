import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Image,
	Linking,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	useWindowDimensions,
	View,
} from "react-native";
import { ContentCoverImage } from "@/components/ContentCoverImage";
import { EventRowLayout } from "@/components/events/EventRowLayout";
import { BentoSection } from "@/components/layout/BentoSection";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
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
	radii,
	shadows,
	spacing,
	useTheme,
} from "@/constants/theme";
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

	const { width } = useWindowDimensions();
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
			<Container>
				<View style={styles.hero}>
					<View
						style={[
							styles.heroInner,
							isTablet && styles.heroInnerTablet,
							isDesktop && styles.heroInnerDesktop,
						]}
					>
						<View
							style={[styles.heroLayout, isTablet && styles.heroLayoutTablet]}
						>
							<View style={styles.heroText}>
								<Text style={styles.heroTitle}>
									<Text
										style={[
											styles.heroTitleItalic,
											isTablet && styles.heroTitleItalicTablet,
											isDesktop && styles.heroTitleItalicDesktop,
										]}
									>
										Land of the{" "}
									</Text>
									<Text
										style={[
											styles.heroTitleBold,
											isTablet && styles.heroTitleBoldTablet,
											isDesktop && styles.heroTitleBoldDesktop,
										]}
									>
										Unicorns
									</Text>
								</Text>
								<Text
									style={[
										styles.heroTagline,
										isTablet && styles.heroTaglineTablet,
									]}
								>
									{DISCOVER_TAGLINE}
								</Text>
								<View
									style={[
										styles.heroCtaRow,
										isDesktop && styles.heroCtaRowDesktop,
									]}
								>
									<Link href={routes.community.index()} asChild>
										<AnimatedPressable
											variant="button"
											style={StyleSheet.flatten([
												styles.heroCtaPrimary,
												shadows.button,
											])}
										>
											<Text style={styles.heroCtaPrimaryText}>
												Get Involved
											</Text>
										</AnimatedPressable>
									</Link>
									<Link href={routes.history.index()} asChild>
										<AnimatedPressable
											variant="button"
											style={styles.heroCtaOutline}
										>
											<Text style={styles.heroCtaOutlineText}>
												Land &amp; lore
											</Text>
										</AnimatedPressable>
									</Link>
								</View>
							</View>

							<View style={styles.heroMedia}>
								<View style={styles.heroImageBlock}>
									<Image
										source={require("../../../assets/images/home-hero.png")}
										style={[
											styles.heroImage,
											isTablet && styles.heroImageTablet,
											isDesktop && styles.heroImageDesktop,
										]}
										resizeMode="cover"
										accessibilityLabel="Northern Michigan landscape"
									/>
								</View>
							</View>
						</View>
					</View>
				</View>

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

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
	StyleSheet.create({
		container: { flex: 1 },
		content: { paddingBottom: 40 },
		hero: {
			paddingHorizontal: 24,
			paddingTop: 16,
			paddingBottom: 24,
		},
		heroInner: { width: "100%" },
		heroInnerTablet: {},
		heroInnerDesktop: {},
		heroLayout: {
			flexDirection: "column",
		},
		heroLayoutTablet: {
			flexDirection: "row",
			alignItems: "center",
			gap: 20,
		},
		heroText: {
			flex: 1,
		},
		heroMedia: {
			flex: 1,
		},
		heroPill: {
			alignSelf: "flex-start",
			paddingHorizontal: 14,
			paddingVertical: 6,
			borderRadius: radii.pill,
			marginBottom: 14,
			borderWidth: 1,
			borderColor: colors.outline,
		},
		heroPillText: {
			fontSize: 11,
			fontFamily: fonts.sansBold,
			color: colors.primary,
			letterSpacing: 2,
			textTransform: "uppercase",
		},
		heroTitle: { marginBottom: 10 },
		heroTitleItalic: {
			fontSize: 34,
			lineHeight: 38,
			fontFamily: fonts.serifItalic,
			color: colors.neutral,
		},
		heroTitleItalicTablet: { fontSize: 40, lineHeight: 44 },
		heroTitleItalicDesktop: { fontSize: 44, lineHeight: 48 },
		heroTitleBold: {
			fontSize: 34,
			lineHeight: 38,
			fontFamily: fonts.serifBold,
			color: colors.neutral,
		},
		heroTitleBoldTablet: { fontSize: 40, lineHeight: 44 },
		heroTitleBoldDesktop: { fontSize: 44, lineHeight: 48 },
		heroTagline: {
			fontSize: 17,
			fontFamily: fonts.sansMedium,
			color: colors.neutralVariant,
			marginBottom: 16,
		},
		heroTaglineTablet: { fontSize: 18 },
		heroCtaRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: 10,
			marginBottom: 20,
		},
		heroCtaRowDesktop: { flexWrap: "nowrap" },
		heroCtaPrimary: {
			backgroundColor: colors.primary,
			paddingHorizontal: 22,
			paddingVertical: 14,
			borderRadius: radii.pill,
			minHeight: 44,
			justifyContent: "center",
		},
		heroCtaPrimaryText: {
			color: colors.onPrimary,
			fontFamily: fonts.sansBold,
			fontSize: 15,
		},
		heroCtaOutline: {
			borderWidth: 2,
			borderColor: colors.outline,
			paddingHorizontal: 22,
			paddingVertical: 12,
			borderRadius: radii.pill,
			minHeight: 44,
			justifyContent: "center",
		},
		heroCtaOutlineText: {
			color: colors.neutral,
			fontFamily: fonts.sansBold,
			fontSize: 15,
		},
		heroImageBlock: {
			borderRadius: radii.lg,
			overflow: "hidden",
			position: "relative",
			...shadows.cardElevated,
		},
		heroImage: {
			width: "100%",
			height: 220,
			backgroundColor: colors.surfaceContainer,
		},
		heroImageTablet: {
			height: 260,
		},
		heroImageDesktop: {
			height: 320,
		},
		heroQuoteCard: {
			padding: 16,
		},
		heroQuoteCardOverlay: {
			position: "absolute",
			left: 16,
			right: 16,
			bottom: 16,
		},
		heroQuoteLabel: {
			fontSize: 10,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			letterSpacing: 1.2,
			textTransform: "uppercase",
			marginBottom: 8,
		},
		heroQuoteBody: {
			fontSize: 14,
			fontFamily: fonts.serifItalic,
			color: colors.neutralVariant,
			lineHeight: 21,
		},
		panel: { padding: 20, paddingTop: spacing.xl },
		panelTablet: {
			padding: spacing.xl,
			paddingTop: spacing.xl,
		},
		panelDesktop: {
			padding: spacing.xxl,
			paddingTop: spacing.xl,
		},
		body: {
			fontSize: 15,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 24,
			marginBottom: 14,
		},
		muted: {
			fontSize: 13,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 20,
			marginBottom: 14,
		},
		missionCard: {
			borderRadius: radii.md,
			padding: spacing.lg,
			marginBottom: spacing.xl,
			borderLeftWidth: 4,
			borderLeftColor: colors.primary,
		},
		missionLabel: {
			fontSize: 11,
			fontFamily: fonts.sansBold,
			color: colors.primary,
			letterSpacing: 1,
			marginBottom: 6,
			textTransform: "uppercase",
		},
		missionText: {
			fontSize: 15,
			fontFamily: fonts.sans,
			color: colors.primary,
			lineHeight: 22,
		},
		sectionTitle: {
			fontSize: 22,
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
			paddingHorizontal: 20,
			paddingVertical: 12,
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
			marginBottom: 12,
		},
		viewAll: {
			fontSize: 14,
			fontFamily: fonts.sansMedium,
			color: colors.primary,
		},
		ctaRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: 10,
			marginBottom: 8,
		},
		ctaButton: {
			backgroundColor: colors.primary,
			paddingHorizontal: 20,
			paddingVertical: 12,
			borderRadius: radii.pill,
			minHeight: 44,
			justifyContent: "center",
		},
		ctaButtonText: {
			color: colors.onPrimary,
			fontFamily: fonts.sansBold,
			fontSize: 15,
		},
		ctaButtonOutline: {
			borderWidth: 2,
			borderColor: colors.primary,
			paddingHorizontal: 20,
			paddingVertical: 10,
			borderRadius: radii.pill,
			minHeight: 44,
			justifyContent: "center",
		},
		ctaButtonOutlineText: {
			color: colors.primary,
			fontFamily: fonts.sansBold,
			fontSize: 15,
		},
		partnerFeatureRow: {
			flexDirection: "row",
			flexWrap: "wrap",
			gap: 12,
			marginBottom: 12,
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
			flexGrow: 0,
			flexBasis: "48%",
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
		partnerFeatureBody: { padding: 14 },
		partnerFeatureName: {
			fontSize: 18,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
			marginBottom: 6,
		},
		partnerFeatureDesc: {
			fontSize: 13,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 19,
			marginBottom: 10,
		},
		partnerFeatureCta: {
			fontSize: 14,
			fontFamily: fonts.sansBold,
			color: colors.primary,
		},
		partnerChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
		partnerChip: {
			paddingHorizontal: 14,
			paddingVertical: 10,
			borderRadius: 20,
			borderWidth: 1,
			borderColor: colors.outline,
		},
		partnerChipText: {
			fontSize: 13,
			fontFamily: fonts.sansMedium,
			color: colors.primary,
		},
		bentoGrid: { gap: 12 },
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
			padding: 18,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		bentoTileIcon: {
			fontSize: 22,
			marginBottom: 10,
			color: colors.primary,
		},
		bentoTileHeading: {
			fontSize: 18,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
			marginBottom: 8,
		},
		bentoTileDesc: {
			fontSize: 13,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 20,
			marginBottom: 12,
		},
		bentoTileLink: {
			fontSize: 14,
			fontFamily: fonts.sansBold,
			color: colors.primary,
		},
		bentoEventsTile: {
			borderRadius: radii.md,
			padding: 18,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		bentoEventsIcon: { fontSize: 22, marginBottom: 8 },
		bentoEventsHeading: { color: colors.neutral },
		bentoEventRow: {
			marginBottom: 10,
		},
		bentoEventsEmpty: {
			fontSize: 14,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			marginBottom: 12,
		},
		bentoEventsCta: {
			marginTop: 8,
			backgroundColor: colors.primary,
			paddingVertical: 12,
			borderRadius: radii.pill,
			alignItems: "center",
		},
		bentoEventsCtaText: {
			fontFamily: fonts.sansBold,
			fontSize: 14,
			color: colors.onPrimary,
		},
		bentoNewsTile: {
			borderRadius: radii.md,
			padding: 18,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		bentoNewsThumb: {
			height: 72,
			marginBottom: 8,
			borderRadius: radii.sm,
			overflow: "hidden",
		},
		bentoNewsHeadline: {
			fontSize: 16,
			fontFamily: fonts.serifItalic,
			color: colors.neutral,
			lineHeight: 24,
			marginBottom: 12,
		},
		bentoNewsFooter: { alignSelf: "flex-start" },
		newsletterBand: {
			marginTop: spacing.xxxl,
			padding: spacing.xl,
			borderRadius: radii.md,
		},
		newsletterHelper: {
			fontSize: 13,
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
			fontSize: 16,
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
			fontSize: 24,
			fontFamily: fonts.serifBold,
			color: colors.neutral,
			marginBottom: 10,
		},
		newsletterBody: {
			fontSize: 15,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 22,
			marginBottom: 16,
		},
		newsletterButton: {
			alignSelf: "flex-start",
			backgroundColor: colors.primary,
			paddingHorizontal: 22,
			paddingVertical: 14,
			borderRadius: radii.pill,
		},
		newsletterButtonText: {
			fontFamily: fonts.sansBold,
			fontSize: 15,
			color: colors.onPrimary,
		},
		newsletterButtonOutline: {
			borderWidth: 2,
			borderColor: colors.primary,
			paddingHorizontal: 20,
			paddingVertical: 12,
			borderRadius: radii.pill,
			minHeight: 44,
			justifyContent: "center",
		},
		newsletterButtonOutlineText: {
			fontFamily: fonts.sansBold,
			fontSize: 15,
			color: colors.primary,
		},
		grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
		card: {
			width: "48%",
			borderRadius: radii.md,
			padding: 16,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		cardIcon: { fontSize: 24, marginBottom: 6 },
		cardTitle: {
			fontSize: 13,
			fontFamily: fonts.sansMedium,
			color: colors.primary,
		},
		regionCard: {
			borderRadius: radii.md,
			padding: 14,
			marginBottom: 8,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		regionType: {
			fontSize: 10,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			letterSpacing: 1,
			marginBottom: 2,
		},
		regionName: {
			fontSize: 17,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
		},
		newsItem: {
			borderRadius: radii.sm,
			padding: 12,
			marginBottom: 6,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		newsCategory: {
			fontSize: 10,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			letterSpacing: 0.5,
			marginBottom: 2,
		},
		newsTitle: {
			fontSize: 14,
			fontFamily: fonts.sansMedium,
			color: colors.neutral,
			marginBottom: 2,
		},
		newsDate: {
			fontSize: 12,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
		},
		eventItem: {
			flexDirection: "row",
			borderRadius: radii.sm,
			padding: 10,
			marginBottom: 6,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
			gap: 12,
			alignItems: "center",
		},
		dateBox: {
			width: 44,
			alignItems: "center",
			borderRadius: 6,
			paddingVertical: 5,
			borderWidth: 1,
			borderColor: colors.outline,
		},
		dateMonth: {
			fontSize: 9,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			letterSpacing: 1,
		},
		dateDay: {
			fontSize: 18,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
		},
		eventInfo: { flex: 1 },
		eventTitle: {
			fontSize: 14,
			fontFamily: fonts.sansMedium,
			color: colors.neutral,
			marginBottom: 1,
		},
		eventMeta: {
			fontSize: 12,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
		},
		partnerName: {
			fontSize: 16,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
			marginBottom: 4,
		},
		partnerDesc: {
			fontSize: 12,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 18,
		},
		authBanner: {
			marginTop: 20,
			padding: 16,
			borderRadius: radii.md,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			gap: 12,
		},
		authText: {
			flex: 1,
			fontSize: 13,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
		},
		authButton: {
			backgroundColor: colors.primary,
			paddingHorizontal: 16,
			paddingVertical: 8,
			borderRadius: radii.sm,
		},
		authButtonText: {
			color: colors.onPrimary,
			fontFamily: fonts.sansBold,
			fontSize: 13,
		},
		loreCalloutTwilight: {
			borderRadius: radii.md,
			padding: 16,
			marginVertical: 16,
			borderLeftWidth: 4,
			borderLeftColor: colors.primary,
		},
		loreCalloutLabel: {
			fontSize: 11,
			fontFamily: fonts.sansBold,
			color: colors.primary,
			letterSpacing: 1,
			marginBottom: 8,
			textTransform: "uppercase",
		},
		loreCalloutBody: {
			fontSize: 15,
			fontFamily: fonts.serifItalic,
			color: colors.neutralVariant,
			lineHeight: 24,
		},
		loreCalloutAmber: {
			borderRadius: radii.md,
			padding: 16,
			marginVertical: 16,
			borderLeftWidth: 4,
			borderLeftColor: colors.primary,
		},
		loreCalloutLabelAmber: {
			fontSize: 11,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			letterSpacing: 1,
			marginBottom: 8,
			textTransform: "uppercase",
		},
		loreCalloutBodyDark: {
			fontSize: 15,
			fontFamily: fonts.serifItalic,
			color: colors.neutralVariant,
			lineHeight: 24,
		},
		loreTeaserCard: {
			borderRadius: radii.md,
			padding: 14,
			marginBottom: 10,
			backgroundColor: colors.surface,
			...shadows.cardElevated,
		},
		loreTeaserKind: {
			fontSize: 10,
			fontFamily: fonts.sansBold,
			color: colors.neutralVariant,
			marginBottom: 4,
			letterSpacing: 0.5,
		},
		loreTeaserTitle: {
			fontSize: 17,
			fontFamily: fonts.sansBold,
			color: colors.neutral,
			marginBottom: 6,
		},
		loreTeaserBlurb: {
			fontSize: 14,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			lineHeight: 21,
			marginBottom: 8,
		},
		loreTeaserLink: {
			fontSize: 14,
			fontFamily: fonts.sansBold,
			color: colors.primary,
		},
		citationBlock: {
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: colors.outline,
		},
		citationTitle: {
			fontSize: 15,
			fontFamily: fonts.sansBold,
			color: colors.primary,
			marginBottom: 4,
		},
		citationNote: {
			fontSize: 13,
			fontFamily: fonts.sans,
			color: colors.neutralVariant,
			marginBottom: 4,
			lineHeight: 18,
		},
		citationUrl: {
			fontSize: 12,
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
