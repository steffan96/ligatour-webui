import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicCompetition, type CompetitionInterface } from "api/competitions";
import GroupStageTab from "../competitions/GroupStageTab";

interface Team {
	id: number;
	name: string;
	logo?: string;
}

interface KnockoutMatch {
	id: number;
	position: number;
	home_team: Team | null;
	away_team: Team | null;
	home_score: number | null;
	away_score: number | null;
	home_penalties?: number | null;
	away_penalties?: number | null;
	status: "scheduled" | "live" | "completed" | "walkover" | "bye";
	winner_id: number | null;
	scheduled_at?: string | null;
	venue?: string | null;
}

interface KnockoutRound {
	id: number;
	name: string;
	round_number: number;
	stage?: string | null;
	matches: KnockoutMatch[];
}

interface RawMatch {
	id: number;
	competition_id: number;
	round_id: number;
	home_team_id: number;
	away_team_id: number;
	home_team_name: string;
	away_team_name: string;
	home_score: number | null;
	away_score: number | null;
	status: "scheduled" | "live" | "completed" | "walkover" | "bye";
	winner_team_id: number;
	draw: boolean;
	scheduled_at?: string | null;
}

interface RawRound {
	id: number;
	competition_id: number;
	round_number: number;
	stage: string;
	status: string;
	created_at: string;
	matches: RawMatch[];
}

type Tab = "bracket" | "group_stage";

function formatStageLabel(stage: string): string {
	return stage
		.split("_")
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

function transformRound(raw: RawRound): KnockoutRound {
	return {
		id: raw.id,
		name: formatStageLabel(raw.stage),
		round_number: raw.round_number,
		stage: formatStageLabel(raw.stage),
		matches: raw.matches.map(
			(m): KnockoutMatch => ({
				id: m.id,
				position: m.id,
				home_team: m.home_team_id
					? { id: m.home_team_id, name: m.home_team_name }
					: null,
				away_team: m.away_team_id
					? { id: m.away_team_id, name: m.away_team_name }
					: null,
				home_score: m.home_score,
				away_score: m.away_score,
				status: m.status,
				winner_id: m.winner_team_id > 0 ? m.winner_team_id : null,
				scheduled_at: m.scheduled_at ?? null,
			}),
		),
	};
}

const CARD_H = 88;
const MATCH_GAP = 12;
const BASE_SLOT_H = CARD_H + MATCH_GAP;
const CONNECTOR_W = 36;
const ROUND_COL_W = 200;

function slotH(roundIdx: number): number {
	return BASE_SLOT_H * 2 ** roundIdx;
}

const LoadingSpinner = () => (
	<div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
		<div className="relative h-14 w-14">
			<div className="absolute inset-0 rounded-full border-4 border-gray-200" />
			<div className="absolute inset-0 rounded-full border-4 border-t-green-900 animate-spin" />
		</div>
		<p className="text-sm text-gray-400 font-medium tracking-wide">
			Loading bracket…
		</p>
	</div>
);

const ErrorDisplay = ({
	message,
	onRetry,
}: {
	message: string;
	onRetry?: () => void;
}) => (
	<div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
		<div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
			<svg
				className="w-8 h-8 text-red-500"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d={
						"M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 " +
						"2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 " +
						"0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
					}
				/>
			</svg>
		</div>
		<h3 className="text-base font-semibold text-gray-900 mb-1">
			Unable to Load Bracket
		</h3>
		<p className="text-sm text-gray-500 mb-5 max-w-xs">{message}</p>
		{onRetry && (
			<button
				onClick={onRetry}
				className={
					"inline-flex items-center gap-2 bg-green-900 text-white text-sm font-medium " +
					"px-5 py-2 rounded-lg hover:bg-green-800 active:scale-95 transition-all duration-150"
				}
			>
				<svg
					className="w-4 h-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d={
							"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581" +
							"m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						}
					/>
				</svg>
				Try Again
			</button>
		)}
	</div>
);

interface TeamRowProps {
	team: Team | null;
	score: number | null;
	penalties?: number | null;
	isWinner: boolean;
	isLoser: boolean;
	isWalkover?: boolean;
}

const TeamRow = ({
	team,
	score,
	penalties,
	isWinner,
	isLoser,
	isWalkover,
}: TeamRowProps) => (
	<div
		className={[
			"flex items-center justify-between px-3 min-h-[38px]",
			isWinner ? "bg-green-50" : "",
		].join(" ")}
	>
		<span
			className={[
				"text-xs truncate flex-1 pr-2 leading-tight",
				!team
					? "text-gray-300 italic"
					: isWinner
						? "font-semibold text-green-900"
						: isLoser
							? "text-gray-400"
							: "text-gray-800 font-medium",
			].join(" ")}
		>
			{team ? team.name : "TBD"}
		</span>

		<div className="flex items-center gap-1.5 flex-shrink-0">
			{isWalkover && isWinner && (
				<span className="text-[10px] text-gray-400 italic">w/o</span>
			)}
			{penalties != null && (
				<span className="text-[10px] text-gray-400 tabular-nums">
					({penalties})
				</span>
			)}
			<span
				className={[
					"text-xs tabular-nums min-w-[18px] text-center",
					score == null
						? "text-gray-300"
						: isWinner
							? "font-bold text-green-900"
							: isLoser
								? "text-gray-400"
								: "text-gray-700",
				].join(" ")}
			>
				{score != null ? score : "–"}
			</span>
			{isWinner ? (
				<svg
					className="w-3 h-3 text-green-700 flex-shrink-0"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2.5}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			) : (
				<span className="w-3" />
			)}
		</div>
	</div>
);

function formatScheduledAt(raw: string): string {
	const d = new Date(raw);
	if (isNaN(d.getTime())) return raw;
	return d.toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

const MatchCard = ({ match }: { match: KnockoutMatch }) => {
	const homeWon =
		match.winner_id != null && match.home_team?.id === match.winner_id;
	const awayWon =
		match.winner_id != null && match.away_team?.id === match.winner_id;
	const decided = match.winner_id != null;

	const isLive = match.status === "live";
	const isWalkover = match.status === "walkover";
	const isBye = match.status === "bye";
	const isEmpty = !match.home_team && !match.away_team;

	return (
		<div
			style={{ height: CARD_H }}
			className={[
				"rounded-lg border overflow-hidden flex flex-col select-none",
				"transition-all duration-150",
				isLive
					? "border-green-400 ring-1 ring-green-300 shadow-sm bg-white"
					: isEmpty
						? "border-dashed border-gray-200 bg-gray-50/60"
						: "border-gray-200 bg-white shadow-sm hover:shadow",
			].join(" ")}
		>
			{(isLive || isWalkover || isBye) && (
				<div
					className={[
						"flex items-center gap-1.5 px-3 py-0.5 text-white text-[10px] font-bold flex-shrink-0",
						isLive ? "bg-green-900" : "bg-gray-500",
					].join(" ")}
				>
					{isLive && (
						<span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
					)}
					{isLive ? "Live" : isWalkover ? "Walkover" : "Bye"}
				</div>
			)}

			<div className="flex flex-col flex-1 justify-center">
				<TeamRow
					team={match.home_team}
					score={match.home_score}
					penalties={match.home_penalties}
					isWinner={homeWon}
					isLoser={decided && !homeWon}
					isWalkover={isWalkover}
				/>
				<div className="border-t border-gray-100 mx-2" />
				<TeamRow
					team={match.away_team}
					score={match.away_score}
					penalties={match.away_penalties}
					isWinner={awayWon}
					isLoser={decided && !awayWon}
					isWalkover={isWalkover}
				/>
			</div>

			{!decided && match.scheduled_at && (
				<div className="px-3 pb-1.5 flex items-center gap-1 flex-shrink-0">
					<svg
						className="w-2.5 h-2.5 text-gray-300 flex-shrink-0"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span className="text-[10px] text-gray-400 truncate">
						{formatScheduledAt(match.scheduled_at)}
						{match.venue ? ` · ${match.venue}` : ""}
					</span>
				</div>
			)}
		</div>
	);
};

const ConnectorSVG = ({
	matchCount,
	roundIdx,
}: {
	matchCount: number;
	roundIdx: number;
}) => {
	const slot = slotH(roundIdx);
	const totalH = matchCount * slot;
	const w = CONNECTOR_W;

	const segments: React.ReactElement[] = [];
	for (let i = 0; i < matchCount; i += 2) {
		const topY = i * slot + slot / 2;
		const bottomY = (i + 1) * slot + slot / 2;
		const midY = (topY + bottomY) / 2;
		segments.push(
			<g key={i}>
				<line
					x1={0}
					y1={topY}
					x2={w / 2}
					y2={topY}
					stroke="#d1d5db"
					strokeWidth={1.5}
				/>
				<line
					x1={0}
					y1={bottomY}
					x2={w / 2}
					y2={bottomY}
					stroke="#d1d5db"
					strokeWidth={1.5}
				/>
				<line
					x1={w / 2}
					y1={topY}
					x2={w / 2}
					y2={bottomY}
					stroke="#d1d5db"
					strokeWidth={1.5}
				/>
				<line
					x1={w / 2}
					y1={midY}
					x2={w}
					y2={midY}
					stroke="#d1d5db"
					strokeWidth={1.5}
				/>
			</g>,
		);
	}

	return (
		<svg
			width={w}
			height={totalH}
			viewBox={`0 0 ${w} ${totalH}`}
			className="flex-shrink-0"
			style={{ display: "block" }}
		>
			{segments}
		</svg>
	);
};

const RoundColumn = ({
	round,
	roundIdx,
}: {
	round: KnockoutRound;
	roundIdx: number;
}) => {
	const slot = slotH(roundIdx);
	const padV = (slot - CARD_H) / 2;

	return (
		<div className="flex flex-col flex-shrink-0" style={{ width: ROUND_COL_W }}>
			<div className="pb-3 text-center">
				<span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
					{round.stage ?? round.name}
				</span>
			</div>
			{round.matches.map((match) => (
				<div
					key={match.id}
					style={{
						height: slot,
						paddingTop: padV,
						paddingBottom: padV,
						boxSizing: "border-box",
					}}
				>
					<MatchCard match={match} />
				</div>
			))}
		</div>
	);
};

const EmptyBracket = () => (
	<div className="flex flex-col items-center justify-center py-20 text-center">
		<div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
			<svg
				className="w-6 h-6 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d={
						"M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 " +
						"012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					}
				/>
			</svg>
		</div>
		<p className="text-sm font-medium text-gray-500">
			No bracket data available yet
		</p>
		<p className="text-xs text-gray-400 mt-1">
			Check back once the knockout stage begins
		</p>
	</div>
);

const BracketDisplay = ({ rounds }: { rounds: KnockoutRound[] }) => {
	if (!rounds || rounds.length === 0) return <EmptyBracket />;
	const sorted = [...rounds].sort((a, b) => a.round_number - b.round_number);
	return (
		<div className="overflow-x-auto">
			<div
				className="inline-flex items-start gap-0 px-6 py-6"
				style={{ minWidth: "max-content" }}
			>
				{sorted.map((round, rIdx) => {
					const isLast = rIdx === sorted.length - 1;
					return (
						<React.Fragment key={round.id}>
							<RoundColumn round={round} roundIdx={rIdx} />
							{!isLast && (
								<ConnectorSVG
									matchCount={round.matches.length}
									roundIdx={rIdx}
								/>
							)}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
};

// ─── Tab bar ──────────────────────────────────────────────────────────────────

interface TabDef {
	key: Tab;
	label: string;
	icon: React.ReactNode;
}

const tabs: TabDef[] = [
	{
		key: "bracket",
		label: "Bracket",
		icon: (
			<svg
				className="w-3.5 h-3.5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M4 5h4v4H4V5zm0 10h4v4H4v-4zm12-5h4v4h-4v-4zM8 7h4M8 17h4m0-5h4"
				/>
			</svg>
		),
	},
	{
		key: "group_stage",
		label: "Group Stage",
		icon: (
			<svg
				className="w-3.5 h-3.5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3
           0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 
           3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		),
	},
];

const TabBar = ({
	active,
	onChange,
}: {
	active: Tab;
	onChange: (t: Tab) => void;
}) => (
	<div className="flex items-center gap-1 px-5 border-b border-gray-100">
		{tabs.map((t) => {
			const isActive = t.key === active;
			return (
				<button
					key={t.key}
					onClick={() => onChange(t.key)}
					className={[
						"inline-flex items-center gap-1.5 px-3 py-3 text-xs font-semibold transition-all duration-150",
						"border-b-2 -mb-px focus:outline-none",
						isActive
							? "border-green-900 text-green-900"
							: "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300",
					].join(" ")}
				>
					{t.icon}
					{t.label}
				</button>
			);
		})}
	</div>
);

// ─── Page component ───────────────────────────────────────────────────────────

const PublicKnockout = () => {
	const { slug } = useParams<{ slug: string }>();
	const [competition, setCompetition] = useState<CompetitionInterface | null>(
		null,
	);
	const [rounds, setRounds] = useState<KnockoutRound[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<Tab>("bracket");

	const fetchData = useCallback(async () => {
		if (!slug) {
			setError("Invalid competition link");
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const response = await getPublicCompetition(`knockout/${slug}`);
			const { competition: competitionData, rounds: rawRounds } = response.data;
			if (!competitionData) throw new Error("Competition not found");
			setCompetition(competitionData);
			setRounds(Array.isArray(rawRounds) ? rawRounds.map(transformRound) : []);
		} catch (err: any) {
			console.error("Failed to load knockout bracket:", err);
			setError(
				err?.message ||
					"Failed to load bracket. The link may be invalid or expired.",
			);
		} finally {
			setLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		if (competition?.status === "active") {
			const interval = setInterval(fetchData, 30_000);
			return () => clearInterval(interval);
		}
	}, [competition?.status, fetchData]);

	if (loading && !competition) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	if (error || !competition) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-md w-full mx-4">
					<ErrorDisplay
						message={error || "Competition not found"}
						onRetry={fetchData}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 shadow-sm">
				<div className="w-full px-4 sm:px-6 lg:px-8 py-5">
					<div className="flex items-center justify-between gap-4 flex-wrap">
						<div className="flex items-center gap-3">
							<div
								className="flex-shrink-0 w-10 h-10 
              bg-green-900 rounded-lg flex items-center justify-center shadow-sm"
							>
								<svg
									className="w-5 h-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.8}
										d="M4 5h4v4H4V5zm0 10h4v4H4v-4zm12-5h4v4h-4v-4zM8 7h4M8 17h4m0-5h4"
									/>
								</svg>
							</div>
							<div>
								<h1 className="text-xl font-bold text-gray-900 leading-tight">
									{competition.name}
								</h1>
								{competition.type && (
									<p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">
										{competition.type}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Card with tabs */}
			<div className="flex-1 flex flex-col w-full px-4 sm:px-6 lg:px-8 py-6">
				<div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
					<TabBar active={activeTab} onChange={setActiveTab} />

					<div className="flex-1 overflow-auto">
						{activeTab === "bracket" && <BracketDisplay rounds={rounds} />}
						{activeTab === "group_stage" && slug && (
							<GroupStageTab
								slug={slug}
								isIndividual={competition.individual ?? false}
								isActive={competition.status === "active"}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PublicKnockout;
