import { Stack } from "expo-router";
import { RequireModule } from "@/lib/routeGuards";

export default function NewsLayout() {
	return (
		<RequireModule module="community">
			<Stack screenOptions={{ headerShown: false }} />
		</RequireModule>
	);
}
