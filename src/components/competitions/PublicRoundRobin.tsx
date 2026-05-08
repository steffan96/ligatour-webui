import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicCompetition, CompetitionInterface } from 'api/competitions'

interface Team {
  id: number
  name: string
  logo: string
  competition_id: number
  created_at: string
  players: null | any[]
}

interface Standing {
  id: number
  competition_id: number
  team_id: number
  played: number
  wins: number
  draws: number
  losses: number
  goals_for: number
  goals_against: number
  goal_diff: number
  points: number
  buchholz_score: number
  sonneborn_berger_score: number
  updated_at: string
  created_at: string
  team: Team
  player_name?: string
}

const LoadingSpinner = () => (
  <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
    <div className="relative h-14 w-14">
      <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-4 border-t-green-900 animate-spin"></div>
    </div>
    <p className="text-sm text-gray-400 font-medium tracking-wide">Loading competition…</p>
  </div>
)

const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    <h3 className="text-base font-semibold text-gray-900 mb-1">Unable to Load Competition</h3>
    <p className="text-sm text-gray-500 mb-5 max-w-xs">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className={
          'inline-flex items-center gap-2 bg-green-900 text-white text-sm font-medium ' +
          'px-5 py-2 rounded-lg hover:bg-green-800 active:scale-95 transition-all duration-150'
        }
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581' +
              'm0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
            }
          />
        </svg>
        Try Again
      </button>
    )}
  </div>
)

const badgeBase = 'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shadow-sm'

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) return <span className={`${badgeBase} bg-yellow-400 text-yellow-900`}>1</span>
  if (rank === 2) return <span className={`${badgeBase} bg-gray-300 text-gray-700`}>2</span>
  if (rank === 3) return <span className={`${badgeBase} bg-orange-300 text-orange-800`}>3</span>
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-semibold text-gray-500">{rank}</span>
  )
}

const StatCell = ({ value }: { value: number | string }) => (
  <td className="px-4 py-3.5 text-sm text-center tabular-nums text-gray-600">{value}</td>
)

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
                'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586' +
                'a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              }
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-500">No standings data available yet</p>
        <p className="text-xs text-gray-400 mt-1">Check back once matches have been played</p>
      </div>
    )
  }

  const headers = [
    { label: '#', align: 'left', title: 'Rank' },
    { label: isIndividual ? 'Player' : 'Team', align: 'left', title: isIndividual ? 'Player' : 'Team' },
    { label: 'MP', align: 'center', title: 'Matches Played' },
    { label: 'W', align: 'center', title: 'Wins' },
    { label: 'D', align: 'center', title: 'Draws' },
    { label: 'L', align: 'center', title: 'Losses' },
    // { label: 'GF', align: 'center', title: 'Goals For' },
    // { label: 'GA', align: 'center', title: 'Goals Against' },
    // { label: 'GD', align: 'center', title: 'Goal Difference' },
    { label: 'Pts', align: 'center', title: 'Points' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map(h => (
              <th
                key={h.label}
                title={h.title}
                className={[
                  'px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest',
                  'cursor-default select-none',
                  h.align === 'center' ? 'text-center' : 'text-left',
                ].join(' ')}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {standings.map((standing, index) => {
            const rank = index + 1
            const isTop3 = rank <= 3
            return (
              <tr
                key={standing.id}
                className={`transition-colors duration-100 ${isTop3 ? 'bg-green-50/40 hover:bg-green-50' : 'hover:bg-gray-50/60'
                  }`}
              >
                <td className="px-4 py-3.5">
                  <RankBadge rank={rank} />
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-semibold ${isTop3 ? 'text-green-900' : 'text-gray-800'}`}>
                    {isIndividual ? standing.player_name : standing.team?.name}
                  </span>
                </td>
                <StatCell value={standing.played} />
                <StatCell value={standing.wins} />
                <StatCell value={standing.draws} />
                <StatCell value={standing.losses} />

                {/* Commented out to match the headers */}
                {/* <StatCell value={standing.goals_for} /> */}
                {/* <StatCell value={standing.goals_against} /> */}
                {/* <td className="px-4 py-3.5 text-sm text-center tabular-nums">
                  <span
                    className={`font-medium ${
                      standing.goal_diff > 0
                        ? 'text-green-700'
                        : standing.goal_diff < 0
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {standing.goal_diff > 0 ? '+' : ''}
                    {standing.goal_diff}
                  </span>
                </td> */}

                <td className="px-4 py-3.5 text-center">
                  <span
                    className={
                      'inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 ' +
                      'rounded-md bg-green-900 text-white text-sm font-bold tabular-nums shadow-sm'
                    }
                  >
                    {standing.points}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const StatusBadge = ({ status }: { status?: string }) => {
  if (!status) return null
  const map: Record<string, { label: string; classes: string; dot: string }> = {
    active: {
      label: 'Live',
      classes: 'bg-green-100 text-green-800 border-green-200',
      dot: 'bg-green-500 animate-pulse',
    },
    completed: { label: 'Completed', classes: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
    pending: { label: 'Upcoming', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200', dot: 'bg-yellow-400' },
  }
  const cfg = map[status] ?? { label: status, classes: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' }
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {cfg.label}
    </span>
  )
}

const PublicRoundRobin = () => {
  const { type, slug } = useParams<{ type: string; slug: string }>();
  const [competition, setCompetition] = useState<CompetitionInterface | null>(null)
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!slug || !type) {
      setError('Invalid competition link')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await getPublicCompetition(type, slug)
      const { competition: competitionData, standings: standingsData } = response.data
      if (!competitionData) throw new Error('Competition not found')
      setCompetition(competitionData)
      setStandings(Array.isArray(standingsData) ? standingsData : [])
    } catch (err: any) {
      console.error('Failed to load competition:', err)
      setError(err || 'Failed to load competition. The link may be invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [slug])

  useEffect(() => {
    if (competition?.status === 'active') {
      const interval = setInterval(() => {
        fetchData()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [competition?.status])

  if (loading && !competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-md w-full mx-4">
          <ErrorDisplay message={error || 'Competition not found'} onRetry={fetchData} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div
                className={
                  'flex-shrink-0 w-10 h-10 bg-green-900 rounded-lg ' + 'flex items-center justify-center shadow-sm'
                }
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">{competition.name}</h1>
                {competition.type && (
                  <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wide">{competition.type}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={competition.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">Standings</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <StandingsTable standings={standings} isIndividual={competition.individual || false} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicRoundRobin
