import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addTeamToCompetition } from 'api/competitions'
import { deleteTeam, updateTeam } from 'api/teams'
import PageWindow from '../shared/PageWindow'
import { useCompetitionParticipants } from '../competitions/UseCompetitionParticipants'

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
  <p className="text-sm font-bold text-gray-900 mb-2.5 pb-1.5 border-b border-gray-300">{label}</p>
)

const TeamCard = ({
  participant,
  index,
  onRemove,
  onEdit,
  onManagePlayers,
  editingId,
}: {
  participant: any
  index: number
  onRemove: () => void
  onEdit: () => void
  onManagePlayers: () => void
  editingId: number | null
}) => (
  <div
    className={`border rounded-md p-4 ${
      editingId === index ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-100 hover:border-gray-400'
    } transition-all`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">{participant.name}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onManagePlayers}
          className="text-green-900 hover:text-green-700 text-xs font-semibold
                     px-2.5 py-1 rounded-md bg-green-50 border border-green-200
                     hover:bg-green-100 transition-colors"
        >
          👤 Players
        </button>
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

const emptyTeam = { name: '' }

const CompetitionTeams = () => {
  const navigate = useNavigate()
  const {
    id,
    competition,
    participants,
    setParticipants,
    isAdding,
    setIsAdding,
    editingId,
    setEditingId,
    editingParticipant,
    setEditingParticipant,
    handleEditParticipant,
    handleCancel,
    handleBackClick,
    showToast,
  } = useCompetitionParticipants()

  const [newTeam, setNewTeam] = useState(emptyTeam)

  if (!competition) return null

  const resetNew = () => setNewTeam(emptyTeam)

  const handleAddTeam = async () => {
    if (!id) {
      showToast('Competition ID is missing', false)
      return
    }

    if (!newTeam.name.trim()) {
      showToast(`${competition.individual ? 'Player' : 'Team'} name is required`, false)
      return
    }

    try {
      const response = await addTeamToCompetition(id, newTeam.name)
      setParticipants([...participants, response?.data])
      resetNew()
      setIsAdding(false)
      showToast(`${competition.individual ? 'Player' : 'Team'} added successfully!`, true)
    } catch (err: any) {
      showToast(err || 'Failed to add participant', false)
    }
  }

  const handleUpdateTeam = async () => {
    if (!(editingParticipant?.name ?? '').trim()) {
      showToast(`${competition.individual ? 'Player' : 'Team'} name is required`, false)
      return
    }

    if (editingId === null) return

    try {
      await updateTeam(String(editingParticipant.id), editingParticipant.name)
      const updatedList = [...participants]
      updatedList[editingId] = { ...participants[editingId], name: editingParticipant.name }
      setParticipants(updatedList)
      setEditingId(null)
      setEditingParticipant(null)
      showToast(`${competition.individual ? 'Player' : 'Team'} updated successfully!`, true)
    } catch (err: any) {
      showToast(err || 'Failed to update participant', false)
    }
  }

  const handleRemoveTeam = async (index: number) => {
    const team = participants[index]

    try {
      await deleteTeam(String(team.id))
      setParticipants(participants.filter((_, i) => i !== index))
      showToast(`${competition.individual ? 'Player' : 'Team'} removed`, true)
    } catch (err: any) {
      showToast(err || 'Failed to remove participant', false)
    }
  }

  return (
    <PageWindow
      title={`Manage ${competition.individual ? 'Players' : 'Teams'} - ${competition.name}`}
      headerActionButtons={
        <div className="flex items-center gap-3">
          <button
            className="bg-gray-100 text-gray-900 text-sm 
                       font-semibold px-3.5 py-1.5 rounded-md 
                       hover:bg-gray-200 flex items-start gap-2 
                       transition-colors"
            onClick={() => handleBackClick(resetNew)}
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
              ➕ Add {competition.individual ? 'Player' : 'Team'}
            </button>
          )}
        </div>
      }
    >
      {/* Add Team Form */}
      {isAdding && (
        <div className="border border-green-300 bg-green-50 rounded-md p-4">
          <SectionHeader label="Add New Team" />
          <div className="flex flex-col gap-3">
            <Field label={`${competition.individual ? 'Player' : 'Team'} Name`}>
              <input
                type="text"
                value={newTeam.name}
                onChange={e => setNewTeam({ name: e.target.value })}
                className={inputCls()}
                placeholder={`Enter ${competition.individual ? 'player' : 'team'} name`}
                autoFocus
                required
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-3 mt-3 border-t border-green-200">
            <button
              onClick={() => handleCancel(resetNew)}
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
              ✓ Add {competition.individual ? 'Player' : 'Team'}
            </button>
          </div>
        </div>
      )}

      {/* Edit Team Form */}
      {editingId !== null && editingParticipant && (
        <div className="border border-blue-300 bg-blue-50 rounded-md p-4">
          <SectionHeader label={`Edit ${competition.individual ? 'Player' : 'Team'}: ${editingParticipant.name}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label={`${competition.individual ? 'Player' : 'Team'} Name`}>
              <input
                type="text"
                value={editingParticipant.name ?? ''}
                onChange={e => setEditingParticipant({ ...editingParticipant, name: e.target.value })}
                className={inputCls()}
                placeholder="Enter participant name"
                autoFocus
                required
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-3 mt-3 border-t border-blue-200">
            <button
              onClick={() => handleCancel(resetNew)}
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
              ✓ Update {competition.individual ? 'Player' : 'Team'}
            </button>
          </div>
        </div>
      )}

      {/* Teams List */}
      <div>
        <SectionHeader label={`Participants (${participants.length})`} />
        {participants.length === 0 ? (
          <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
            <p className="text-sm text-gray-600">No participants added yet</p>
            {!isAdding && editingId === null && (
              <button
                onClick={() => setIsAdding(true)}
                className="mt-3 text-blue-900 hover:text-blue-700 text-sm font-semibold
                           px-4 py-1.5 rounded-md bg-blue-50 border border-blue-200
                           hover:bg-blue-100 transition-colors"
              >
                ➕ Add First {competition.individual ? 'Player' : 'Team'}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {participants.map((team, index) => (
              <TeamCard
                key={team.id ?? index}
                participant={team}
                index={index}
                onRemove={() => handleRemoveTeam(index)}
                onEdit={() => handleEditParticipant(index)}
                onManagePlayers={() => navigate(`/team/${team.id}/players`)}
                editingId={editingId}
              />
            ))}
          </div>
        )}
      </div>
    </PageWindow>
  )
}

export default CompetitionTeams