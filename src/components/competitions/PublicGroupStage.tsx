import { type CompetitionInterface, getPublicCompetition } from "api/competitions";
import { CompetitionPage, EmptyState } from "components/competitions/PublicCompetitionShared";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface GroupStageGroup {
	id: number;
	competition_id: number;
	group_number: number;
	name: string;
	status: string;
	created_at: string;
    updated_at: string;
}

const statusClass: Record<string, string> = {
	scheduled: "bg-yellow-50 text-yellow-700 border-yellow-200",
	active: "bg-green-50 text-green-700 border-green-200",
	completed: "bg-gray-100 text-gray-500 border-gray-200",
};

const PublicGroupStage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const [groups, setGroups] = useState<GroupStageGroup[]>([]);
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
			const response = await getPublicCompetition(`group_stage/${slug}`);
			setGroups(response.data.standings);
		} catch (err: any) {
			setError(err?.message || "Failed to load data.");
			setGroups([]);
		} finally {
			setLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (

			<div className="flex-1 overflow-auto p-5">
				{loading && !groups.length ? (
					<div className="flex items-center justify-center py-20">
						<span className="text-sm text-gray-400">Loading groups…</span>
					</div>
				) : error ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<p className="text-sm font-medium text-gray-500">Failed to load group stage</p>
							<button onClick={fetchData} className="mt-2 text-xs text-green-700 underline">
								Try again
							</button>
						</div>
					</div>
				) : groups.length === 0 ? (
					<EmptyState message="No group stage data yet" hint="Check back once the group stage begins" />
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
						{groups.map((g) => (
							<div key={g.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
								<div className="px-4 py-2.5 bg-green-900 flex items-center justify-between">
									<span className="text-xs font-bold text-white uppercase tracking-widest">{g.name}</span>
									<span
										className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
											statusClass[g.status] ?? "bg-gray-100 text-gray-500 border-gray-200"
										}`}
									>
										{g.status}
									</span>
								</div>
								<div className="p-6 text-center">
									<p className="text-sm text-gray-400">Group {g.group_number}</p>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
	);
};

export default PublicGroupStage;
