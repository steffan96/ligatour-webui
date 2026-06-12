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
}

const statusClass: Record<string, string> = {
	scheduled: "bg-yellow-50 text-yellow-700 border-yellow-200",
	active: "bg-green-50 text-green-700 border-green-200",
	completed: "bg-gray-100 text-gray-500 border-gray-200",
};

const PublicGroupStage: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const [competition, setCompetition] = useState<CompetitionInterface | null>(null);
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
			const [compRes, stageRes] = await Promise.all([
				getPublicCompetition(slug),
				getPublicCompetition(`group_stage/${slug}`),
			]);
			setCompetition(compRes.data.competition ?? null);
			setGroups(stageRes.data.standings ?? []);
		} catch (err: any) {
			console.error("[PublicGroupStage]", err);
			setError(err?.message || "Failed to load group stage");
		} finally {
			setLoading(false);
		}
	}, [slug]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		if (competition?.status !== "active") return;
		const id = setInterval(fetchData, 30_000);
		return () => clearInterval(id);
	}, [competition?.status, fetchData]);

	return (
		<CompetitionPage
			competition={competition}
			loading={loading}
			error={error}
			refetch={fetchData}
			loadingLabel="Loading group stage…"
			errorTitle="Unable to Load Group Stage"
			headerIcon={
				<svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.8}
						d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			}
			showStatus={false}
		>
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
		</CompetitionPage>
	);
};

export default PublicGroupStage;
