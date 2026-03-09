import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition, addTeamToCompetition } from 'api/competitions'
import PageWindow from '../shared/PageWindow'
import { useToastStore } from '../../api/stores/useToastStore'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-gray-900">{label}</label>
    {children}
  </div>
)

const inputCls = (readOnly?: boolean) =>
  `w-full px-2.5 py-1.5 border border-gray-300 rounded-md 
   text-sm font-medium focus:ring-2 
   focus:ring-green-900 focus:border-green-900 ${readOnly ? 'bg-gray-50 text-gray-700' : 'text-gray-900'}`

const SectionHeader = ({ label }: { label: string }) => (
  <p className="text-sm font-bold text-gray-900 mb-2.5 pb-1.5 border-b border-gray-300">
    {label}
  </p>
)

const TeamCard = ({
  team,
  index,
  onRemove,
  onEdit,
  editingId,
}: {
  team: any
  index: number
  onRemove: () => void
  onEdit: () => void
  editingId: number | null
}) => (
  <div
    className={`border rounded-md p-4 ${
      editingId === index ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'
    } transition-all`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">{team.name}</p>
        {team.city && <p className="text-xs text-gray-600 mt-1">{team.city}</p>}
        {team.players && team.players.length > 0 && (
          <p className="text-xs font-medium text-gray-700 mt-2">
            {team.players.length} player{team.players.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="text-blue-900 hover:text-blue-700 text-xs font-semibold
                     px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200
                     hover:bg-blue-100 transition-colors"
        >
          ✏️ Edit
        </button>
        <button
          onClick={onRemove}
          className="text-red-900 hover:text-red-700 text-xs font-semibold
                     px-2.5 py-1 rounded-md bg-red-50 border border-red-200
                     hover:bg-red-100 transition-colors"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  </div>
)

const CompetitionTeams = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()

  const [competition, setCompetition] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const [newTeam, setNewTeam] = useState({ name: '', city: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTeam, setEditingTeam] = useState<any>(null)

  useEffect(() => {
    if (!id) return

    const fetchCompetition = async () => {
      try {
        const response = await getCompetition(Number(id))
        setCompetition(response?.data || null)
      } catch (err: any) {
        showToast(err || 'Failed to load competition.', false)
        navigate('/competitions')
      }
    }

    fetchCompetition()
  }, [id, navigate, showToast])

  if (!competition) return null

  const handleAddTeam = async () => {
    if (!newTeam.name.trim()) {
      showToast('Team name is required', false)
      return
    }
    if (!id) {
      showToast('Competition ID is missing', false)
      return
    }
    try {
      const teamId = `team_${id}_${teams.length}`
      const teamData = {
        ...newTeam,
        id: teamId,
        players: [],
      }
      await addTeamToCompetition(id, teamId)
      setTeams([...teams, teamData])
      setNewTeam({ name: '', city: '' })
      setIsAdding(false)
      showToast('Team added successfully!', true)
    } catch (err: any) {
      showToast(err || 'Failed to add team', false)
    }
  }

  const handleUpdateTeam = () => {
    if (!editingTeam.name.trim()) {
      showToast('Team name is required', false)
      return
    }
    if (editingId === null) {
      return
    }
    const updated = [...teams]
    updated[editingId] = editingTeam
    setTeams(updated)
    setEditingId(null)
    setEditingTeam(null)
    showToast('Team updated successfully!', true)
  }

  const handleRemoveTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index))
    showToast('Team removed', true)
  }

  const handleEditTeam = (index: number) => {
    setEditingId(index)
    setEditingTeam({ ...teams[index] })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setEditingTeam(null)
    setNewTeam({ name: '', city: '' })
  }

  return (
    <PageWindow
      title={`Manage Teams - ${competition.name}`}
      headerActionButtons={
        <div className="flex items-center gap-3">
          <button
            className="bg-gray-100 text-gray-900 text-sm 
                       font-semibold px-3.5 py-1.5 rounded-md 
                       hover:bg-gray-200 flex items-start gap-2 
                       transition-colors"
            onClick={() => navigate(`/competition/${id}`)}
          >
            <span>←</span> Back to Competition
          </button>
          {!isAdding && editingId === null && (
            <button
              className="bg-green-900 text-white text-sm font-bold 
                         px-3.5 py-1.5 rounded-md hover:bg-green-800 
                         transition-colors"
              onClick={() => setIsAdding(true)}
            >
              ➕ Add Team
            </button>
          )}
        </div>
      }
    >
      {/* Add Team Form */}
      {isAdding && (
        <div className="border border-green-300 bg-green-50 rounded-md p-4">
          <SectionHeader label="Add New Team" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Team Name">
              <input
                type="text"
                value={newTeam.name}
                onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                className={inputCls()}
                placeholder="Enter team name"
                autoFocus
              />
            </Field>
            <Field label="City">
              <input
                type="text"
                value={newTeam.city}
                onChange={e => setNewTeam({ ...newTeam, city: e.target.value })}
                className={inputCls()}
                placeholder="Enter city (optional)"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-3 mt-3 border-t border-green-200">
            <button
              onClick={handleCancel}
              className="bg-gray-100 text-gray-900 font-bold py-1.5 
                         px-6 rounded-md text-sm hover:bg-gray-200 
                         transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddTeam}
              className="bg-green-900 text-white font-bold py-1.5 
                         px-6 rounded-md text-sm hover:bg-green-800 
                         transition-colors"
            >
              ✓ Add Team
            </button>
          </div>
        </div>
      )}

      {/* Edit Team Form */}
      {editingId !== null && editingTeam && (
        <div className="border border-blue-300 bg-blue-50 rounded-md p-4">
          <SectionHeader label={`Edit Team: ${editingTeam.name}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Team Name">
              <input
                type="text"
                value={editingTeam.name}
                onChange={e => setEditingTeam({ ...editingTeam, name: e.target.value })}
                className={inputCls()}
                placeholder="Enter team name"
                autoFocus
              />
            </Field>
            <Field label="City">
              <input
                type="text"
                value={editingTeam.city || ''}
                onChange={e => setEditingTeam({ ...editingTeam, city: e.target.value })}
                className={inputCls()}
                placeholder="Enter city (optional)"
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-3 mt-3 border-t border-blue-200">
            <button
              onClick={handleCancel}
              className="bg-gray-100 text-gray-900 font-bold py-1.5 
                         px-6 rounded-md text-sm hover:bg-gray-200 
                         transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateTeam}
              className="bg-blue-900 text-white font-bold py-1.5 
                         px-6 rounded-md text-sm hover:bg-blue-800 
                         transition-colors"
            >
              ✓ Update Team
            </button>
          </div>
        </div>
      )}

      {/* Teams List */}
      <div>
        <SectionHeader label={`Teams (${teams.length})`} />
        {teams.length === 0 ? (
          <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
            <p className="text-sm text-gray-600">No teams added yet</p>
            {!isAdding && editingId === null && (
              <button
                onClick={() => setIsAdding(true)}
                className="mt-3 text-blue-900 hover:text-blue-700 text-sm font-semibold
                           px-4 py-1.5 rounded-md bg-blue-50 border border-blue-200
                           hover:bg-blue-100 transition-colors"
              >
                ➕ Add First Team
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {teams.map((team, index) => (
              <TeamCard
                key={index}
                team={team}
                index={index}
                onRemove={() => handleRemoveTeam(index)}
                onEdit={() => handleEditTeam(index)}
                editingId={editingId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {teams.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
          <p className="text-sm font-semibold text-blue-900">
            📊 Summary: {teams.length} team{teams.length !== 1 ? 's' : ''} added
          </p>
          <p className="text-xs text-blue-700 mt-2">
            Total players: {teams.reduce((sum, team) => sum + (team.players?.length || 0), 0)}
          </p>
        </div>
      )}

      {/* Save Changes */}
      <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-gray-300">
        <button
          onClick={() => navigate(`/competition/${id}`)}
          className="bg-gray-100 text-gray-900 font-bold py-2 
                     px-7 rounded-md text-sm hover:bg-gray-200 
                     transition-colors"
        >
          ← Back
        </button>
        <button
          disabled={teams.length === 0}
          className="bg-green-900 text-white font-bold py-2 
                     px-7 rounded-md text-sm hover:bg-green-800 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💾 Save Teams
        </button>
      </div>
    </PageWindow>
  )
}

export default CompetitionTeams
