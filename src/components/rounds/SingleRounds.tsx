import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { restartMatch, updateMatch } from "../../api/matches";
import { deleteRound, getRound, startRound } from "../../api/rounds";
import { useToastStore } from "../../api/stores/useToastStore";
import ConfirmModal from "../common/ConfirmModal";

interface Match {
	id: number;
	competition_id: number;
	round_id: number;
	home_team_id: number;
	away_team_id: number;
	home_team_name: string;
	away_team_name: string;
	home_score: number | null;
	away_score: number | null;
	status: "scheduled" | "in_progress" | "completed" | "bye";
	winner_team_id: number | null;
	created_at: string;
	draw: boolean;
	type: string;
	bracket_place: string | null;
}

interface Round {
	id: number;
	competition_id: number;
	round_number: number;
	stage: string;
	status: "scheduled" | "in_progress" | "completed";
	created_at: string;
	matches: Match[];
	type: string;
}

function groupByBracketPlace(matches: Match[]): Record<string, Match[]> {
	return matches.reduce<Record<string, Match[]>>((acc, match) => {
		const key = match.bracket_place || "Unassigned";
		if (!acc[key]) acc[key] = [];
		acc[key].push(match);
		return acc;
	}, {});
}

const MatchStatusBadge = ({ status }: { status: Match["status"] }) => {
	const map: Record<Match["status"], { label: string; cls: string }> = {
		scheduled: {
			label: "🗓 Scheduled",
			cls: "bg-gray-100 text-gray-600 border-gray-200",
		},
		in_progress: {
			label: "live",
			cls: "bg-red-50 text-red-700 border-red-200 animate-pulse",
		},
		completed: {
			label: "completed",
			cls: "bg-green-50 text-green-800 border-green-200",
		},
		bye: {
			label: "⏭ Bye",
			cls: "bg-blue-50 text-blue-700 border-blue-200",
		},
	};

	const { label, cls } = map[status] ?? map.scheduled;

	return <span className={`text-xs font-bold px-2 py-0.5 rounded border ${cls}`}>{label}</span>;
};

const MatchCard = ({
	match,
	onUpdateMatch,
	onRestartMatch,
}: {
	match: Match;
	onUpdateMatch: (matchId: number, winnerId: number | null) => Promise<void>;
	onRestartMatch: (matchId: number) => Promise<void>;
}) => {
	const isBye = match.status === "bye";

	const homeWins = match.winner_team_id === match.home_team_id;
	const awayWins = match.winner_team_id === match.away_team_id;

	const isDraw = match.draw === true && match.winner_team_id === 0;

	const [isEditing, setIsEditing] = useState(false);
	const [winnerId, setWinnerId] = useState<number | "">(match.winner_team_id ?? "");

	const [isSaving, setIsSaving] = useState(false);
	const [showRestartModal, setShowRestartModal] = useState(false);

	useEffect(() => {
		setWinnerId(match.winner_team_id ?? "");
	}, [match.winner_team_id]);

	const handleSave = async () => {
		setIsSaving(true);

		try {
			await onUpdateMatch(match.id, winnerId === "" ? null : Number(winnerId));

			setIsEditing(false);
		} finally {
			setIsSaving(false);
		}
	};

	const handleRestart = async () => {
		setIsSaving(true);

		try {
			await onRestartMatch(match.id);
			setIsEditing(false);
			setShowRestartModal(false);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className={"bg-white rounded-lg border " + (isBye ? "bg-blue-50/30 border-blue-100" : "border-gray-200")}>
			<div className="px-4 py-3 flex items-center justify-between gap-4">
				<div className="flex-1 flex items-center justify-end gap-3 min-w-0">
					<span className={`text-sm font-bold truncate ${homeWins ? "text-green-800" : ""}`}>
						{match.home_team_name}
					</span>

					{homeWins && <span>🏆</span>}
				</div>

				<div className="flex flex-col items-center gap-1">
					<div className="text-xs font-bold text-gray-400">
						{isDraw ? <span className="text-orange-600">DRAW</span> : "VS"}
					</div>

					<MatchStatusBadge status={match.status} />
				</div>

				<div className="flex-1 flex items-center gap-3 min-w-0">
					{awayWins && <span>🏆</span>}

					<span className={`text-sm font-bold truncate ${awayWins ? "text-green-800" : ""}`}>
						{isBye ? "Bye" : match.away_team_name}
					</span>
				</div>

				{!isEditing && (
					<button onClick={() => setIsEditing(true)} className="text-xs bg-gray-100 px-2 py-1 rounded">
						Edit
					</button>
				)}
			</div>

			{isEditing && (
				<div className="border-t bg-gray-50 px-4 py-3 rounded-b-lg flex flex-col gap-3">
					<select
						value={winnerId}
						onChange={(e) => setWinnerId(e.target.value === "" ? "" : Number(e.target.value))}
						className="text-sm border rounded px-2 py-1"
					>
						<option value={0}>Draw</option>

						<option value={match.home_team_id}>{match.home_team_name}</option>

						<option value={match.away_team_id}>{match.away_team_name}</option>
					</select>

					<div className="flex justify-end gap-2">
						<button
							onClick={() => setShowRestartModal(true)}
							disabled={isSaving}
							className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded"
						>
							Restart
						</button>

						<button onClick={() => setIsEditing(false)} className="text-xs px-3 py-1 bg-white border rounded">
							Cancel
						</button>

						<button
							onClick={handleSave}
							disabled={isSaving}
							className="text-xs px-3 py-1 bg-green-700 text-white rounded"
						>
							{isSaving ? "..." : "Save"}
						</button>
					</div>
				</div>
			)}

			{showRestartModal && (
				<ConfirmModal
					title="Restart Match?"
					description="This will clear the result and reset the match to scheduled. Are you sure?"
					confirmLabel={isSaving ? "Restarting…" : "↺ Restart"}
					onConfirm={handleRestart}
					onCancel={() => setShowRestartModal(false)}
				/>
			)}
		</div>
	);
};

interface SingleRoundProps {
	competitionId: number;
	roundId: number;
}

const SingleRound = ({ competitionId, roundId }: SingleRoundProps) => {
	const { showToast } = useToastStore();
	const navigate = useNavigate();

	const [round, setRound] = useState<Round | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const [isStarting, setIsStarting] = useState(false);

	const [showStartRoundModal, setShowStartRoundModal] = useState(false);
	const [showDeleteRoundModal, setShowDeleteRoundModal] = useState(false);

	const loadRound = async () => {
		setIsLoading(true);

		try {
			const response = await getRound(competitionId, roundId);

			const data: Round = response.data ?? response;

			setRound(data);
		} catch (err: any) {
			showToast(err || "Failed to load round.", false);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		loadRound();
	}, [competitionId, roundId]);

	const handleUpdateMatch = async (mId: number, wId: number | null) => {
		try {
			await updateMatch(competitionId, roundId, mId, wId as unknown as number);

			await loadRound();

			showToast("Match updated!", true);
		} catch (err: any) {
			showToast(err || "Match update failed.", false);
		}
	};

	const handleRestartMatch = async (mId: number) => {
		try {
			await restartMatch(competitionId, roundId, mId);

			await loadRound();

			showToast("Match restarted!", true);
		} catch (err: any) {
			showToast(err || "Failed to restart match.", false);
		}
	};

	const handleStartRound = async () => {
		setIsStarting(true);

		try {
			await startRound(competitionId);

			showToast("Next round generated.", true);
		} catch (err: any) {
			showToast(err || "Failed to start round.", false);
		} finally {
			setIsStarting(false);
			setShowStartRoundModal(false);
		}
	};

	const handleDeleteRound = async () => {
		try {
			await deleteRound(competitionId, roundId);
			showToast("Round deleted!", true);
			setTimeout(() => {
				window.location.reload();
			}, 600);
		} catch (err: any) {
			showToast(err || "Failed to delete round.", false);
		}
	};

	const canStartRound = !isLoading && round?.status === "completed";

	const hasGroups = round?.matches?.some((m) => m.bracket_place);

	return (
		<div className="space-y-5">
			<div className="flex items-center justify-between pb-3 border-b border-gray-200">
				<div className="flex items-center gap-3">
					<p className="text-xs text-gray-500 font-medium">
						{round ? (
							<>
								{round.stage && (
									<span className="ml-1.5 capitalize text-gray-400">· {round.stage.replace(/_/g, " ")}</span>
								)}

								<span className="ml-1.5 capitalize text-gray-400">· {round.status.replace(/_/g, " ")}</span>
							</>
						) : (
							<span className="text-gray-300">Loading…</span>
						)}
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="animate-pulse h-20 bg-gray-100 rounded" />
			) : !round ? (
				<div className="text-sm text-gray-500 text-center py-10">Round not found.</div>
			) : hasGroups ? (
				<div className="flex flex-col gap-5">
					{Object.entries(groupByBracketPlace(round.matches)).map(([place, matches]) => (
						<div key={place}>
							<p
								className="text-xs font-semibold uppercase tracking-widest 
							text-gray-400 mb-2 pb-1.5 border-b border-gray-100"
							>
								{place}
							</p>
							<div className="flex flex-col gap-2.5">
								{matches.map((m) => (
									<MatchCard
										key={m.id}
										match={m}
										onUpdateMatch={handleUpdateMatch}
										onRestartMatch={handleRestartMatch}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col gap-2.5">
					{round.matches?.map((m) => (
						<MatchCard key={m.id} match={m} onUpdateMatch={handleUpdateMatch} onRestartMatch={handleRestartMatch} />
					))}
				</div>
			)}

			{canStartRound && round.type != "round_robin" && (
				<button
					onClick={() => setShowStartRoundModal(true)}
					className="inline-flex items-center gap-1.5 text-xs font-medium
                     text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900
                     border border-gray-200 rounded-full px-3 py-1.5 transition-colors"
				>
					▶ Start Next Round
				</button>
			)}

			{showStartRoundModal && (
				<ConfirmModal
					title={round?.type === "round_robin" ? "Generate All Rounds?" : "Start Next Round?"}
					description={
						round?.type === "round_robin"
							? "This will generate matches for all rounds. Are you sure you want to proceed?"
							: "This will generate matches for the next round. Are you sure you want to proceed?"
					}
					confirmLabel={isStarting ? "Starting…" : "▶ Start"}
					onConfirm={handleStartRound}
					onCancel={() => setShowStartRoundModal(false)}
				/>
			)}
			<button
				onClick={() => setShowDeleteRoundModal(true)}
				className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded"
			>
				Delete Round
			</button>

			{showDeleteRoundModal && (
				<ConfirmModal
					title="Delete Round?"
					description="This will delete round and all it's results. Are you sure?"
					confirmLabel={"Deleting round"}
					onConfirm={handleDeleteRound}
					onCancel={() => setShowDeleteRoundModal(false)}
				/>
			)}
		</div>
	);
};

export default SingleRound;
