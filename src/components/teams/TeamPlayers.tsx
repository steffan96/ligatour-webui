import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { addPlayerToTeam, getTeam } from 'api/teams'
import PageWindow from '../shared/PageWindow'
import { useToastStore } from '../../api/stores/useToastStore'
import {
  AddPlayerForm,
  EditPlayerForm,
  PlayerCard,
  PlayerFields,
  SectionHeader,
  usePlayerList,
} from '../../components/players/PlayerFormShared'

const TeamPlayers = () => {
  const { teamId } = useParams<{ teamId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()

  const [team, setTeam] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const { editingId, editingPlayer, handleEditPlayer, handleUpdatePlayer, handleRemovePlayer, handleCancel } =
    usePlayerList(players, setPlayers)

  useEffect(() => {
    if (!teamId) return
    const fetchTeam = async () => {
      try {
        const response = await getTeam(teamId)
        setTeam(response || null)
        setPlayers(response?.players || [])
      } catch (err: any) {
        showToast(err?.response?.data?.message || 'Failed to load team.', false)
        navigate(-1)
      }
    }
    fetchTeam()
  }, [teamId, navigate, showToast])

  if (!team) return null

  const handleAddPlayer = async (player: PlayerFields) => {
    if (!teamId) return
    const response = await addPlayerToTeam(teamId, player)
    setPlayers([...players, response])
    setIsAdding(false)
  }

  return (
    <PageWindow
      title={`Manage Players - ${team.name}`}
      headerActionButtons={
        <div className="flex items-center gap-3">
          <button
            className="bg-gray-100 text-gray-900 text-sm 
                       font-semibold px-3.5 py-1.5 rounded-md 
                       hover:bg-gray-200 flex items-start gap-2 
                       transition-colors"
            onClick={() => navigate(-1)}
          >
            <span>←</span> Back to Teams
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
      {isAdding && (
        <AddPlayerForm
          onAdd={handleAddPlayer}
          onCancel={() => { setIsAdding(false); handleCancel() }}
        />
      )}

      {editingId !== null && editingPlayer && (
        <EditPlayerForm
          player={editingPlayer}
          onUpdate={handleUpdatePlayer}
          onCancel={handleCancel}
        />
      )}

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
                key={player.id ?? index}
                participant={player}
                index={index}
                onRemove={() => handleRemovePlayer(index)}
                onEdit={() => handleEditPlayer(index)}
                editingId={editingId}
              />
            ))}
          </div>
        )}
      </div>
    </PageWindow>
  )
}

export default TeamPlayers
