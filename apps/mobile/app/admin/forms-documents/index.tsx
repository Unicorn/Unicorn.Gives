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

interface FormsDocumentRow {
	id: string;
	title: string;
	document_type: string;
	file_format: string;
	department_id: string;
	is_current: boolean;
	status: string;
}

const STATUS_OPTIONS = [
	{ label: "All Status", value: "" },
	{ label: "Draft", value: "draft" },
	{ label: "Published", value: "published" },
	{ label: "Archived", value: "archived" },
];

const DOC_TYPE_OPTIONS = [
	{ label: "All Types", value: "" },
	{ label: "Form", value: "form" },
	{ label: "Permit", value: "permit" },
	{ label: "Application", value: "application" },
	{ label: "Policy", value: "policy" },
	{ label: "Plan", value: "plan" },
	{ label: "Report", value: "report" },
	{ label: "Brochure", value: "brochure" },
	{ label: "Guide", value: "guide" },
	{ label: "Template", value: "template" },
	{ label: "Other", value: "other" },
];

export default function FormsDocumentsListPage() {
	const router = useRouter();
	const { colors } = useTheme();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [deleteTarget, setDeleteTarget] = useState<FormsDocumentRow | null>(null);

	const filters: Record<string, string> = {};
	if (typeFilter) filters.document_type = typeFilter;

	const { data, loading, error, total, pageSize, refresh } =
		useAdminQuery<FormsDocumentRow>("forms_documents", {
			select: "id, title, document_type, file_format, department_id, is_current, status",
			orderBy: "created_at",
			ascending: false,
			page,
			pageSize: 25,
			filters,
			status: statusFilter || undefined,
			search: search ? { title: search } : {},
		});

	const { remove } = useAdminMutation("forms_documents");

	const columns: Column<FormsDocumentRow>[] = [
		{
			key: "title",
			label: "Title",
			render: (row) => (
				<Text style={styles.nameCell} numberOfLines={1}>
					{row.title}
				</Text>
			),
		},
		{ key: "document_type", label: "Type", width: 120 },
		{ key: "file_format", label: "Format", width: 80 },
		{ key: "department_id", label: "Department", width: 130 },
		{
			key: "is_current",
			label: "Current",
			width: 80,
			render: (row) => (
				<Text style={styles.dateCell}>{row.is_current ? "Yes" : "No"}</Text>
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
			title="Forms & Documents"
			subtitle={`${total} total documents`}
			actions={
				<AdminButton
					label="New Document"
					icon="add"
					onPress={() => router.push(toHref("/admin/forms-documents/new"))}
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
					placeholder="Search documents..."
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
						{DOC_TYPE_OPTIONS.map((o) => (
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
				onRowPress={(row) => router.push(toHref(`/admin/forms-documents/${row.id}`))}
				emptyMessage="No documents found"
			/>

			<AdminConfirmDialog
				visible={!!deleteTarget}
				title="Delete Document"
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
