import {
	CompetitionPage,
	CompetitionTabContent,
	EmptyState,
	type TabDef,
	useCompetitionData,
} from "components/competitions/PublicCompetitionShared";
import PublicGroupStage from "components/competitions/PublicGroupStage";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

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
	team: { id: number; name: string; logo: string; competition_id: number; created_at: string; players: null | any[] };
	player_name?: string;
}

type Tab = "standings";

// ─── RankBadge ────────────────────────────────────────────────────────────────

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

// ─── StandingsTable ───────────────────────────────────────────────────────────

const StatCell = ({ value }: { value: number | string }) => (
	<td className="px-4 py-3.5 text-sm text-center tabular-nums text-gray-600">{value}</td>
);

const HEADERS = [
	{ label: "#", title: "Rank", align: "left" },
	{ label: "MP", title: "Matches Played", align: "center" },
	{ label: "W", title: "Wins", align: "center" },
	{ label: "D", title: "Draws", align: "center" },
	{ label: "L", title: "Losses", align: "center" },
	{ label: "Pts", title: "Points", align: "center" },
] as const;

const StandingsTable = ({ standings, isIndividual }: { standings: Standing[]; isIndividual: boolean }) => {
	if (!standings || standings.length === 0) {
		return <EmptyState message="No standings data available yet" hint="Check back once matches have been played" />;
	}

	const entityHeader = {
		label: isIndividual ? "Player" : "Team",
		title: isIndividual ? "Player" : "Team",
		align: "left",
	} as const;
	const headers = [HEADERS[0], entityHeader, ...HEADERS.slice(1)];

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
						//TODO standings are leftover. it should be named competitionteam
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

// ─── Tab / icon definitions ───────────────────────────────────────────────────

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
];

// ─── Page component ───────────────────────────────────────────────────────────

const PublicRoundRobin = () => {
	const { slug } = useParams<{ slug: string }>();
	const [activeTab, setActiveTab] = useState<Tab>("standings");
	const [showGroupStage, setShowGroupStage] = useState(false);

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

	return (
		<CompetitionPage
			competition={competition}
			loading={loading}
			error={error}
			refetch={refetch}
			loadingLabel="Loading competition…"
			errorTitle="Unable to Load Competition"
			headerIcon={BarChartIcon}
			showStatus
		>
			<CompetitionTabContent
				tabs={TABS}
				activeTab={activeTab}
				onTabChange={setActiveTab}
				onAction={() => setShowGroupStage(true)}
				actionLabel="Playoffs"
			>
				{activeTab === "standings" && (
					<StandingsTable standings={standings} isIndividual={competition?.individual ?? false} />
				)}
			</CompetitionTabContent>
			{showGroupStage && <PublicGroupStage onClose={() => setShowGroupStage(false)} />}
		</CompetitionPage>
	);
};

export default PublicRoundRobin;
