import {
	CompetitionPage,
	EmptyState,
	TabBar,
	type TabDef,
	useCompetitionData,
} from "components/competitions/PublicCompetitionShared";
import type React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Team {
	id: number;
	name: string;
	logo?: string;
}

interface GroupStanding {
	id: number;
	team_id: number;
	played: number;
	wins: number;
	draws: number;
	losses: number;
	goals_for: number;
	goals_against: number;
	goal_diff: number;
	points: number;
	team: Team;
	player_name?: string;
}

interface Group {
	id: number;
	name: string;
	standings: GroupStanding[];
}

interface GroupStandingsResponse {
	group_id: number;
	group_name: string;
	group_number: number;
	standings: GroupStanding[];
}

type Tab = "groups";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mapResponseToGroups = (raw: GroupStandingsResponse[]): Group[] =>
	raw.map((group) => ({
		id: group.group_id,
		name: group.group_name,
		standings: group.standings ?? [],
	}));

// ─── Icons ────────────────────────────────────────────────────────────────────

const GroupStageIcon = (
	<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={1.8}
			d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7
      20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0
      0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
		/>
	</svg>
);

// ─── RankBadge ────────────────────────────────────────────────────────────────

const badgeBase = "inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold";

const RankBadge = ({ rank }: { rank: number }) => {
	if (rank === 1) return <span className={`${badgeBase} bg-yellow-400 text-yellow-900`}>1</span>;
	if (rank === 2) return <span className={`${badgeBase} bg-gray-300 text-gray-700`}>2</span>;
	if (rank === 3) return <span className={`${badgeBase} bg-orange-300 text-orange-800`}>3</span>;
	return <span className={`${badgeBase} text-gray-400`}>{rank}</span>;
};

// ─── GroupTable ───────────────────────────────────────────────────────────────

const GROUP_HEADERS = [
	{ label: "#", title: "Rank", align: "left" },
	{ label: "Team", title: "Team", align: "left" },
	{ label: "MP", title: "Matches Played", align: "center" },
	{ label: "W", title: "Wins", align: "center" },
	{ label: "D", title: "Draws", align: "center" },
	{ label: "L", title: "Losses", align: "center" },
	{ label: "GF", title: "Goals For", align: "center" },
	{ label: "GA", title: "Goals Against", align: "center" },
	{ label: "GD", title: "Goal Difference", align: "center" },
	{ label: "Pts", title: "Points", align: "center" },
] as const;

const StatCell = ({ value }: { value: number | string }) => (
	<td className="px-3 py-3 text-xs text-center tabular-nums text-gray-600">{value}</td>
);

const GroupTable = ({ group, isIndividual }: { group: Group; isIndividual: boolean }) => (
	<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
		<div className="px-4 py-2.5 bg-green-900">
			<span className="text-xs font-bold text-white uppercase tracking-widest">{group.name}</span>
		</div>
		<div className="overflow-x-auto">
			<table className="min-w-full">
				<thead>
					<tr className="bg-gray-50 border-b border-gray-200">
						{GROUP_HEADERS.map((h) => (
							<th
								key={h.label}
								title={h.title}
								className={[
									"px-3 py-2.5 text-[10px] text-gray-400 uppercase tracking-widest cursor-default select-none",
									h.align === "center" ? "text-center" : "text-left",
								].join(" ")}
							>
								{h.label === "Team" ? (isIndividual ? "Player" : "Team") : h.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{group.standings.map((s, i) => {
						const rank = i + 1;
						const isTop = rank <= 2;
						return (
							<tr
								key={s.id}
								className={`transition-colors duration-100 ${
									isTop ? "bg-green-50/40 hover:bg-green-50" : "hover:bg-gray-50/60"
								}`}
							>
								<td className="px-3 py-3">
									<RankBadge rank={rank} />
								</td>
								<td className="px-3 py-3">
									<span className={`text-xs font-semibold ${isTop ? "text-green-900" : "text-gray-800"}`}>
										{isIndividual ? s.player_name : s.team?.name}
									</span>
								</td>
								<StatCell value={s.played} />
								<StatCell value={s.wins} />
								<StatCell value={s.draws} />
								<StatCell value={s.losses} />
								<StatCell value={s.goals_for} />
								<StatCell value={s.goals_against} />
								<StatCell value={s.goal_diff > 0 ? `+${s.goal_diff}` : s.goal_diff} />
								<td className="px-3 py-3 text-center">
									<span
										className="inline-flex items-center justify-center
									 min-w-[1.75rem] px-1.5 py-0.5 rounded-md bg-green-900 text-white 
									 text-xs font-bold tabular-nums shadow-sm"
									>
										{s.points}
									</span>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	</div>
);

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS: TabDef<Tab>[] = [
	{
		key: "groups",
		label: "Groups",
		icon: (
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.8}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7
          20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0
          0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		),
	},
];

// ─── Component ────────────────────────────────────────────────────────────────

interface PublicGroupStageProps {
	/** When provided the component renders as a slide-over panel;
	 *  when absent it renders as a standalone page (direct route). */
	onClose?: () => void;
}

const PublicGroupStage: React.FC<PublicGroupStageProps> = ({ onClose }) => {
	const { slug } = useParams<{ slug: string }>();
	const [activeTab, setActiveTab] = useState<Tab>("groups");

	const {
		competition,
		data: groups,
		loading,
		error,
		refetch,
	} = useCompetitionData<Group[]>(
		slug,
		"group_stage",
		(payload) => mapResponseToGroups(Array.isArray(payload.standings) ? payload.standings : []),
		[],
	);

	// ── Slide-over / embedded mode ─────────────────────────────────────────────
	if (onClose) {
		return (
			// Full-screen overlay
			<div className="fixed inset-0 z-40 flex">
				{/* Backdrop */}
				<div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

				{/* Panel — full-screen overlay */}
				<div className="relative flex flex-col w-full h-full bg-gray-50 shadow-2xl overflow-hidden">
					{/* Panel header */}
					<div className="flex items-center justify-between px-5 py-3 bg-green-900 flex-shrink-0">
						<div className="flex items-center gap-2.5">
							{GroupStageIcon}
							<span className="text-sm font-bold text-white">Group Stage</span>
						</div>
						<button
							onClick={onClose}
							className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
							aria-label="Close group stage"
						>
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Reuse TabBar + content area */}
					<TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
					<div className="flex-1 overflow-auto">
						{loading && !groups.length ? (
							<div className="flex items-center justify-center py-20">
								<span className="text-sm text-gray-400">Loading groups…</span>
							</div>
						) : error ? (
							<div className="flex items-center justify-center py-20">
								<div className="text-center">
									<p className="text-sm font-medium text-gray-500">Failed to load group stage</p>
									<button onClick={refetch} className="mt-2 text-xs text-green-700 underline">
										Try again
									</button>
								</div>
							</div>
						) : groups.length === 0 ? (
							<EmptyState message="No group stage data yet" hint="Check back once the group stage begins" />
						) : (
							<div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
								{groups.map((g) => (
									<GroupTable key={g.id} group={g} isIndividual={competition?.individual ?? false} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}

	// ── Standalone page mode (own route) ──────────────────────────────────────
	return (
		<CompetitionPage
			competition={competition}
			loading={loading}
			error={error}
			refetch={refetch}
			loadingLabel="Loading group stage…"
			errorTitle="Unable to Load Group Stage"
			headerIcon={GroupStageIcon}
			showStatus={false}
		>
			<TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
			<div className="flex-1 overflow-auto">
				{groups.length === 0 ? (
					<EmptyState message="No group stage data yet" hint="Check back once the group stage begins" />
				) : (
					<div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
						{groups.map((g) => (
							<GroupTable key={g.id} group={g} isIndividual={competition?.individual ?? false} />
						))}
					</div>
				)}
			</div>
		</CompetitionPage>
	);
};

export default PublicGroupStage;
