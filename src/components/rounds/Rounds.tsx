import React, { useEffect, useState } from "react";
import type { CompetitionInterface } from "../../api/competitions";
import { listRounds, startRound } from "../../api/rounds";
import { useToastStore } from "../../api/stores/useToastStore";
import ConfirmModal from "../common/ConfirmModal";
import Pagination from "../common/Pagination";

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
	created_at: string;
}

interface Round {
	id: number;
	competition_id: number;
	round_number: number;
	stage: string;
	status: "scheduled" | "in_progress" | "completed";
	created_at: string;
	matches: Match[];
}

const SectionHeader = ({ label }: { label: string }) => (
	<p className="text-sm font-bold text-gray-900 mb-2.5 pb-1.5 border-b border-gray-300">{label}</p>
);

const RoundRow = ({ round, onSelect }: { round: Round; onSelect: () => void }) => (
	<div
		onClick={onSelect}
		className="flex items-center justify-between py-2.5 border-b last:border-0 
               cursor-pointer hover:bg-gray-50 -mx-1 px-1 rounded transition-colors"
	>
		<div className="flex items-center gap-3">
			{round.stage && (
				<span className="text-xs font-bold text-gray-900 capitalize">{round.stage.replace(/_/g, " ")}</span>
			)}
		</div>
		<div className="flex items-center gap-3">
			<span className="text-xs font-medium text-gray-400">
				{round.matches.length} match{round.matches.length !== 1 ? "es" : ""}
			</span>
			<button
				onClick={(e) => {
					e.stopPropagation();
					onSelect();
				}}
				className="inline-flex items-center gap-1 text-[11px] font-medium 
                   text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 
                   border border-gray-200 rounded-full px-2.5 py-1 transition-colors"
			>
				Enter
				<svg
					className="w-2.5 h-2.5"
					viewBox="0 0 10 10"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" />
				</svg>
			</button>
		</div>
	</div>
);

const SkeletonRows = () => (
	<>
		{[1, 2, 3].map((i) => (
			<div key={i} className="h-10 bg-gray-100 rounded-md animate-pulse mb-2" />
		))}
	</>
);

const NoRoundsState = () => (
	<div className="flex flex-col items-center justify-center py-10 text-center gap-2">
		<div className="text-3xl">🏁</div>
		<p className="text-sm font-bold text-gray-700">No rounds yet</p>
		<p className="text-xs font-medium text-gray-500">Start the competition to generate rounds</p>
	</div>
);

interface RoundsProps {
	competition: CompetitionInterface;
	onSelectRound: (roundId: number) => void;
}

const ROUNDS_PER_PAGE = 5;

const Rounds = ({ competition, onSelectRound }: RoundsProps) => {
	const { showToast } = useToastStore();

	const [rounds, setRounds] = useState<Round[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isStarting, setIsStarting] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [showStartRoundModal, setShowStartRoundModal] = useState(false);

	useEffect(() => {
		const load = async () => {
			setIsLoading(true);
			try {
				const response = await listRounds(competition.id);
				const data: Round[] = response.data ?? response;
				setRounds(data);
			} catch (err: any) {
				showToast(err || "Failed to load rounds.", false);
				setRounds([]);
			} finally {
				setIsLoading(false);
			}
		};
		load();
	}, [competition.id]);

	const handleStartRound = async () => {
		setIsStarting(true);
		try {
			const response = await startRound(competition.id);
			const data: Round[] = response.data ?? response;
			setRounds(data);
			showToast("Next round generated.", true);
		} catch (err: any) {
			showToast(err || "Failed to start round.", false);
		} finally {
			setIsStarting(false);
			setShowStartRoundModal(false);
		}
	};

	const visibleRounds = rounds.filter((r) => r.matches.length > 0).sort((a, b) => a.round_number - b.round_number);

	const lastRound = visibleRounds[visibleRounds.length - 1];
	const canStartRound = visibleRounds.length === 0 || lastRound?.status === "completed";

	const totalPages = Math.ceil(visibleRounds.length / ROUNDS_PER_PAGE);
	const startIndex = (currentPage - 1) * ROUNDS_PER_PAGE;
	const paginatedRounds = visibleRounds.slice(startIndex, startIndex + ROUNDS_PER_PAGE);

	return (
		<div className="space-y-5">
			{/* Round list */}
			<div>
				<SectionHeader label="Rounds" />
				{isLoading ? (
					<SkeletonRows />
				) : visibleRounds.length === 0 ? (
					<NoRoundsState />
				) : (
					<div>
						{paginatedRounds.map((round) => (
							<RoundRow key={round.id} round={round} onSelect={() => onSelectRound(round.id)} />
						))}
					</div>
				)}
			</div>

			{/* Pagination */}
			{visibleRounds.length > ROUNDS_PER_PAGE && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					totalItems={visibleRounds.length}
					itemLabel="rounds"
					onPageChange={(page) => {
						setCurrentPage(page);
						window.scrollTo({ top: 0, behavior: "smooth" });
					}}
				/>
			)}
			{!isLoading && canStartRound && (
				<button
					onClick={() => setShowStartRoundModal(true)}
					className="inline-flex items-center gap-1.5 text-xs font-medium
                     text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900
                     border border-gray-200 rounded-full px-3 py-1.5 transition-colors"
				>
					{competition.type === "round_robin" ? "▶ Generate All Rounds" : "▶ Start Next Round"}
				</button>
			)}

			{showStartRoundModal && (
				<ConfirmModal
					title={competition.type === "round_robin" ? "Generate All Rounds?" : "Start Next Round?"}
					description={
						competition.type === "round_robin"
							? "This will generate matches for all rounds. Are you sure you want to proceed?"
							: "This will generate matches for the next round. Are you sure you want to proceed?"
					}
					confirmLabel={isStarting ? "Starting…" : "▶ Start"}
					onConfirm={handleStartRound}
					onCancel={() => setShowStartRoundModal(false)}
				/>
			)}
		</div>
	);
};

export default Rounds;
