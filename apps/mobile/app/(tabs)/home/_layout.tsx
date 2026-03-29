import { Stack, usePathname } from "expo-router";
import { useMemo } from "react";
import { View } from "react-native";
import { AppHeader, AppBreadcrumbBar, type BreadcrumbItem } from "@/components/layout/AppHeader";
import { type SubTabItem, SubTabs } from "@/components/layout/SubTabs";
import { useTheme } from "@/constants/theme";
import { paths, toHref } from "@/lib/navigation";

const HOME_TABS: SubTabItem[] = [
	{ label: "Discover", href: toHref(paths.homeDiscover) },
	{ label: "Community", href: toHref(paths.community.index) },
	{ label: "History", href: toHref(paths.history.index) },
	{ label: "Events", href: toHref(paths.community.events) },
	{ label: "News", href: toHref(paths.community.news) },
];

function humanizeSlugSegment(segment: string): string {
	try {
		return decodeURIComponent(segment)
			.split(/[-_]+/g)
			.filter(Boolean)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ");
	} catch {
		return segment;
	}
}

/** Breadcrumb for Home stack detail routes (News / Events / History). */
function homeDetailBreadcrumb(pathname: string): BreadcrumbItem[] | undefined {
	const news = pathname.match(/^\/home\/news\/([^/]+)$/);
	if (news) {
		return [
			{ label: "Home", href: paths.homeDiscover },
			{ label: "News", href: paths.community.news },
			{ label: humanizeSlugSegment(news[1]), href: "" },
		];
	}
	const events = pathname.match(/^\/home\/events\/([^/]+)$/);
	if (events) {
		return [
			{ label: "Home", href: paths.homeDiscover },
			{ label: "Events", href: paths.community.events },
			{ label: humanizeSlugSegment(events[1]), href: "" },
		];
	}
	const history = pathname.match(/^\/home\/history\/([^/]+)$/);
	if (history) {
		return [
			{ label: "Home", href: paths.homeDiscover },
			{ label: "History", href: paths.history.index },
			{ label: humanizeSlugSegment(history[1]), href: "" },
		];
	}
	return undefined;
}

function shouldShowHomeSubTabs(pathname: string): boolean {
	return (
		pathname === "/" || pathname === "/home" || pathname.startsWith("/home/")
	);
}

export default function HomeLayout() {
	const pathname = usePathname();
	const { colors } = useTheme();
	const breadcrumb = useMemo(() => homeDetailBreadcrumb(pathname), [pathname]);
	const showSubTabs = shouldShowHomeSubTabs(pathname);

	return (
		<View style={{ flex: 1, backgroundColor: colors.background }}>
			<AppHeader />
			{showSubTabs && <SubTabs tabs={HOME_TABS} />}
			{breadcrumb && breadcrumb.length > 0 && <AppBreadcrumbBar items={breadcrumb} />}
			<Stack screenOptions={{ headerShown: false }} />
		</View>
	);
}
