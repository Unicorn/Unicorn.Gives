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
import { toHref } from "@/lib/navigation";

interface PublicNoticeRow {
	id: string;
	title: string;
	notice_type: string;
	severity: string;
	expiration_date: string;
	is_pinned: boolean;
	status: string;
}

const STATUS_OPTIONS = [
	{ label: "All Status", value: "" },
	{ label: "Draft", value: "draft" },
	{ label: "Published", value: "published" },
	{ label: "Archived", value: "archived" },
];

const NOTICE_TYPE_OPTIONS = [
	{ label: "All Types", value: "" },
	{ label: "General", value: "general" },
	{ label: "Public Hearing", value: "public_hearing" },
	{ label: "RFP", value: "rfp" },
	{ label: "Bid Request", value: "bid_request" },
	{ label: "Emergency Alert", value: "emergency_alert" },
	{ label: "Water Advisory", value: "water_advisory" },
	{ label: "Road Closure", value: "road_closure" },
	{ label: "Election Notice", value: "election_notice" },
];

export default function PublicNoticesListPage() {
	const router = useRouter();
	const { colors } = useTheme();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [deleteTarget, setDeleteTarget] = useState<PublicNoticeRow | null>(null);

	const filters: Record<string, string> = {};
	if (typeFilter) filters.notice_type = typeFilter;

	const { data, loading, error, total, pageSize, refresh } =
		useAdminQuery<PublicNoticeRow>("public_notices", {
			select: "id, title, notice_type, severity, expiration_date, is_pinned, status",
			orderBy: "created_at",
			ascending: false,
			page,
			pageSize: 25,
			filters,
			status: statusFilter || undefined,
			search: search ? { title: search } : {},
		});

	const { remove } = useAdminMutation("public_notices");

	const columns: Column<PublicNoticeRow>[] = [
		{
			key: "title",
			label: "Title",
			render: (row) => (
				<Text style={styles.nameCell} numberOfLines={1}>
					{row.title}
				</Text>
			),
		},
		{ key: "notice_type", label: "Type", width: 130 },
		{ key: "severity", label: "Severity", width: 100 },
		{
			key: "expiration_date",
			label: "Expires",
			width: 110,
			render: (row) => (
				<Text style={styles.dateCell}>
					{row.expiration_date
						? new Date(`${row.expiration_date}T00:00:00`).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
						  })
						: "—"}
				</Text>
			),
		},
		{
			key: "is_pinned",
			label: "Pinned",
			width: 70,
			render: (row) => (
				<Text style={styles.dateCell}>{row.is_pinned ? "Yes" : "No"}</Text>
			),
		},
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
			title="Public Notices"
			subtitle={`${total} total notices`}
			actions={
				<AdminButton
					label="New Notice"
					icon="add"
					onPress={() => router.push(toHref("/admin/public-notices/new"))}
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
					placeholder="Search notices..."
					placeholderTextColor={colors.outlineVariant}
				/>
				<View style={styles.selectWrap}>
					<select
						value={typeFilter}
						onChange={(e: { target: { value: string } }) => {
							setTypeFilter(e.target.value);
							setPage(1);
						}}
						style={selectStyle(colors)}
					>
						{NOTICE_TYPE_OPTIONS.map((o) => (
							<option key={o.value} value={o.value}>
								{o.label}
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
				onRowPress={(row) => router.push(toHref(`/admin/public-notices/${row.id}`))}
				emptyMessage="No public notices found"
			/>

			<AdminConfirmDialog
				visible={!!deleteTarget}
				title="Delete Notice"
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
		nameCell: {
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
