import React from 'react'
import { addPlayerToCompetition } from 'api/competitions'
import PageWindow from '../shared/PageWindow'
import { useCompetitionParticipants } from '../competitions/UseCompetitionParticipants'
import {
  AddPlayerForm,
  EditPlayerForm,
  PlayerCard,
  PlayerFields,
  SectionHeader,
  usePlayerList,
} from './PlayerFormShared'

const CompetitionPlayers = () => {
  const {
    id,
    competition,
    participants,
    setParticipants,
    isAdding,
    setIsAdding,
    handleBackClick,
  } = useCompetitionParticipants()

  const { editingId, editingPlayer, handleEditPlayer, handleUpdatePlayer, handleRemovePlayer, handleCancel } =
    usePlayerList(participants, setParticipants)

  if (!competition) return null

  const handleAddPlayer = async (player: PlayerFields) => {
    if (!id) return false
    const response = await addPlayerToCompetition(id, player)
    setParticipants([...participants, response?.data])
    setIsAdding(false)
    return true
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
            onClick={() => handleBackClick()}
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
        <SectionHeader label={`Players (${participants.length})`} />
        {participants.length === 0 ? (
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
          <div className="flex flex-col gap-3">
            {participants.map((player, index) => (
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

export default CompetitionPlayers
