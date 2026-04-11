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

interface FacilityRow {
	id: string;
	name: string;
	facility_type: string;
	address: string;
	rental_available: boolean;
	status: string;
}

const STATUS_OPTIONS = [
	{ label: "All Status", value: "" },
	{ label: "Draft", value: "draft" },
	{ label: "Published", value: "published" },
	{ label: "Archived", value: "archived" },
];

const FACILITY_TYPE_OPTIONS = [
	{ label: "All Types", value: "" },
	{ label: "Park", value: "park" },
	{ label: "Building", value: "building" },
	{ label: "Field", value: "field" },
	{ label: "Pavilion", value: "pavilion" },
	{ label: "Trail", value: "trail" },
	{ label: "Pool", value: "pool" },
	{ label: "Cemetery", value: "cemetery" },
	{ label: "Airport", value: "airport" },
	{ label: "Other", value: "other" },
];

export default function FacilitiesListPage() {
	const router = useRouter();
	const { colors } = useTheme();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [deleteTarget, setDeleteTarget] = useState<FacilityRow | null>(null);

	const filters: Record<string, string> = {};
	if (typeFilter) filters.facility_type = typeFilter;

	const { data, loading, error, total, pageSize, refresh } =
		useAdminQuery<FacilityRow>("facilities", {
			select: "id, name, facility_type, address, rental_available, status",
			orderBy: "display_order",
			ascending: true,
			page,
			pageSize: 25,
			filters,
			status: statusFilter || undefined,
			search: search ? { name: search } : {},
		});

	const { remove } = useAdminMutation("facilities");

	const columns: Column<FacilityRow>[] = [
		{
			key: "name",
			label: "Name",
			render: (row) => (
				<Text style={styles.nameCell} numberOfLines={1}>
					{row.name}
				</Text>
			),
		},
		{ key: "facility_type", label: "Type", width: 110 },
		{
			key: "address",
			label: "Address",
			width: 200,
			render: (row) => (
				<Text style={styles.dateCell} numberOfLines={1}>
					{row.address || "—"}
				</Text>
			),
		},
		{
			key: "rental_available",
			label: "Rental",
			width: 80,
			render: (row) => (
				<Text style={styles.dateCell}>{row.rental_available ? "Yes" : "No"}</Text>
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
			title="Facilities"
			subtitle={`${total} total facilities`}
			actions={
				<AdminButton
					label="New Facility"
					icon="add"
					onPress={() => router.push(toHref("/admin/facilities/new"))}
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
					placeholder="Search facilities..."
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
						{FACILITY_TYPE_OPTIONS.map((o) => (
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
				onRowPress={(row) => router.push(toHref(`/admin/facilities/${row.id}`))}
				emptyMessage="No facilities found"
			/>

			<AdminConfirmDialog
				visible={!!deleteTarget}
				title="Delete Facility"
				message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
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
