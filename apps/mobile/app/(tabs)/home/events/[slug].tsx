import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Container } from "@/components/layout/Container";
import { DetailEditBar } from "@/components/layout/DetailEditBar";
import { Wrapper } from "@/components/layout/Wrapper";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { SeoHead } from "@/components/SeoHead";
import {
	breakpoints,
	fonts,
	fontSize,
	letterSpacing,
	radii,
	spacing,
	useTheme,
} from "@/constants/theme";
import { useHydratedDimensions } from "@/hooks/useHydrated";
import { routes } from "@/lib/navigation";
import { getDefaultDescription } from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { fetchHomeEventsSlugParams } from "@/lib/static-build-queries";

export async function generateStaticParams() {
	return fetchHomeEventsSlugParams();
}

const CATEGORY_LABELS: Record<string, string> = {
	government: "Government",
	community: "Community",
	conservation: "Conservation",
	seniors: "Seniors",
	horn: "The Horn",
	"unicorn-gives": "Unicorn Gives",
	"the-mane": "The Mane",
};

interface EventRow {
	id: string;
	title: string;
	description: string | null;
	category: string | null;
	date: string;
	time: string | null;
	location: string | null;
	cost: string | null;
	recurring: boolean | null;
	recurrence_rule: string | null;
	body: string | null;
	image_url: string | null;
}

function normalizeSlug(
	param: string | string[] | undefined,
): string | undefined {
	if (param === undefined) return undefined;
	return Array.isArray(param) ? param[0] : param;
}

function formatDate(dateStr: string): string {
	return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export default function EventDetail() {
	const { colors } = useTheme();
	const { width } = useHydratedDimensions();
	const isTablet = width >= breakpoints.tablet;
	const rawSlug = useLocalSearchParams<{ slug: string | string[] }>().slug;
	const slug = normalizeSlug(rawSlug);
	const [item, setItem] = useState<EventRow | null>(null);

	useEffect(() => {
		if (!slug) return;
		void supabase
			.from("events")
			.select(
				"id, title, description, category, date, time, location, cost, recurring, recurrence_rule, body, image_url",
			)
			.eq("slug", slug)
			.single()
			.then(({ data }) => {
				if (data) setItem(data as EventRow);
			});
	}, [slug]);

	if (!item) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.background }}>
				<SeoHead
					title={slug ? `Events · ${slug}` : "Events"}
					description={getDefaultDescription()}
				/>
				<Text style={[styles.loading, { color: colors.neutralVariant }]}>
					Loading…
				</Text>
			</View>
		);
	}

	const hasImage = item.image_url != null && item.image_url.trim() !== "";
	const categoryLabel = item.category
		? CATEGORY_LABELS[item.category] || item.category
		: null;

	// Build subtitle parts
	const subtitleParts = [
		formatDate(item.date),
		item.time,
		item.location,
	].filter(Boolean);

	const hasBody = item.body && item.body.trim().length > 0;

	return (
		<Wrapper>
			<SeoHead
				title={item.title}
				description={item.description ?? undefined}
				imageUrl={item.image_url}
			/>

			{/* Full-bleed hero */}
			<View
				style={[
					styles.hero,
					{
						backgroundColor: colors.heroBackground,
						minHeight: isTablet ? 420 : 360,
					},
				]}
			>
				{/* Background image */}
				{hasImage && (
					<Image
						source={{ uri: item.image_url! }}
						style={StyleSheet.absoluteFill}
						resizeMode="cover"
						accessibilityLabel={item.title}
					/>
				)}
				{/* Dark overlay */}
				{hasImage && (
					<View style={[StyleSheet.absoluteFill, styles.overlay]} />
				)}

				<Container style={styles.heroInner}>
					<DetailEditBar editHref={routes.admin.editEvent(item.id)} />

					<View style={styles.heroContent}>
						{categoryLabel && (
							<View style={styles.eyebrowPill}>
								<Text style={styles.eyebrowText}>{categoryLabel}</Text>
							</View>
						)}

						<Text
							style={[
								styles.heroTitle,
								isTablet && styles.heroTitleTablet,
							]}
						>
							{item.title}
						</Text>

						{subtitleParts.length > 0 && (
							<Text
								style={[
									styles.heroSubtitle,
									isTablet && styles.heroSubtitleTablet,
								]}
							>
								{subtitleParts.join("  ·  ")}
							</Text>
						)}
					</View>
				</Container>
			</View>

			{/* Main content */}
			<Container style={styles.mainSection}>
				<View style={[styles.grid, isTablet && styles.gridTablet]}>
					{/* Metadata sidebar */}
					<View style={[styles.sidebar, isTablet && styles.sidebarTablet]}>
						<View
							style={[
								styles.metaCard,
								{ backgroundColor: colors.surfaceContainer },
							]}
						>
							<Text style={[styles.metaHeading, { color: colors.neutral }]}>
								Event Details
							</Text>

							<MetaRow
								icon="event"
								label="Date"
								value={formatDate(item.date)}
								colors={colors}
							/>
							{item.time && (
								<MetaRow
									icon="schedule"
									label="Time"
									value={item.time}
									colors={colors}
								/>
							)}
							{item.location && (
								<MetaRow
									icon="location-on"
									label="Location"
									value={item.location}
									colors={colors}
								/>
							)}
							{item.cost && (
								<MetaRow
									icon="payments"
									label="Cost"
									value={item.cost}
									colors={colors}
								/>
							)}
							{item.recurring && (
								<MetaRow
									icon="replay"
									label="Recurrence"
									value={item.recurrence_rule || "Recurring"}
									colors={colors}
								/>
							)}
						</View>
					</View>

					{/* Body content */}
					{hasBody && (
						<View style={[styles.bodyCol, isTablet && styles.bodyColTablet]}>
							<MarkdownRenderer content={item.body!} />
						</View>
					)}
				</View>
			</Container>
		</Wrapper>
	);
}

function MetaRow({
	icon,
	label,
	value,
	colors,
}: {
	icon: keyof typeof MaterialIcons.glyphMap;
	label: string;
	value: string;
	colors: ReturnType<typeof useTheme>["colors"];
}) {
	return (
		<View style={styles.metaRow}>
			<MaterialIcons
				name={icon}
				size={18}
				color={colors.primary}
				style={styles.metaIcon}
			/>
			<View style={styles.metaTextCol}>
				<Text style={[styles.metaLabel, { color: colors.neutralVariant }]}>
					{label}
				</Text>
				<Text style={[styles.metaValue, { color: colors.neutral }]}>
					{value}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	loading: {
		fontFamily: fonts.sans,
		padding: spacing.xxl,
		textAlign: "center",
	},

	/* ---- Hero ---- */
	hero: {
		position: "relative",
		overflow: "hidden",
		justifyContent: "flex-end",
		paddingVertical: spacing.xxxl,
	},
	overlay: {
		backgroundColor: "rgba(0,0,0,0.50)",
	},
	heroInner: {
		justifyContent: "flex-end",
	},
	heroContent: {
		maxWidth: 720,
		gap: spacing.md,
	},
	eyebrowPill: {
		alignSelf: "flex-start",
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs + 2,
		borderRadius: radii.pill,
		backgroundColor: "rgba(255,255,255,0.15)",
	},
	eyebrowText: {
		fontFamily: fonts.sansBold,
		fontSize: fontSize.xs,
		letterSpacing: letterSpacing.wider,
		textTransform: "uppercase",
		color: "#ffffff",
	},
	heroTitle: {
		fontFamily: fonts.serifBold,
		fontSize: 36,
		lineHeight: 40,
		color: "#ffffff",
	},
	heroTitleTablet: {
		fontSize: 52,
		lineHeight: 56,
	},
	heroSubtitle: {
		fontFamily: fonts.sans,
		fontSize: fontSize.md,
		lineHeight: 22,
		color: "rgba(255,255,255,0.85)",
	},
	heroSubtitleTablet: {
		fontSize: fontSize.lg,
		lineHeight: 26,
	},

	/* ---- Main content ---- */
	mainSection: {
		paddingVertical: spacing.xxxl,
	},
	grid: {
		gap: spacing.xxl,
	},
	gridTablet: {
		flexDirection: "row",
	},
	sidebar: {
		// mobile: full width, renders first
	},
	sidebarTablet: {
		width: 320,
		flexShrink: 0,
		...Platform.select({
			web: { order: 2 } as any,
			default: {},
		}),
	},
	bodyCol: {
		flex: 1,
		minWidth: 0,
	},
	bodyColTablet: {
		...Platform.select({
			web: { order: 1 } as any,
			default: {},
		}),
	},

	/* ---- Meta card ---- */
	metaCard: {
		borderRadius: radii.md,
		padding: spacing.xl,
		gap: spacing.lg,
	},
	metaHeading: {
		fontFamily: fonts.serifBold,
		fontSize: fontSize.xl,
		marginBottom: spacing.xs,
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.md,
	},
	metaIcon: {
		marginTop: 2,
	},
	metaTextCol: {
		flex: 1,
		gap: 2,
	},
	metaLabel: {
		fontFamily: fonts.sansBold,
		fontSize: fontSize.xs,
		textTransform: "uppercase",
		letterSpacing: letterSpacing.wider,
	},
	metaValue: {
		fontFamily: fonts.sansMedium,
		fontSize: fontSize.base,
	},
});
