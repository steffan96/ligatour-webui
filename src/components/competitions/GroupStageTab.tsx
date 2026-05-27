import { getPublicGroupStageCompetition } from "api/competitions";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { ErrorDisplay, LoadingSpinner } from "./PublicCompetitionShared";

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

interface GroupStageTabProps {
	slug: string;
	isIndividual?: boolean;
	isActive?: boolean;
}

const mapResponseToGroups = (raw: GroupStandingsResponse[]): Group[] =>
	raw.map((g) => ({
		id: g.group_id,
		name: g.group_name,
		standings: g.standings ?? [],
	}));

const EmptyGroups = () => (
	<div className="flex flex-col items-center justify-center py-16 text-center">
		<div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
			<svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 
          20H2v-2a3
           3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002
            0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		</div>
		<p className="text-sm font-medium text-gray-500">No group stage data yet</p>
		<p className="text-xs text-gray-400 mt-1">Check back once the group stage begins</p>
	</div>
);

const GroupTable = ({ group }: { group: Group }) => {
	const { standings } = group;

	if (standings.length === 0) {
		return null;
	}

	return (
		<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
			<div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
				<div className="w-6 h-6 rounded bg-green-900 flex items-center justify-center flex-shrink-0">
					<svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 
              20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3
               0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 
               0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</div>
				<span className="text-sm font-bold text-gray-700 uppercase tracking-wider">{group.name}</span>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full">{/* rest stays the same */}</table>
			</div>

			<div className="px-4 py-2 border-t border-gray-100 bg-gray-50/60 flex items-center gap-3">
				<span className="flex items-center gap-1.5 text-[10px] text-gray-400">
					<span className="w-2 h-2 rounded-sm bg-green-100 border border-green-300 flex-shrink-0" />
					Qualifies / Advances
				</span>
				<span className="flex items-center gap-1.5 text-[10px] text-gray-400">
					<span className="w-2 h-2 rounded-sm bg-red-100 border border-red-200 flex-shrink-0" />
					Eliminated
				</span>
			</div>
		</div>
	);
};
export const GroupStageTab: React.FC<GroupStageTabProps> = ({ slug, isIndividual = false, isActive = false }) => {
	const [groups, setGroups] = useState<Group[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		if (!slug) {
			setError("Invalid competition link");
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const response = await getPublicGroupStageCompetition(slug);
			const { standings } = response.data;
			setGroups(Array.isArray(standings) ? mapResponseToGroups(standings) : []);
		} catch (err: any) {
			console.error("Failed to load group stage:", err);
			setError(typeof err === "string" ? err : err?.message || "Failed to load group stage data.");
		} finally {
			setLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		if (!isActive) return;
		const interval = setInterval(fetchData, 30_000);
		return () => clearInterval(interval);
	}, [isActive, fetchData]);

	if (loading) return <LoadingSpinner label="Loading groups…" />;
	if (error) return <ErrorDisplay title="Unable to Load Groups" message={error} onRetry={fetchData} />;
	if (groups.length === 0) return <EmptyGroups />;

	return (
		<div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
			{groups.map((group) => (
				<GroupTable key={group.id} group={group} />
			))}
		</div>
	);
};

export default GroupStageTab;
