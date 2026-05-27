import type { CompetitionInterface } from "api/competitions";
import { updateCompetition } from "api/competitions";
import type React from "react";
import { useState } from "react";
import { CompetitionTypeDisplay } from "../../api/interfaces/competitions";
import { useToastStore } from "../../api/stores/useToastStore";

// import CustomSelect from '../shared/CustomSelect'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
	<div className="space-y-1.5">
		<label className="block text-sm font-bold text-gray-900">{label}</label>
		{children}
	</div>
);

const inputCls = (readOnly?: boolean) =>
	`w-full px-2.5 py-1.5 border border-gray-300 rounded-md 
   text-sm font-medium focus:ring-2 
   focus:ring-green-900 focus:border-green-900 ${readOnly ? "bg-gray-50 text-gray-700" : "text-gray-900"}`;

const Toggle = ({
	label,
	description,
	checked,
	onChange,
	disabled,
}: {
	label: string;
	description?: string;
	checked: boolean;
	onChange: () => void;
	disabled?: boolean;
}) => (
	<div className="flex items-center justify-between py-2.5 border-b last:border-0">
		<div>
			<p className="text-sm font-semibold text-gray-900">{label}</p>
			{description && <p className="text-xs font-medium text-gray-600">{description}</p>}
		</div>
		<button
			type="button"
			onClick={onChange}
			disabled={disabled}
			className={`relative inline-flex h-5 w-10 items-center 
                   rounded-full transition-colors disabled:opacity-50 ${checked ? "bg-green-400" : "bg-gray-300"}`}
		>
			<span
				className={`inline-block h-3.5 w-3.5 rounded-full bg-white 
                     transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
			/>
		</button>
	</div>
);

const SectionHeader = ({ label }: { label: string }) => (
	<p className="text-sm font-bold text-gray-900 mb-2.5 pb-1.5 border-b border-gray-300">{label}</p>
);

const StatusBadge = ({ status }: { status: string }) => {
	const styles: Record<string, string> = {
		inactive: "bg-yellow-50 text-yellow-800 border-yellow-200",
		active: "bg-green-50 text-green-800 border-green-200",
		completed: "bg-gray-100 text-gray-700 border-gray-300",
	};
	const labels: Record<string, string> = {
		inactive: "⏳ Inactive",
		active: "🟢 Active",
		completed: "✅ Completed",
	};
	return (
		<span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${styles[status] ?? styles.inactive}`}>
			{labels[status] ?? status}
		</span>
	);
};

// ─── Props ─────────────────────────────────────────────────────────────────────

interface CompetitionSettingsProps {
	competition: CompetitionInterface;
	onCompetitionChange: (updated: CompetitionInterface) => void;
}

// ─── Main Component ────────────────────────────────────────────────────────────

const CompetitionSettings = ({ competition, onCompetitionChange }: CompetitionSettingsProps) => {
	const { showToast } = useToastStore();
	const [draft, setDraft] = useState<CompetitionInterface>(competition);
	const [isSaving, setIsSaving] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const ro = !isEditing;

	const set = (field: keyof CompetitionInterface, value: any) => setDraft((prev) => ({ ...prev, [field]: value }));

	const handleSave = async (overrides?: Partial<CompetitionInterface>) => {
		setIsSaving(true);
		try {
			const response = await updateCompetition(competition.id, {
				...draft,
				...overrides,
			});
			const updated = response?.data;
			onCompetitionChange(updated);
			setDraft(updated);
			setIsEditing(false);
			showToast("Changes saved successfully!", true);
		} catch (err: any) {
			showToast(err || "Failed to save changes. Please try again.", false);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setDraft(competition);
		setIsEditing(false);
	};

	return (
		<div className="space-y-5">
			{/* Edit toggle */}
			<div className="flex items-center justify-between pb-3 border-b border-gray-200">
				<p className="text-xs text-gray-500 font-medium">
					{isEditing ? "Editing mode — make your changes below" : "View mode — click Edit to make changes"}
				</p>
				<button
					className="bg-white text-green-900 text-sm font-bold 
                     px-3.5 py-1.5 rounded-md hover:bg-green-50 
                     border border-green-200 transition-colors"
					onClick={() => {
						setDraft(competition);
						setIsEditing((prev) => !prev);
					}}
				>
					{isEditing ? "Cancel" : "Edit"}
				</button>
			</div>

			{/* Name + Status */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
				<Field label="Competition Name">
					<input
						type="text"
						value={draft.name}
						readOnly={ro}
						onChange={(e) => set("name", e.target.value)}
						className={inputCls(ro)}
						placeholder="Competition name"
					/>
				</Field>
				<Field label="Status">
					<div className="flex items-center h-[34px]">
						<StatusBadge status={competition.status} />
					</div>
				</Field>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
				<Field label="Competition Type">
					<div className={inputCls(true)}>
						{CompetitionTypeDisplay[draft.type as keyof typeof CompetitionTypeDisplay] ?? "—"}
					</div>
				</Field>
			</div>
			{(draft.has_third_place !== undefined || draft.two_legged !== undefined) && (
				<div>
					<SectionHeader label="Match Settings" />
					{draft.has_third_place !== undefined && (
						<Toggle
							label="3rd Place Match"
							description="Enable third place playoff"
							checked={draft.has_third_place}
							disabled={ro}
							onChange={() => set("has_third_place", !draft.has_third_place)}
						/>
					)}
					{draft.two_legged !== undefined && (
						<Toggle
							label="Two-Legged"
							description="Enable home and away matches"
							checked={draft.two_legged}
							disabled={ro}
							onChange={() => set("two_legged", !draft.two_legged)}
						/>
					)}
				</div>
			)}
			{/* Individual Toggle */}
			{draft.individual !== undefined && (
				<Toggle
					label="Individual Competition"
					description="Participants compete as individuals rather than teams"
					checked={draft.individual}
					disabled={true}
					onChange={() => set("individual", !draft.individual)}
				/>
			)}

			{/* Action Buttons */}
			<div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
				<div className="flex gap-3 ml-auto">
					{isEditing && (
						<button
							onClick={handleCancel}
							disabled={isSaving}
							className="bg-gray-100 text-gray-900 font-bold py-2 
                         px-7 rounded-md text-sm hover:bg-gray-200 
                         transition-colors disabled:opacity-50"
						>
							Cancel
						</button>
					)}
					<button
						onClick={() => handleSave()}
						disabled={isSaving || ro}
						className="bg-green-900 text-white font-bold py-2 
                       px-7 rounded-md text-sm disabled:opacity-50 
                       hover:bg-green-800 transition-colors"
					>
						{isSaving ? "Saving…" : "💾 Save Changes"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CompetitionSettings;
