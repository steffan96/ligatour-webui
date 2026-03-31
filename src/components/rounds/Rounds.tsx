import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import PageWindow from '../shared/PageWindow'
import { useToastStore } from '../../api/stores/useToastStore'
import { listRounds } from '../../api/rounds'
import { SingleCompetitionContext } from '../competitions/SingleCompetition'

interface Pairing {
  id: number
  home_team: string
  away_team: string
  home_score: number | null
  away_score: number | null
  round: number
  status: 'scheduled' | 'in_progress' | 'completed'
  date?: string
}

const RoundTab = ({
  round,
  isActive,
  onClick,
  isCurrent,
}: {
  round: number
  isActive: boolean
  onClick: () => void
  isCurrent: boolean
}) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 text-sm font-semibold rounded-md transition-all duration-150
      ${
        isActive
          ? 'bg-green-900 text-white shadow-sm'
          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
      }`}
  >
    Round {round}
    {isCurrent && !isActive && (
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
    )}
  </button>
)

const MatchStatusBadge = ({ status }: { status: Pairing['status'] }) => {
  const map: Record<Pairing['status'], { label: string; cls: string }> = {
    scheduled: { label: '🗓 Scheduled', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
    in_progress: { label: '🔴 Live', cls: 'bg-red-50 text-red-700 border-red-200 animate-pulse' },
    completed: { label: '✅ Final', cls: 'bg-green-50 text-green-800 border-green-200' },
  }
  const { label, cls } = map[status] ?? map.scheduled
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${cls}`}>{label}</span>
  )
}

const ScoreDisplay = ({
  homeScore,
  awayScore,
  status,
}: {
  homeScore: number | null
  awayScore: number | null
  status: Pairing['status']
}) => {
  if (status === 'scheduled' || homeScore === null || awayScore === null) {
    return (
      <div className="flex items-center gap-2 text-gray-400 font-bold text-lg">
        <span>-</span>
        <span className="text-xs font-medium">vs</span>
        <span>-</span>
      </div>
    )
  }

  const homeWins = homeScore > awayScore
  const awayWins = awayScore > homeScore

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xl font-black tabular-nums ${homeWins ? 'text-green-800' : awayWins ? 'text-gray-400' : 'text-gray-700'}`}>
        {homeScore}
      </span>
      <span className="text-xs font-bold text-gray-400">:</span>
      <span className={`text-xl font-black tabular-nums ${awayWins ? 'text-green-800' : homeWins ? 'text-gray-400' : 'text-gray-700'}`}>
        {awayScore}
      </span>
    </div>
  )
}

const MatchCard = ({ pairing }: { pairing: Pairing }) => {
  const homeWins =
    pairing.status === 'completed' &&
    pairing.home_score !== null &&
    pairing.away_score !== null &&
    pairing.home_score > pairing.away_score

  const awayWins =
    pairing.status === 'completed' &&
    pairing.home_score !== null &&
    pairing.away_score !== null &&
    pairing.away_score > pairing.home_score

  return (
    <div
      className={`bg-white rounded-lg border transition-shadow hover:shadow-md
        ${pairing.status === 'in_progress' ? 'border-red-200 shadow-sm' : 'border-gray-200'}`}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
          <span className={`text-sm font-bold truncate text-right ${homeWins ? 'text-green-800' : 'text-gray-800'}`}>
            {pairing.home_team}
          </span>
          {homeWins && <span className="text-xs">🏆</span>}
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <ScoreDisplay
            homeScore={pairing.home_score}
            awayScore={pairing.away_score}
            status={pairing.status}
          />
          <MatchStatusBadge status={pairing.status} />
        </div>

        <div className="flex-1 flex items-center gap-2 min-w-0">
          {awayWins && <span className="text-xs">🏆</span>}
          <span className={`text-sm font-bold truncate ${awayWins ? 'text-green-800' : 'text-gray-800'}`}>
            {pairing.away_team}
          </span>
        </div>
      </div>

      {pairing.date && (
        <div className="px-4 pb-2.5 flex justify-center">
          <span className="text-xs text-gray-400 font-medium">{pairing.date}</span>
        </div>
      )}
    </div>
  )
}

const EmptyState = ({ round }: { round: number }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-4xl mb-3">📋</div>
    <p className="text-sm font-bold text-gray-700">No matches for Round {round}</p>
    <p className="text-xs text-gray-500 mt-1 font-medium">
      Matches will appear here once they are generated.
    </p>
  </div>
)

const Rounds = () => {
  const { competition } = useOutletContext<SingleCompetitionContext>()
  const { id, roundId } = useParams<{ id: string; roundId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()

  const currentRound = competition.current_round ?? 1
  const activeRound = roundId ? Number(roundId) : currentRound

  const [pairings, setPairings] = useState<Pairing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await listRounds(Number(id))
        setPairings(response.data ?? response)
      } catch (err: any) {
        showToast(err || 'Failed to load matches.', false)
        setPairings([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id, activeRound])

  const handleRoundChange = (round: number) => {
    navigate(`/competition/${id}/${round}/rounds`)
  }

  const roundNumbers = Array.from({ length: currentRound }, (_, i) => i + 1)

  return (
    <PageWindow
      title={`Matches — ${competition.name}`}
      headerActionButtons={
        <div className="flex items-center gap-3">
          <button
            className="bg-green-700 text-white 
            text-sm font-semibold px-3.5 py-1.5 rounded-md hover:bg-green-800 flex items-center gap-2 transition-colors"
          >
            <span>▶</span> Start Round
          </button>
          <button
            className="bg-gray-100 text-gray-900 
            text-sm font-semibold px-3.5 py-1.5 rounded-md hover:bg-gray-200 flex items-start gap-2 transition-colors"
            onClick={() => navigate(`/competition/${id}`)}
          >
            <span>←</span> Back to competition
          </button>
        </div>
      }
    >
      {roundNumbers.length > 1 && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Select Round
          </p>
          <div className="flex flex-wrap gap-2">
            {roundNumbers.map(r => (
              <RoundTab
                key={r}
                round={r}
                isActive={activeRound === r}
                isCurrent={r === currentRound}
                onClick={() => handleRoundChange(r)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Round {activeRound}
            {activeRound === currentRound && (
              <span className="ml-2 text-xs 
              font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
                Current
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {pairings.length} match{pairings.length !== 1 ? 'es' : ''}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : pairings.length === 0 ? (
        <EmptyState round={activeRound} />
      ) : (
        <div className="flex flex-col gap-2.5">
          {pairings.map(pairing => (
            <MatchCard key={pairing.id} pairing={pairing} />
          ))}
        </div>
      )}
    </PageWindow>
  )
}

export default Rounds