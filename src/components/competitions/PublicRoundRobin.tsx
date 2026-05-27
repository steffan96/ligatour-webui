import GroupStageTab from "components/competitions/GroupStageTab";
import {
	CompetitionPageShell,
	ErrorDisplay,
	LoadingSpinner,
	TabBar,
	type TabDef,
	useCompetitionData,
} from "components/competitions/PublicCompetitionShared";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Team {
	id: number;
	name: string;
	logo: string;
	competition_id: number;
	created_at: string;
	players: null | any[];
}

interface Standing {
	id: number;
	competition_id: number;
	team_id: number;
	played: number;
	wins: number;
	draws: number;
	losses: number;
	goals_for: number;
	goals_against: number;
	goal_diff: number;
	points: number;
	buchholz_score: number;
	sonneborn_berger_score: number;
	updated_at: string;
	created_at: string;
	team: Team;
	player_name?: string;
}

type Tab = "standings" | "group_stage";

// ─── StandingsTable ───────────────────────────────────────────────────────────

const badgeBase = "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shadow-sm";

const RankBadge = ({ rank }: { rank: number }) => {
	if (rank === 1) return <span className={`${badgeBase} bg-yellow-400 text-yellow-900`}>1</span>;
	if (rank === 2) return <span className={`${badgeBase} bg-gray-300 text-gray-700`}>2</span>;
	if (rank === 3) return <span className={`${badgeBase} bg-orange-300 text-orange-800`}>3</span>;
	return (
		<span className="inline-flex items-center justify-center w-7 h-7 text-xs font-semibold text-gray-500">
			{rank}
		</span>
	);
};

const StatCell = ({ value }: { value: number | string }) => (
	<td className="px-4 py-3.5 text-sm text-center tabular-nums text-gray-600">{value}</td>
);

const StandingsTable = ({ standings, isIndividual }: { standings: Standing[]; isIndividual: boolean }) => {
	if (!standings || standings.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
					<svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d={
								"M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586" +
								"a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							}
						/>
					</svg>
				</div>
				<p className="text-sm font-medium text-gray-500">No standings data available yet</p>
				<p className="text-xs text-gray-400 mt-1">Check back once matches have been played</p>
			</div>
		);
	}

	const headers = [
		{ label: "#", align: "left", title: "Rank" },
		{
			label: isIndividual ? "Player" : "Team",
			align: "left",
			title: isIndividual ? "Player" : "Team",
		},
		{ label: "MP", align: "center", title: "Matches Played" },
		{ label: "W", align: "center", title: "Wins" },
		{ label: "D", align: "center", title: "Draws" },
		{ label: "L", align: "center", title: "Losses" },
		{ label: "Pts", align: "center", title: "Points" },
	];

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full bg-white">
				<thead>
					<tr className="bg-gray-50 border-b border-gray-200">
						{headers.map((h) => (
							<th
								key={h.label}
								title={h.title}
								className={[
									"px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest",
									"cursor-default select-none",
									h.align === "center" ? "text-center" : "text-left",
								].join(" ")}
							>
								{h.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{standings.map((standing, index) => {
						const rank = index + 1;
						const isTop3 = rank <= 3;
						return (
							<tr
								key={standing.id}
								className={`transition-colors duration-100 ${
									isTop3 ? "bg-green-50/40 hover:bg-green-50" : "hover:bg-gray-50/60"
								}`}
							>
								<td className="px-4 py-3.5">
									<RankBadge rank={rank} />
								</td>
								<td className="px-4 py-3.5">
									<span className={`text-sm font-semibold ${isTop3 ? "text-green-900" : "text-gray-800"}`}>
										{isIndividual ? standing.player_name : standing.team?.name}
									</span>
								</td>
								<StatCell value={standing.played} />
								<StatCell value={standing.wins} />
								<StatCell value={standing.draws} />
								<StatCell value={standing.losses} />
								<td className="px-4 py-3.5 text-center">
									<span
										className={
											"inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 " +
											"rounded-md bg-green-900 text-white text-sm font-bold tabular-nums shadow-sm"
										}
									>
										{standing.points}
									</span>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS: TabDef<Tab>[] = [
	{
		key: "standings",
		label: "Standings",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				/>
			</svg>
		),
	},
	{
		key: "group_stage",
		label: "Group Stage",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3
					 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 
					 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		),
	},
];

// ─── Header icon ──────────────────────────────────────────────────────────────

const BarChartIcon = (
	<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.8}
			d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</svg>
);

// ─── Page component ───────────────────────────────────────────────────────────

const PublicRoundRobin = () => {
	const { slug } = useParams<{ slug: string }>();
	const [activeTab, setActiveTab] = useState<Tab>("standings");

	const {
		competition,
		data: standings,
		loading,
		error,
		refetch,
	} = useCompetitionData<Standing[]>(
		slug,
		"round_robin",
		(payload) => (Array.isArray(payload.standings) ? payload.standings : []),
		[],
	);

	// ── Full-screen loading / error (before competition metadata arrives) ──────
	if (loading && !competition) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<LoadingSpinner label="Loading competition…" />
			</div>
		);
	}

	if (error || !competition) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-md w-full mx-4">
					<ErrorDisplay
						title="Unable to Load Competition"
						message={error || "Competition not found"}
						onRetry={refetch}
					/>
				</div>
			</div>
		);
	}

	return (
		<CompetitionPageShell competition={competition} headerIcon={BarChartIcon} showStatus>
			<TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

			<div className="flex-1 overflow-auto">
				{activeTab === "standings" && (
					<StandingsTable standings={standings} isIndividual={competition.individual ?? false} />
				)}
				{activeTab === "group_stage" && slug && (
					<GroupStageTab
						slug={slug}
						isIndividual={competition.individual ?? false}
						isActive={competition.status === "active"}
					/>
				)}
			</div>
		</CompetitionPageShell>
	);
};

export default PublicRoundRobin;
