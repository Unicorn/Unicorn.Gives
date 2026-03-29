import { useEffect, useMemo, useState } from "react";
import {
	Image,
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";
import { radii, useTheme } from "@/constants/theme";
import { resolveAbsoluteAssetUrl } from "@/lib/resolveAssetUrl";

const CARD_STRIP_HEIGHT = 140;

export type ContentCoverVariant = "hero" | "card";

export interface ContentCoverImageProps {
	/** Raw path or URL from CMS / Supabase */
	imageUrl?: string | null;
	variant: ContentCoverVariant;
	accessibilityLabel: string;
	style?: StyleProp<ViewStyle>;
}

/**
 * Resolved cover image for news/events. Renders nothing when URL is empty or load fails.
 */
export function ContentCoverImage({
	imageUrl,
	variant,
	accessibilityLabel,
	style,
}: ContentCoverImageProps) {
	const { colors } = useTheme();
	const [failed, setFailed] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: clear load error when the stored URL changes
	useEffect(() => {
		setFailed(false);
	}, [imageUrl]);

	const uri = useMemo(() => {
		if (failed || imageUrl == null || !String(imageUrl).trim()) {
			return null;
		}
		return resolveAbsoluteAssetUrl(String(imageUrl));
	}, [imageUrl, failed]);

	if (!uri) {
		return null;
	}

	const frameStyle =
		variant === "hero"
			? [
					styles.heroFrame,
					{
						backgroundColor: colors.surfaceContainer,
						borderColor: colors.outline,
					},
				]
			: [
					styles.cardFrame,
					{
						backgroundColor: colors.surfaceContainer,
						borderBottomColor: colors.outline,
					},
				];

	return (
		<View style={[frameStyle, style]}>
			<Image
				source={{ uri }}
				style={variant === "hero" ? styles.heroImage : styles.cardImage}
				resizeMode="cover"
				accessibilityLabel={accessibilityLabel}
				onError={() => setFailed(true)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	heroFrame: {
		width: "100%",
		aspectRatio: 16 / 9,
		borderRadius: radii.lg,
		borderWidth: 1,
		overflow: "hidden",
	},
	heroImage: {
		...StyleSheet.absoluteFillObject,
		width: "100%",
		height: "100%",
	},
	cardFrame: {
		width: "100%",
		height: CARD_STRIP_HEIGHT,
		borderBottomWidth: 1,
		overflow: "hidden",
	},
	cardImage: {
		width: "100%",
		height: "100%",
	},
});
