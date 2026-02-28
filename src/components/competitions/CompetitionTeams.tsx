import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { listTeams } from 'api/teams'
import { getCompetitionTeams, addTeamToCompetition, removeTeamFromCompetition } from 'api/competitions'

interface Team {
  id: string
  name: string
  short_name?: string
}

export default function CompetitionTeamsComponent() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [memberIds, setMemberIds] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([listTeams(), getCompetitionTeams(id)])
      .then(([teams, members]) => {
        setAllTeams(teams || [])
        setMemberIds(new Set((members || []).map((t: Team) => t.id)))
      })
      .catch(() => setError('Failed to load teams.'))
      .finally(() => setLoading(false))
  }, [id])

  const filtered = allTeams.filter(t =>
    !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggle = async (team: Team) => {
    if (!id || pendingId) return
    setPendingId(team.id)
    setError(null)
    try {
      if (memberIds.has(team.id)) {
        await removeTeamFromCompetition(id, team.id)
        setMemberIds(prev => { const s = new Set(prev); s.delete(team.id); return s })
      } else {
        await addTeamToCompetition(id, team.id)
        setMemberIds(prev => new Set(prev).add(team.id))
      }
    } catch {
      setError('Failed to update team. Please try again.')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="h-full w-full mr-auto p-4">
      <div className="bg-white rounded-2xl shadow overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="bg-green-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="bg-green-800 text-white text-xs 
              font-semibold px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => navigate(`/competitions/${id}`)}
            >
              ←
            </button>
            <div>
              <h1 className="text-white text-xl font-semibold">Teams</h1>
              <p className="text-green-200 text-xs mt-0.5">
                {memberIds.size} team{memberIds.size !== 1 ? 's' : ''} in this competition
              </p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search teams..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg 
            border-0 focus:ring-2 focus:ring-green-400 bg-green-800
             text-white placeholder-green-300 focus:bg-green-700 transition-colors"
          />
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-auto space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          {loading ? (
            <p className="text-gray-400 text-sm text-center py-8">Loading teams…</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No teams found</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700 pb-1 border-b">
                {filtered.length} team{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-2">
                {filtered.map(team => {
                  const isMember = memberIds.has(team.id)
                  const isPending = pendingId === team.id
                  return (
                    <div
                      key={team.id}
                      className="flex items-center justify-between px-4 py-3 
                      border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{team.name}</p>
                        {team.short_name && (
                          <p className="text-xs text-gray-400">{team.short_name}</p>
                        )}
                      </div>
                      <button
                        onClick={() => toggle(team)}
                        disabled={!!pendingId}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                          isMember
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                        }`}
                      >
                        {isPending ? '…' : isMember ? 'Remove' : 'Add'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}