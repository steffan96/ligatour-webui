import { getPublicCompetition } from 'api/competitions';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';

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

interface GroupStageTabProps {
  /** The slug from useParams — forwarded by the parent page. */
  slug: string;
  /** Whether the competition uses individual players rather than teams. */
  isIndividual?: boolean;
  /** Pass `true` while the parent page knows the competition is active so we
   *  can auto-refresh every 30 s. */
  isActive?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center min-h-[300px] gap-4">
    <div className="relative h-12 w-12">
      <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
      <div className="absolute inset-0 rounded-full border-4 border-t-green-900 animate-spin" />
    </div>
    <p className="text-sm text-gray-400 font-medium tracking-wide">Loading groups…</p>
  </div>
);

const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-6">
    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-3">
      <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={
            'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 ' +
            '2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 ' +
            '0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
          }
        />
      </svg>
    </div>
    <p className="text-sm font-semibold text-gray-800 mb-1">Unable to Load Groups</p>
    <p className="text-xs text-gray-500 mb-4 max-w-xs">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-green-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-800 active:scale-95 transition-all duration-150"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Try Again
      </button>
    )}
  </div>
);

const EmptyGroups = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3">
      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
    <p className="text-sm font-medium text-gray-500">No group stage data yet</p>
    <p className="text-xs text-gray-400 mt-1">Check back once the group stage begins</p>
  </div>
);

const badgeBase =
  'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shadow-sm flex-shrink-0';

const RankBadge = ({ rank, total }: { rank: number; total: number }) => {
  // highlight top qualifier slots (first 2 by default) and danger zone (last)
  if (rank === 1) return <span className={`${badgeBase} bg-yellow-400 text-yellow-900`}>{rank}</span>;
  if (rank === 2) return <span className={`${badgeBase} bg-gray-300 text-gray-700`}>{rank}</span>;
  if (rank === total) return <span className={`${badgeBase} bg-red-100 text-red-500`}>{rank}</span>;
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-gray-400 flex-shrink-0">
      {rank}
    </span>
  );
};

const GroupTable = ({ group, isIndividual }: { group: Group; isIndividual: boolean }) => {
  const { standings } = group;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Group header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-green-900 flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">{group.name}</span>
      </div>

      {standings.length === 0 ? (
        <div className="py-8 text-center text-xs text-gray-400">No teams in this group yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pl-4 pr-2 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest w-8">
                  #
                </th>
                <th className="px-2 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {isIndividual ? 'Player' : 'Team'}
                </th>
                {['MP', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map((h) => (
                  <th
                    key={h}
                    title={
                      h === 'MP'
                        ? 'Matches Played'
                        : h === 'W'
                          ? 'Wins'
                          : h === 'D'
                            ? 'Draws'
                            : h === 'L'
                              ? 'Losses'
                              : h === 'GF'
                                ? 'Goals For'
                                : h === 'GA'
                                  ? 'Goals Against'
                                  : h === 'GD'
                                    ? 'Goal Difference'
                                    : 'Points'
                    }
                    className={[
                      'px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest',
                      h === 'Pts' ? 'text-green-900' : 'text-gray-400',
                    ].join(' ')}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {standings.map((s, idx) => {
                const rank = idx + 1;
                const isQualifier = rank <= 2;
                return (
                  <tr
                    key={s.id}
                    className={[
                      'transition-colors duration-100',
                      isQualifier ? 'bg-green-50/30 hover:bg-green-50/60' : 'hover:bg-gray-50/60',
                    ].join(' ')}
                  >
                    <td className="pl-4 pr-2 py-3">
                      <RankBadge rank={rank} total={standings.length} />
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={[
                          'text-xs font-semibold truncate block max-w-[120px]',
                          isQualifier ? 'text-green-900' : 'text-gray-700',
                        ].join(' ')}
                      >
                        {isIndividual ? s.player_name : s.team?.name}
                      </span>
                    </td>
                    {[
                      s.played,
                      s.wins,
                      s.draws,
                      s.losses,
                      s.goals_for,
                      s.goals_against,
                      s.goal_diff > 0 ? `+${s.goal_diff}` : s.goal_diff,
                    ].map((val, i) => (
                      <td key={i} className="px-2 py-3 text-center text-xs tabular-nums text-gray-500">
                        {val}
                      </td>
                    ))}
                    <td className="px-2 py-3 text-center">
                      <span className="inline-flex items-center justify-center min-w-[1.75rem] px-1.5 py-0.5 rounded-md bg-green-900 text-white text-xs font-bold tabular-nums shadow-sm">
                        {s.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Qualifier legend */}
      {standings.length > 0 && (
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
      )}
    </div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────

export const GroupStageTab: React.FC<GroupStageTabProps> = ({ slug, isIndividual = false, isActive = false }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!slug) {
      setError('Invalid competition link');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getPublicCompetition(`group_stage/${slug}`);
      const { groups: rawGroups } = response.data;
      setGroups(Array.isArray(rawGroups) ? rawGroups : []);
    } catch (err: any) {
      console.error('Failed to load group stage:', err);
      setError(err?.message || 'Failed to load group stage data.');
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} />;
  if (groups.length === 0) return <EmptyGroups />;

  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {groups.map((group) => (
        <GroupTable key={group.id} group={group} isIndividual={isIndividual} />
      ))}
    </div>
  );
};

export default GroupStageTab;
