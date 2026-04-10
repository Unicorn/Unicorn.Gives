import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
import {
	CategoryChips,
	EditorialCard,
	FeaturedEventCard,
	QuoteCallout,
} from "@/components/widgets";
import { RegionHeroSection } from "@/components/municipal/sections/RegionHeroSection";
import { EVENTS_TAB_HERO } from "@/constants/eventsTabContent";
import { COMMUNITY_SPIRIT_QUOTE } from "@/constants/hornContent";
import { fonts, spacing, useTheme } from "@/constants/theme";
import { eventDateBoxFromIso } from "@/lib/events/eventDateFormat";
import { routes } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";
import { EventCardList } from "./EventCardList";
import { EventGridCard } from "./EventGridCard";
import { EventsGrid } from "./EventsGrid";
import { ViewToggle, type ViewMode } from "./ViewToggle";
import type { EventItem } from "./eventTypes";

const CATEGORY_LABELS: Record<string, string> = {
	government: "Government",
	community: "Community",
	conservation: "Conservation",
	seniors: "Seniors",
	horn: "The Horn",
	"unicorn-gives": "Unicorn Gives",
	"the-mane": "The Mane",
};

type EventWithDesc = EventItem & { description?: string | null };

interface Props {
	regionId?: string;
}

export function EventsList({ regionId }: Props) {
	const [events, setEvents] = useState<EventWithDesc[]>([]);
	const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const { colors } = useTheme();

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		let query = supabase
			.from("events")
			.select(
				"id, slug, title, description, date, time, location, category, recurring, tags, image_url, featured",
			)
			.eq("status", "published")
			.gte("date", today);

		if (regionId) {
			query = query.eq("region_id", regionId);
		} else {
			query = query.in("visibility", ["global", "both"]);
		}

		query
			.order("date")
			.limit(50)
			.then(({ data }) => {
				if (data) setEvents(data);
			});
	}, [regionId]);

	const categories = [...new Set(events.map((e) => e.category))];
	const chipCategories = categories.map((key) => ({
		key,
		label: CATEGORY_LABELS[key] || key,
	}));

	const filtered = categoryFilter
		? events.filter((e) => e.category === categoryFilter)
		: events;

	const featuredEvents = categoryFilter
		? []
		: filtered.filter((e) => e.featured);
	const rest = categoryFilter
		? filtered
		: filtered.filter((e) => !e.featured);

	const DEFAULT_BADGE = { bg: colors.surfaceContainer, text: colors.neutral };

	const displayEvents = categoryFilter ? filtered : rest;

	return (
		<Wrapper style={styles.container}>
			{/* Full-bleed hero */}
			<RegionHeroSection
				eyebrow={EVENTS_TAB_HERO.eyebrow}
				headline={EVENTS_TAB_HERO.headline}
				headlineAccent={EVENTS_TAB_HERO.headlineAccent}
				subheadline={EVENTS_TAB_HERO.subheadline}
				imageUrl={EVENTS_TAB_HERO.imageUrl}
				primaryCta={{
					label: EVENTS_TAB_HERO.ctaLabel,
					url: routes.partners.index("the-horn") as string,
				}}
				secondaryCta={{
					label: EVENTS_TAB_HERO.secondaryCtaLabel,
					url: routes.community.index() as string,
				}}
			/>

			{/* Content */}
			<Container style={styles.section}>
					{/* Featured event hero(s) */}
					{featuredEvents.map((ev) => (
						<FeaturedEventCard key={ev.id} event={ev} />
					))}

					{/* Filters + view toggle */}
					<View style={styles.filterBlock}>
						<View style={styles.filterRow}>
							<Text style={[styles.sectionTitle, { color: colors.neutral }]}>
								Community Calendar
							</Text>
							<ViewToggle mode={viewMode} onToggle={setViewMode} />
						</View>
						{chipCategories.length > 1 && (
							<CategoryChips
								categories={chipCategories}
								selected={categoryFilter}
								onSelect={setCategoryFilter}
								allLabel="All Events"
							/>
						)}
						<Text style={[styles.count, { color: colors.neutralVariant }]}>
							{filtered.length} events
						</Text>
					</View>

					{/* Grid view */}
					{viewMode === "grid" ? (
						<EventsGrid>
							{displayEvents.map((e) => {
								const db = eventDateBoxFromIso(e.date);
								return (
									<EventGridCard
										key={e.id}
										title={e.title}
										description={e.description || undefined}
										location={e.location || undefined}
										imageUrl={e.image_url}
										dateLabel={`${db.month} ${db.day}`}
										href={routes.community.events.detail(e.slug)}
									/>
								);
							})}
						</EventsGrid>
					) : (
						/* List view (original layout) */
						<EventCardList>
							{displayEvents.map((e) => {
								const badge = DEFAULT_BADGE;
								return (
									<EditorialCard
										key={e.id}
										title={e.title}
										description={e.description || undefined}
										badge={{
											label: CATEGORY_LABELS[e.category] || e.category,
											bg: badge.bg,
											text: badge.text,
										}}
										href={routes.community.events.detail(e.slug)}
										meta={[e.time, e.location].filter(Boolean).join(" · ")}
										dateBox={eventDateBoxFromIso(e.date)}
										thumbnailUrl={e.image_url}
									/>
								);
							})}
						</EventCardList>
					)}

					{filtered.length === 0 && (
						<Text style={[styles.empty, { color: colors.neutralVariant }]}>
							No upcoming events.
						</Text>
					)}

					{/* Community quote */}
					{!categoryFilter && filtered.length > 0 && (
						<QuoteCallout
							quote={COMMUNITY_SPIRIT_QUOTE.quote}
							attribution={COMMUNITY_SPIRIT_QUOTE.attribution}
						/>
					)}
			</Container>
		</Wrapper>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	section: {
		paddingVertical: spacing.xxxl + spacing.lg,
		gap: spacing.xxl,
	},
	filterBlock: { gap: 8, zIndex: 1, position: "relative" },
	filterRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		flexWrap: "wrap",
		gap: spacing.md,
	},
	sectionTitle: {
		fontFamily: fonts.serifItalic,
		fontSize: 26,
	},
	count: {
		fontFamily: fonts.sans,
		fontSize: 13,
	},
	empty: {
		fontFamily: fonts.sans,
		textAlign: "center",
		marginTop: 40,
	},
});
