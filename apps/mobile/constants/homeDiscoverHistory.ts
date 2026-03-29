/**
 * Tier 0 home copy: Discover + History narratives and citable sources.
 * Historical claims should stay aligned with linked references where noted.
 */

import type { LoreSlug } from "@/lib/lore";

export type LoreTeaser = {
	slug: LoreSlug;
	title: string;
	kind: "legend" | "tradition" | "story";
	blurb: string;
};

export type HistoryCitation = {
	title: string;
	url: string;
	note?: string;
};

export const DISCOVER_TAGLINE = "Where the North Begins";

export type HomeParagraph = { id: string; text: string };

export const DISCOVER_PARAGRAPHS: HomeParagraph[] = [
	{
		id: "discover-upnorth",
		text: "Ask anyone who grew up in Michigan what they mean when they say they are going Up North, and you will get a feeling before you get a definition. Pine resin and lake water. Gravel roads without names. The moment the cell signal drops and you exhale. It is a place as much as it is a state of mind — wild, unhurried, and older than anyone living can fully account for.",
	},
	{
		id: "discover-threshold",
		text: "Clare County sits at the boundary. It is where Northern Michigan actually begins — a phrase the county has used officially for decades. US-127 and US-10 cross here, the pines deepen here, the density thins here. This is the threshold.",
	},
	{
		id: "discover-mission",
		text: "unicorn.gives exists because Clare County residents — and northern Michigan residents broadly — deserve one trustworthy place to get practical answers. The digital patchwork of outdated sites, paywalled news, and scattered agency pages does not talk to itself. We are building one platform for every municipality, starting here, with room to grow across the north.",
	},
];

export const DISCOVER_MISSION_LEDE =
	"Become the most useful, most trusted civic resource in Clare County: a universal app you can carry in your pocket and consult before you call the township office.";

export const HOME_BENTO_REGION_TITLE = "Around the region";

export const HOME_BENTO_SOLVE_TITLE = "Problem solver";
export const HOME_BENTO_SOLVE_DESC =
	"Get practical answers for property, taxes, safety, and civic services — start with the categories that match what you need.";

export const HOME_BENTO_GOV_TITLE = "Government";
export const HOME_BENTO_GOV_DESC =
	"County and local offices: minutes, ordinances, contacts, and regional updates.";

export const HOME_BENTO_EVENTS_TITLE = "Events calendar";
export const HOME_BENTO_EVENTS_EMPTY =
	"No upcoming events in the feed right now.";

export const HOME_BENTO_NEWS_TITLE = "Latest news";

export const HOME_NEWSLETTER_TITLE = "Stay in the loop";
export const HOME_NEWSLETTER_BODY =
	"Civic updates, events, and community stories from the north — pick up the latest from our news feed anytime.";
export const HOME_NEWSLETTER_CTA_PRIMARY = "Open latest news";
export const HOME_NEWSLETTER_CTA_EXTERNAL = "Subscribe";
export const HOME_NEWSLETTER_EMAIL_PLACEHOLDER = "Email address";
export const HOME_NEWSLETTER_SUBSCRIBE_BUTTON = "Subscribe";
export const HOME_NEWSLETTER_SUBSCRIBE_HELPER =
	"We will open your signup page or mail app. You can also browse the news feed anytime.";

export const HOME_HERO_IMPACT_LABEL = "Local impact";

/** Short county + place context on the home screen (paraphrased; see citations on History). */
export const HOME_HISTORY_SECTION_TITLE = "Land & lore";
export const HOME_HISTORY_TEASER: HomeParagraph[] = [
	{
		id: "home-history-anishinaabe",
		text: "Before township lines were drawn, this region was Anishinaabe homelands. The stories we tell here sit alongside treaties, records, and living communities — folklore for curiosity, sources for facts.",
	},
	{
		id: "home-history-county",
		text: "Clare County was organized from Michigan territory in the 1840s, renamed for Irish County Clare, and has grown with lumber, farms, and forest. Harrison is the county seat; US-127 and US-10 cross here, tying the county to the rest of the Lower Peninsula.",
	},
	{
		id: "home-history-north",
		text: "Roughly five hundred seventy-five square miles of woods, lakes, and townships sit in both Northern and Central Michigan — a rural crossroads where unicorn.gives is building one trustworthy civic hub, starting local with room to grow.",
	},
];

export const HOME_HISTORY_CTA_LABEL = "Read land & lore";

export const HISTORY_TAB_HERO = {
	eyebrow: "Tier zero",
	title: "Land & lore",
	description:
		"Stories, traditions, and histories beneath the county lines. Read as folklore and teaching, not as a substitute for science or tribal authority.",
	ctaLabel: "Open the Dogman legend",
	secondaryCtaLabel: "Anishinaabe roots",
} as const;

export const HISTORY_INTRO_PARAGRAPHS: HomeParagraph[] = [
	{
		id: "history-anishinaabe",
		text: "Before the county existed, before the township lines were drawn, this land was Anishinaabe territory. The Ojibwe, Odawa, and Potawatomi — often described together as the Council of Three Fires — maintained relationships with the Great Lakes homelands for generations. They traveled the inland waterways, fished, harvested, and wintered in the pines. Their presence is still echoed in river names, lake names, and the way certain clearings feel watched.",
	},
	{
		id: "history-county",
		text: "Clare County was created by the Michigan Legislature in 1840 and was first named Kaykakee County, then renamed Clare County in 1843 for County Clare in Ireland — reflecting Irish settlers who followed the lumber economy north. Farwell served as the first county seat; Harrison has been the seat since 1877. The county covers about 575 square miles, bordered by Missaukee, Roscommon, Gladwin, Midland, Isabella, Mecosta, and Osceola counties.",
	},
	{
		id: "history-treaty",
		text: "The 1836 Treaty of Washington is one of the agreements through which the United States gained title to large areas of Michigan. Later treaties and policies reorganized reserved lands and rights. On paper, land changed hands; communities and memories did not. Today, respect for treaty rights and tribal sovereignty remains part of an honest civic story.",
	},
];

export const HISTORY_LORE_TEASERS: LoreTeaser[] = [
	{
		slug: "dogman",
		title: "The Dogman",
		kind: "legend",
		blurb:
			"A Michigan folktale of a tall, howling figure along northern woods and rivers. Popular retellings accelerated after 1987 radio airplay — the stories are culture and mystery, not field guides.",
	},
	{
		slug: "memegwesiwak",
		title: "The Memegwesiwak",
		kind: "tradition",
		blurb:
			"River-dwelling little people in Anishinaabe tradition — tied to respect for waterways and the beings said to share them. European observers recorded tobacco offerings at river rocks centuries ago.",
	},
	{
		slug: "mishibizhiw",
		title: "Mishibizhiw",
		kind: "tradition",
		blurb:
			"The underwater panther or great lynx of the lakes — a powerful guardian figure in Ojibwe narrative, paired in story with thunder beings. It is one way deep water was understood, not a swimming hazard chart.",
	},
	{
		slug: "anishinaabe",
		title: "Anishinaabe roots",
		kind: "story",
		blurb:
			"Three Fires, homelands, and treaties — a short introduction to why land acknowledgment and treaty learning belong on a civic platform for this region.",
	},
];

export const HISTORY_UNICORN_CALLOUT = {
	label: "Why the unicorn",
	body: "The unicorn is a creature of thresholds. It appears in the wild, evades capture, and feels both real and impossible depending on who you ask — and whether they have spent enough time in deep woods at dusk. For a community that refuses to be ordinary, it is a better mascot than anything on a seal.",
};

export const HISTORY_SOURCES_INTRO =
	"These links are starting points for verification and deeper reading. Folklore is labeled as story; government and archival sites ground dates and treaties.";

export const HISTORY_CITATIONS: HistoryCitation[] = [
	{
		title: "Wikipedia — Clare County, Michigan (general reference)",
		url: "https://en.wikipedia.org/wiki/Clare_County,_Michigan",
		note: "Geography, municipalities, and county overview; verify dates and figures against primary sources.",
	},
	{
		title: "Clare County — local history overview",
		url: "https://www.clarecounty.net/history.html",
		note: "County visitor/history page; cross-check dates with primary sources.",
	},
	{
		title: "Library of Michigan — Clare County guide",
		url: "https://www.michigan.gov/libraryofmichigan/public/michigan/county-guides/guides/clare",
	},
	{
		title: "Michiganology — Michigan history archives & research",
		url: "https://www.michiganology.org/",
		note: "Statewide digitized records and research hub.",
	},
	{
		title:
			"Library of Congress — Treaty with the Ottawa and Chippewa, 1836 (printed text)",
		url: "https://www.loc.gov/item/2021667584/",
	},
	{
		title: "Digital Treaties — Ratified treaty record, March 28, 1836",
		url: "https://digitreaties.org/treaties/treaty/198249818/",
	},
	{
		title: "Smithsonian — Native Knowledge 360° (educational hub)",
		url: "https://americanindian.si.edu/nk360",
		note: "Classroom resources; search for lessons on treaties and Great Lakes nations.",
	},
	{
		title: "Great Lakes Indian Fish & Wildlife Commission",
		url: "https://www.glifwc.org/",
		note: "Tribal natural-resource co-management context for the Upper Great Lakes.",
	},
	{
		title: "Wikipedia — Michigan Dogman",
		url: "https://en.wikipedia.org/wiki/Michigan_Dogman",
		note: "Encyclopedic summary of the modern legend; not a scientific source.",
	},
];
