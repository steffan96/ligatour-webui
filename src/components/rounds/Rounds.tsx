import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import PageWindow from '../shared/PageWindow'
import { useToastStore } from '../../api/stores/useToastStore'
import { listRounds, startRound } from '../../api/rounds'
import { SingleCompetitionContext } from '../competitions/SingleCompetition'
import Pagination from '../common/Pagination'

interface Match {
  id: number
  competition_id: number
  round_id: number
  home_team_id: number
  away_team_id: number
  home_team_name: string
  away_team_name: string
  home_score: number | null
  away_score: number | null
  status: 'scheduled' | 'in_progress' | 'completed' | 'bye'
  created_at: string
}

interface Round {
  id: number
  competition_id: number
  round_number: number
  stage: string
  status: 'scheduled' | 'in_progress' | 'completed'
  created_at: string
  matches: Match[]
}

const MatchStatusBadge = ({ status }: { status: Match['status'] }) => {
  const map: Record<Match['status'], { label: string; cls: string }> = {
    scheduled: { label: '🗓 Scheduled', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
    in_progress: { label: '🔴 Live', cls: 'bg-red-50 text-red-700 border-red-200 animate-pulse' },
    completed: { label: '✅ Final', cls: 'bg-green-50 text-green-800 border-green-200' },
    bye: { label: '⏭ Bye', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  }
  const { label, cls } = map[status] ?? map.scheduled
  return <span className={`text-xs font-bold px-2 py-0.5 rounded border ${cls}`}>{label}</span>
}

const ScoreDisplay = ({
  homeScore,
  awayScore,
  status,
}: {
  homeScore: number | null
  awayScore: number | null
  status: Match['status']
}) => {
  if (status === 'scheduled' || status === 'bye' || homeScore === null || awayScore === null) {
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

const MatchCard = ({ match }: { match: Match }) => {
  const isBye = match.status === 'bye'
  const homeWins =
    match.status === 'completed' &&
    match.home_score !== null &&
    match.away_score !== null &&
    match.home_score > match.away_score
  const awayWins =
    match.status === 'completed' &&
    match.home_score !== null &&
    match.away_score !== null &&
    match.away_score > match.home_score

  return (
    <div
      className={`bg-white rounded-lg border transition-shadow hover:shadow-md
        ${match.status === 'in_progress' ? 'border-red-200 shadow-sm' : isBye ? 'border-blue-100 bg-blue-50/30' : 'border-gray-200'}`}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
          <span className={`text-sm font-bold truncate text-right ${homeWins ? 'text-green-800' : 'text-gray-800'}`}>
            {match.home_team_name}
          </span>
          {homeWins && <span className="text-xs">🏆</span>}
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <ScoreDisplay homeScore={match.home_score} awayScore={match.away_score} status={match.status} />
          <MatchStatusBadge status={match.status} />
        </div>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {awayWins && <span className="text-xs">🏆</span>}
          <span className={`text-sm font-bold truncate ${isBye ? 'text-gray-400 italic' : awayWins ? 'text-green-800' : 'text-gray-800'}`}>
            {isBye ? 'Bye' : match.away_team_name}
          </span>
        </div>
      </div>
    </div>
  )
}

const RoundSection = ({ round, onSelect }: { round: Round; onSelect: () => void }) => (
  <div className="flex flex-col gap-2.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-gray-700">Round {round.round_number}</h2>
        {round.stage && (
          <span className="text-xs text-gray-400 font-medium capitalize">
            {round.stage.replace(/_/g, ' ')}
          </span>
        )}
      </div>
      <button
        onClick={onSelect}
        className="text-xs font-semibold text-green-700 hover:text-green-900 hover:underline transition-colors"
      >
        View details →
      </button>
    </div>
    {round.matches.map(match => (
      <MatchCard key={match.id} match={match} />
    ))}
  </div>
)

const NoRoundsState = ({ onStart, isStarting }: { onStart: () => void; isStarting: boolean }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
    <div className="text-4xl">🏁</div>
    <div>
      <p className="text-sm font-bold text-gray-700">No rounds yet</p>
      <p className="text-xs text-gray-500 mt-1 font-medium">Generate the first round of matches to get started.</p>
    </div>
    <button
      onClick={onStart}
      disabled={isStarting}
      className="bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-md
        hover:bg-green-800 flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      {isStarting ? 'Starting…' : '▶ Start First Round'}
    </button>
  </div>
)

const ROUNDS_PER_PAGE = 5

const Rounds = () => {
  const { competition } = useOutletContext<SingleCompetitionContext>()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()

  const [rounds, setRounds] = useState<Round[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await listRounds(Number(id))
        const data: Round[] = response.data ?? response
        setRounds(data)
      } catch (err: any) {
        showToast(err || 'Failed to load matches.', false)
        setRounds([])
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  const handleStartFirstRound = async () => {
    setIsStarting(true)
    try {
      const response = await startRound(competition.id)
      const data: Round[] = response.data ?? response
      setRounds(data)
      showToast('First round started!', true)
    } catch (err: any) {
      showToast(err || 'Failed to start round.', false)
    } finally {
      setIsStarting(false)
    }
  }

  const visibleRounds = rounds
    .filter(r => r.matches.length > 0)
    .sort((a, b) => a.round_number - b.round_number)

  const totalPages = Math.ceil(visibleRounds.length / ROUNDS_PER_PAGE)
  const startIndex = (currentPage - 1) * ROUNDS_PER_PAGE
  const paginatedRounds = visibleRounds.slice(startIndex, startIndex + ROUNDS_PER_PAGE)

  return (
    <PageWindow
      title={`Matches — ${competition.name}`}
      headerActionButtons={
        <button
          className="bg-gray-100 text-gray-900 text-sm font-semibold px-3.5 py-1.5
            rounded-md hover:bg-gray-200 flex items-center gap-2 transition-colors"
          onClick={() => navigate(`/competition/${id}`)}
        >
          <span>←</span> Back to settings
        </button>
      }
    >
      {isLoading ? (
        <div className="flex flex-col gap-2.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : rounds.length === 0 ? (
        <NoRoundsState onStart={handleStartFirstRound} isStarting={isStarting} />
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {paginatedRounds.map(round => (
              <RoundSection
                key={round.id}
                round={round}
                onSelect={() => navigate(`/competition/${id}/rounds/${round.id}`)}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={visibleRounds.length}
            itemLabel="rounds"
            onPageChange={page => {
              setCurrentPage(page)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        </>
      )}
    </PageWindow>
  )
}

export default Rounds