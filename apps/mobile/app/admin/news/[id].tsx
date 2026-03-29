import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Platform,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminButton, AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminPreviewLink } from "@/components/admin/AdminPreviewLink";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
	EMPTY_NEWS,
	NewsForm,
	type NewsFormData,
} from "@/components/admin/NewsForm";
import { fonts, type ThemeColors, useTheme } from "@/constants/theme";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { getContentPreviewUrl } from "@/lib/admin/contentPreview";
import { paths, routes } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";

export default function EditNewsPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { colors } = useTheme();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const {
		update,
		remove,
		publish,
		unpublish,
		archive,
		loading: mutating,
	} = useAdminMutation("news");
	const [form, setForm] = useState<NewsFormData>({ ...EMPTY_NEWS });
	const [status, setStatus] = useState("draft");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(true);
	const [showDelete, setShowDelete] = useState(false);

	useEffect(() => {
		if (!id) return;
		supabase
			.from("news")
			.select("*")
			.eq("id", id)
			.single()
			.then(({ data, error }) => {
				if (error || !data) {
					setLoading(false);
					return;
				}
				setForm({
					title: data.title ?? "",
					slug: data.slug ?? "",
					description: data.description ?? "",
					body: data.body ?? "",
					date: data.date ?? "",
					category: data.category ?? "community",
					visibility: data.visibility ?? "global",
					author_name: data.author_name ?? "",
					source: data.source ?? "",
					source_url: data.source_url ?? "",
					image_url: data.image_url ?? "",
					featured: data.featured ?? false,
					impact: data.impact ?? "",
					region_id: data.region_id ?? "",
					partner_id: data.partner_id ?? "",
				});
				setStatus(data.status ?? "draft");
				setLoading(false);
			});
	}, [id]);

	function validate(): boolean {
		const errs: Record<string, string> = {};
		if (!form.title.trim()) errs.title = "Title is required";
		if (!form.date) errs.date = "Date is required";
		if (!form.category) errs.category = "Category is required";
		if (!form.body.trim()) errs.body = "Body is required";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	}

	async function handleSave() {
		if (!validate() || !id) return;

		const payload: Record<string, unknown> = {
			title: form.title.trim(),
			slug: form.slug,
			description: form.description || null,
			body: form.body,
			date: form.date,
			category: form.category,
			visibility: form.visibility,
			author_name: form.author_name || null,
			source: form.source || null,
			source_url: form.source_url || null,
			image_url: form.image_url || null,
			featured: form.featured,
			impact: form.impact || null,
			region_id: form.region_id || null,
			partner_id: form.partner_id || null,
		};

		const success = await update(id, payload);
		if (success && Platform.OS === "web") {
			window.alert("Article saved successfully.");
		}
	}

	async function handlePublish() {
		if (!id) return;
		const success = await publish(id);
		if (success) setStatus("published");
	}

	async function handleUnpublish() {
		if (!id) return;
		const success = await unpublish(id);
		if (success) setStatus("draft");
	}

	async function handleArchive() {
		if (!id) return;
		const success = await archive(id);
		if (success) setStatus("archived");
	}

	async function handleDelete() {
		if (!id) return;
		const success = await remove(id);
		if (success) {
			router.replace(routes.admin.newsIndex());
		}
		setShowDelete(false);
	}

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator color={colors.primary} />
				<Text style={styles.loadingText}>Loading article…</Text>
			</View>
		);
	}

	return (
		<AdminPageShell
			title="Edit Article"
			backHref={paths.admin.news}
			actions={
				<>
					<AdminPreviewLink href={getContentPreviewUrl('news', { slug: form.slug })} />
					<AdminStatusBadge status={status} />
					{status === "draft" && (
						<AdminButton
							label="Publish"
							icon="publish"
							onPress={handlePublish}
							disabled={mutating}
						/>
					)}
					{status === "published" && (
						<AdminButton
							label="Unpublish"
							variant="secondary"
							icon="unpublished"
							onPress={handleUnpublish}
							disabled={mutating}
						/>
					)}
					{status !== "archived" && (
						<AdminButton
							label="Archive"
							variant="secondary"
							icon="archive"
							onPress={handleArchive}
							disabled={mutating}
						/>
					)}
					<AdminButton
						label="Save"
						icon="save"
						onPress={handleSave}
						disabled={mutating}
					/>
					<AdminButton
						label="Delete"
						variant="danger"
						icon="delete"
						onPress={() => setShowDelete(true)}
						disabled={mutating}
					/>
				</>
			}
		>
			<NewsForm data={form} onChange={setForm} errors={errors} />

			<AdminConfirmDialog
				visible={showDelete}
				title="Delete Article"
				message={`Are you sure you want to permanently delete "${form.title}"? This cannot be undone.`}
				confirmLabel="Delete"
				variant="danger"
				onConfirm={handleDelete}
				onCancel={() => setShowDelete(false)}
			/>
		</AdminPageShell>
	);
}

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		loadingContainer: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			gap: 12,
		},
		loadingText: {
			fontFamily: fonts.sans,
			fontSize: 14,
			color: colors.neutralVariant,
		},
	});
