import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition, addPlayerToCompetition } from 'api/competitions'
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

const PlayerCard = ({
  player,
  index,
  onRemove,
  onEdit,
  editingId,
}: {
  player: any
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
        <p className="text-sm font-bold text-gray-900">
          {player.firstName} {player.lastName}
        </p>
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

const CompetitionPlayers = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()

  const [competition, setCompetition] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [newPlayer, setNewPlayer] = useState({ firstName: '', lastName: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)

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

  const handleAddPlayer = async () => {
    if (!newPlayer.firstName.trim() || !newPlayer.lastName.trim()) {
      showToast('First name and last name are required', false)
      return
    }
    if (!id) {
      showToast('Competition ID is missing', false)
      return
    }
    try {
      const playerId = `player_${id}_${players.length}`
      const playerData = {
        ...newPlayer,
        id: playerId,
      }
      await addPlayerToCompetition(id, playerId)
      setPlayers([...players, playerData])
      setNewPlayer({ firstName: '', lastName: '' })
      setIsAdding(false)
      showToast('Player added successfully!', true)
    } catch (err: any) {
      showToast(err || 'Failed to add player', false)
    }
  }

  const handleUpdatePlayer = () => {
    if (!editingPlayer.firstName.trim() || !editingPlayer.lastName.trim()) {
      showToast('First name and last name are required', false)
      return
    }
    if (editingId === null) {
      return
    }
    const updated = [...players]
    updated[editingId] = editingPlayer
    setPlayers(updated)
    setEditingId(null)
    setEditingPlayer(null)
    showToast('Player updated successfully!', true)
  }

  const handleRemovePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index))
    showToast('Player removed', true)
  }

  const handleEditPlayer = (index: number) => {
    setEditingId(index)
    setEditingPlayer({ ...players[index] })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setEditingPlayer(null)
    setNewPlayer({ firstName: '', lastName: '' })
  }

  return (
    <PageWindow
      title={`Manage Players - ${competition.name}`}
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
              ➕ Add Player
            </button>
          )}
        </div>
      }
    >
      {/* Add Player Form */}
      {isAdding && (
        <div className="border border-green-300 bg-green-50 rounded-md p-4">
          <SectionHeader label="Add New Player" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="First Name">
              <input
                type="text"
                value={newPlayer.firstName}
                onChange={e => setNewPlayer({ ...newPlayer, firstName: e.target.value })}
                className={inputCls()}
                placeholder="Enter first name"
                autoFocus
              />
            </Field>
            <Field label="Last Name">
              <input
                type="text"
                value={newPlayer.lastName}
                onChange={e => setNewPlayer({ ...newPlayer, lastName: e.target.value })}
                className={inputCls()}
                placeholder="Enter last name"
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
              onClick={handleAddPlayer}
              className="bg-green-900 text-white font-bold py-1.5 
                         px-6 rounded-md text-sm hover:bg-green-800 
                         transition-colors"
            >
              ✓ Add Player
            </button>
          </div>
        </div>
      )}

      {/* Edit Player Form */}
      {editingId !== null && editingPlayer && (
        <div className="border border-blue-300 bg-blue-50 rounded-md p-4">
          <SectionHeader label={`Edit Player: ${editingPlayer.firstName} ${editingPlayer.lastName}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="First Name">
              <input
                type="text"
                value={editingPlayer.firstName}
                onChange={e => setEditingPlayer({ ...editingPlayer, firstName: e.target.value })}
                className={inputCls()}
                placeholder="Enter first name"
                autoFocus
              />
            </Field>
            <Field label="Last Name">
              <input
                type="text"
                value={editingPlayer.lastName || ''}
                onChange={e => setEditingPlayer({ ...editingPlayer, lastName: e.target.value })}
                className={inputCls()}
                placeholder="Enter last name"
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
              onClick={handleUpdatePlayer}
              className="bg-blue-900 text-white font-bold py-1.5 
                         px-6 rounded-md text-sm hover:bg-blue-800 
                         transition-colors"
            >
              ✓ Update Player
            </button>
          </div>
        </div>
      )}

      {/* Players List */}
      <div>
        <SectionHeader label={`Players (${players.length})`} />
        {players.length === 0 ? (
          <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
            <p className="text-sm text-gray-600">No players added yet</p>
            {!isAdding && editingId === null && (
              <button
                onClick={() => setIsAdding(true)}
                className="mt-3 text-blue-900 hover:text-blue-700 text-sm font-semibold
                           px-4 py-1.5 rounded-md bg-blue-50 border border-blue-200
                           hover:bg-blue-100 transition-colors"
              >
                ➕ Add First Player
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {players.map((player, index) => (
              <PlayerCard
                key={index}
                player={player}
                index={index}
                onRemove={() => handleRemovePlayer(index)}
                onEdit={() => handleEditPlayer(index)}
                editingId={editingId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {players.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
          <p className="text-sm font-semibold text-blue-900">
            📊 Summary: {players.length} player{players.length !== 1 ? 's' : ''} added
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
          disabled={players.length === 0}
          className="bg-green-900 text-white font-bold py-2 
                     px-7 rounded-md text-sm hover:bg-green-800 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💾 Save Players
        </button>
      </div>
    </PageWindow>
  )
}

export default CompetitionPlayers