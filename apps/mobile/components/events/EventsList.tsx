import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
import {
	CategoryChips,
	EditorialCard,
	FeaturedEventCard,
	HeroFeature,
	QuoteCallout,
} from "@/components/widgets";
import { EVENTS_TAB_HERO } from "@/constants/eventsTabContent";
import { COMMUNITY_SPIRIT_QUOTE } from "@/constants/hornContent";
import { fonts, spacing, useTheme } from "@/constants/theme";
import { eventDateBoxFromIso } from "@/lib/events/eventDateFormat";
import { routes } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";
import { EventCardList } from "./EventCardList";
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

// All category badges use neutral styling per design system rules

type EventWithDesc = EventItem & { description?: string | null };

interface Props {
	regionId?: string;
}

export function EventsList({ regionId }: Props) {
	const [events, setEvents] = useState<EventWithDesc[]>([]);
	const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
	const { colors } = useTheme();

	useEffect(() => {
		let query = supabase
			.from("events")
			.select(
				"id, slug, title, description, date, time, location, category, recurring, tags, image_url",
			)
			.eq("status", "published");

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

	const [featured, ...rest] = filtered;

	const DEFAULT_BADGE = { bg: colors.surfaceContainer, text: colors.neutral };

	return (
		<Wrapper style={styles.container} contentContainerStyle={styles.content}>
			<Container>
				<View style={styles.stack}>
					<HeroFeature
						eyebrow={EVENTS_TAB_HERO.eyebrow}
						title={EVENTS_TAB_HERO.title}
						description={EVENTS_TAB_HERO.description}
						ctaLabel={EVENTS_TAB_HERO.ctaLabel}
						ctaHref={routes.partners.index("the-horn")}
						secondaryCta={{
							label: EVENTS_TAB_HERO.secondaryCtaLabel,
							href: routes.community.index(),
						}}
					/>

					{/* Featured event hero */}
					{featured && !categoryFilter && (
						<FeaturedEventCard event={featured} />
					)}

					{/* Filters */}
					<View style={styles.section}>
						<Text style={[styles.sectionTitle, { color: colors.neutral }]}>
							Community Calendar
						</Text>
						{chipCategories.length > 1 && (
							<CategoryChips
								categories={chipCategories}
								selected={categoryFilter}
								onSelect={setCategoryFilter}
								allLabel="All Events"
							/>
						)}
						<Text style={[styles.count, { color: colors.neutralVariant }]}>
							{categoryFilter ? filtered.length : rest.length} events
						</Text>
					</View>

					{/* Event list — full-width rows */}
					<EventCardList>
						{(categoryFilter ? filtered : rest).map((e) => {
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
				</View>
			</Container>
		</Wrapper>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: { padding: spacing.lg, paddingBottom: 40 },
	stack: { width: "100%", gap: spacing.xxxl + spacing.sm },
	section: { gap: 8, zIndex: 1, position: "relative" },
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
