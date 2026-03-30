import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminDataTable, type Column } from "@/components/admin/AdminDataTable";
import { AdminButton, AdminPageShell } from "@/components/admin/AdminPageShell";
import {
	fonts,
	radii,
	spacing,
	type ThemeColors,
	useTheme,
} from "@/constants/theme";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { useAdminQuery } from "@/hooks/useAdminQuery";
import { useCategories } from "@/hooks/useCategories";
import { routes } from "@/lib/navigation";

interface NewsRow {
	id: string;
	slug: string;
	title: string;
	date: string;
	category: string;
	status: string;
	visibility: string;
	created_at: string;
}

const STATUS_OPTIONS = [
	{ label: "All Status", value: "" },
	{ label: "Draft", value: "draft" },
	{ label: "Published", value: "published" },
	{ label: "Archived", value: "archived" },
];

export default function NewsListPage() {
	const router = useRouter();
	const { colors } = useTheme();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [deleteTarget, setDeleteTarget] = useState<NewsRow | null>(null);
	const { categories: newsCategories } = useCategories('news');
	const categoryFilterOptions = [{ label: 'All Categories', value: '' }, ...newsCategories];

	const filters: Record<string, string> = {};
	if (categoryFilter) filters.category = categoryFilter;

	const { data, loading, error, total, pageSize, refresh } =
		useAdminQuery<NewsRow>("news", {
			select: "id, slug, title, date, category, status, visibility, created_at",
			orderBy: "date",
			ascending: false,
			page,
			pageSize: 25,
			filters,
			status: statusFilter || undefined,
			search: search ? { title: search } : {},
		});

	const { remove } = useAdminMutation("news");

	const columns: Column<NewsRow>[] = [
		{
			key: "title",
			label: "Title",
			render: (row) => (
				<Text style={styles.titleCell} numberOfLines={1}>
					{row.title}
				</Text>
			),
		},
		{
			key: "date",
			label: "Date",
			width: 110,
			render: (row) => (
				<Text style={styles.dateCell}>
					{new Date(`${row.date}T00:00:00`).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</Text>
			),
		},
		{ key: "category", label: "Category", width: 140 },
		{ key: "status", label: "Status", width: 100, isStatus: true },
		{
			key: "actions",
			label: "",
			width: 40,
			render: (row) => (
				<Pressable
					onPress={(e) => {
						e.stopPropagation();
						setDeleteTarget(row);
					}}
				>
					<MaterialIcons name="delete-outline" size={18} color={colors.error} />
				</Pressable>
			),
		},
	];

	async function handleDelete() {
		if (!deleteTarget) return;
		const success = await remove(deleteTarget.id);
		if (success) refresh();
		setDeleteTarget(null);
	}

	return (
		<AdminPageShell
			title="News"
			subtitle={`${total} total articles`}
			actions={
				<AdminButton
					label="New Article"
					icon="add"
					onPress={() => router.push(routes.admin.newNews())}
				/>
			}
		>
			<View style={styles.filtersRow}>
				<TextInput
					style={styles.searchInput}
					value={search}
					onChangeText={(text) => {
						setSearch(text);
						setPage(1);
					}}
					placeholder="Search articles…"
					placeholderTextColor={colors.outlineVariant}
				/>
				<View style={styles.selectWrap}>
					<select
						value={categoryFilter}
						onChange={(e: { target: { value: string } }) => {
							setCategoryFilter(e.target.value);
							setPage(1);
						}}
						style={selectStyle(colors)}
					>
						{categoryFilterOptions.map((c) => (
							<option key={c.value} value={c.value}>
								{c.label}
							</option>
						))}
					</select>
				</View>
				<View style={styles.selectWrap}>
					<select
						value={statusFilter}
						onChange={(e: { target: { value: string } }) => {
							setStatusFilter(e.target.value);
							setPage(1);
						}}
						style={selectStyle(colors)}
					>
						{STATUS_OPTIONS.map((s) => (
							<option key={s.value} value={s.value}>
								{s.label}
							</option>
						))}
					</select>
				</View>
			</View>

			<AdminDataTable
				columns={columns}
				data={data}
				loading={loading}
				error={error}
				total={total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onRowPress={(row) => router.push(routes.admin.editNews(row.id))}
				emptyMessage="No articles found"
			/>

			<AdminConfirmDialog
				visible={!!deleteTarget}
				title="Delete Article"
				message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
				confirmLabel="Delete"
				variant="danger"
				onConfirm={handleDelete}
				onCancel={() => setDeleteTarget(null)}
			/>
		</AdminPageShell>
	);
}

function selectStyle(colors: ThemeColors) {
	return {
		padding: "8px 12px",
		fontSize: 13,
		fontFamily: "inherit",
		border: "none",
		backgroundColor: "transparent",
		color: colors.neutral,
		outline: "none",
		cursor: "pointer",
		width: "100%",
	};
}

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		filtersRow: {
			flexDirection: "row",
			gap: spacing.sm,
			marginBottom: spacing.lg,
			flexWrap: "wrap",
		},
		searchInput: {
			flex: 1,
			minWidth: 200,
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.outline,
			borderRadius: radii.sm,
			paddingHorizontal: spacing.md,
			paddingVertical: 8,
			fontFamily: fonts.sans,
			fontSize: 13,
			color: colors.neutral,
		},
		selectWrap: {
			backgroundColor: colors.surface,
			borderWidth: 1,
			borderColor: colors.outline,
			borderRadius: radii.sm,
			overflow: "hidden",
			minWidth: 140,
		},
		titleCell: {
			fontFamily: fonts.sansMedium,
			fontSize: 13,
			color: colors.neutral,
		},
		dateCell: {
			fontFamily: fonts.sans,
			fontSize: 13,
			color: colors.neutralVariant,
		},
	});
