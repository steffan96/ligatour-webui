// PublicCompetition.tsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicCompetition, CompetitionInterface } from 'api/competitions'
import { CompetitionTypeDisplay } from '../../api/interfaces/competitions'

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
  </div>
)

// Error Component
const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
    <div className="text-red-600 text-6xl mb-4">⚠️</div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to Load Competition</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-green-900 text-white px-6 py-2 rounded-md hover:bg-green-800 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
)

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    inactive: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    active: 'bg-green-50 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-700 border-gray-300',
  }
  const labels: Record<string, string> = {
    inactive: '⏳ Not Started',
    active: '🟢 In Progress',
    completed: '✅ Completed',
  }
  return (
    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md border ${styles[status] ?? styles.inactive}`}>
      {labels[status] ?? status}
    </span>
  )
}

// Standings Table Component
const StandingsTable = ({ standings, competition }: { standings: any[]; competition: CompetitionInterface }) => {
  if (!standings || standings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No standings available yet.
      </div>
    )
  }

  const isIndividual = competition.individual

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rank</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              {isIndividual ? 'Player' : 'Team'}
            </th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">MP</th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">W</th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">D</th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">L</th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">GF</th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">GA</th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">GD</th>
            <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Pts</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {standings.map((standing, index) => (
            <tr key={standing.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-bold text-gray-900">
                {index + 1}
                {index === 0 && <span className="ml-2">🏆</span>}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                {isIndividual ? standing.player_name : standing.team_name}
              </td>
              <td className="px-4 py-3 text-sm text-center text-gray-700">{standing.matches_played}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-700">{standing.wins}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-700">{standing.draws}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-700">{standing.losses}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-700">{standing.goals_for}</td>
              <td className="px-4 py-3 text-sm text-center text-gray-700">{standing.goals_against}</td>
              <td className="px-4 py-3 text-sm text-center font-medium text-gray-900">
                {standing.goal_difference}
              </td>
              <td className="px-4 py-3 text-sm text-center font-bold text-green-900">
                {standing.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Points System Component
const PointsSystem = ({ competition }: { competition: CompetitionInterface }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h3 className="text-sm font-bold text-gray-900 mb-2">Points System</h3>
    <div className="flex gap-6 text-sm">
      <div>
        <span className="text-gray-600">Win:</span>
        <span className="ml-1 font-bold text-green-900">{competition.points_for_win}</span>
      </div>
      {competition.points_for_draw !== undefined && (
        <div>
          <span className="text-gray-600">Draw:</span>
          <span className="ml-1 font-bold text-green-900">{competition.points_for_draw}</span>
        </div>
      )}
      {competition.points_for_loss !== undefined && (
        <div>
          <span className="text-gray-600">Loss:</span>
          <span className="ml-1 font-bold text-green-900">{competition.points_for_loss}</span>
        </div>
      )}
    </div>
  </div>
)

// Tournament Info Component
const TournamentInfo = ({ competition }: { competition: CompetitionInterface }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h3 className="text-sm font-bold text-gray-900 mb-2">Tournament Info</h3>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-gray-600">Format:</span>
        <span className="ml-1 font-medium text-gray-900">
          {competition.individual ? 'Individual' : 'Team Based'}
        </span>
      </div>
      <div>
        <span className="text-gray-600">Type:</span>
        <span className="ml-1 font-medium text-gray-900">
          {CompetitionTypeDisplay[competition.type as keyof typeof CompetitionTypeDisplay] || competition.type}
        </span>
      </div>
      {competition.number_of_teams > 0 && (
        <div>
          <span className="text-gray-600">Participants:</span>
          <span className="ml-1 font-medium text-gray-900">{competition.number_of_teams}</span>
        </div>
      )}
      {competition.current_round > 0 && (
        <div>
          <span className="text-gray-600">Current Round:</span>
          <span className="ml-1 font-medium text-gray-900">{competition.current_round}</span>
        </div>
      )}
      {competition.has_third_place && (
        <div>
          <span className="text-gray-600">3rd Place Match:</span>
          <span className="ml-1 font-medium text-green-900">✓ Enabled</span>
        </div>
      )}
      {competition.two_legged && (
        <div>
          <span className="text-gray-600">Two-Legged:</span>
          <span className="ml-1 font-medium text-green-900">✓ Enabled</span>
        </div>
      )}
    </div>
  </div>
)

// Main Component
const PublicCompetition = () => {
  const { slug } = useParams<{ slug: string }>()
  const [competition, setCompetition] = useState<CompetitionInterface | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!slug) {
      setError('Invalid competition link')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await getPublicCompetition(slug)
      const competitionData = response?.data
      
      if (!competitionData) {
        throw new Error('Competition not found')
      }
      
      setCompetition(competitionData)
    } catch (err: any) {
      console.error('Failed to load competition:', err)
      setError(err?.message || 'Failed to load competition. The link may be invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [slug])

  // Auto-refresh every 30 seconds if competition is active
  useEffect(() => {
    if (competition?.status === 'active') {
      const interval = setInterval(() => {
        fetchData()
      }, 30000) // 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [competition?.status])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorDisplay message={error || 'Competition not found'} onRetry={fetchData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {competition.name}
              </h1>
              <div className="flex items-center gap-3">
                <StatusBadge status={competition.status} />
                <span className="text-sm text-gray-500">
                  {competition.individual ? 'Individual Competition' : 'Team Competition'}
                </span>
              </div>
            </div>
            {competition.status === 'active' && (
              <div className="text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
                Live Updates
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TournamentInfo competition={competition} />
          <PointsSystem competition={competition} />
        </div>

        {/* Standings Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              {competition.status === 'completed' ? 'Final Standings' : 'Current Standings'}
            </h2>
            {competition.status === 'active' && (
              <p className="text-sm text-gray-600 mt-1">
                Last updated: {new Date().toLocaleString()}
              </p>
            )}
          </div>
          <div className="p-6">
            {/* <StandingsTable standings={competition.standings || []} competition={competition} /> */}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} - Competition results and standings</p>
          <p className="mt-1">Data updates automatically every 30 seconds</p>
        </div>
      </div>
    </div>
  )
}

export default PublicCompetition