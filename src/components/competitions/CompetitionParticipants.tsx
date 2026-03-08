import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition } from 'api/competitions'
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
  <p
    className="text-sm font-bold text-gray-900 mb-2.5 pb-1.5 
               border-b border-gray-300"
  >
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
        <p className="text-sm font-bold text-gray-900">{player.name}</p>
        {player.number && <p className="text-xs text-gray-600 mt-1">#{player.number}</p>}
        {player.position && <p className="text-xs font-medium text-gray-700 mt-2">{player.position}</p>}
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

const CompetitionParticipants = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()

  const [competition, setCompetition] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [newParticipant, setNewParticipant] = useState({ name: '', number: '', position: '', city: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingParticipant, setEditingParticipant] = useState<any>(null)

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

  const isIndividual = competition.individual

  const handleAddParticipant = () => {
    if (!newParticipant.name.trim()) {
      showToast(isIndividual ? 'Player name is required' : 'Team name is required', false)
      return
    }
    setParticipants([...participants, newParticipant])
    setNewParticipant({ name: '', number: '', position: '', city: '' })
    setIsAdding(false)
    showToast(isIndividual ? 'Player added successfully!' : 'Team added successfully!', true)
  }

  const handleUpdateParticipant = () => {
    if (!editingParticipant.name.trim()) {
      showToast(isIndividual ? 'Player name is required' : 'Team name is required', false)
      return
    }
    const updated = [...participants]
    updated[editingId!] = editingParticipant
    setParticipants(updated)
    setEditingId(null)
    setEditingParticipant(null)
    showToast(isIndividual ? 'Player updated successfully!' : 'Team updated successfully!', true)
  }

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index))
    showToast(isIndividual ? 'Player removed' : 'Team removed', true)
  }

  const handleEditParticipant = (index: number) => {
    setEditingId(index)
    setEditingParticipant({ ...participants[index] })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setEditingParticipant(null)
    setNewParticipant({ name: '', number: '', position: '', city: '' })
  }

  return (
    <PageWindow
      title={`Manage ${isIndividual ? 'Players' : 'Teams'} - ${competition.name}`}
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
              ➕ Add {isIndividual ? 'Player' : 'Team'}
            </button>
          )}
        </div>
      }
    >
      {/* Add Participant Form */}
      {isAdding && (
        <div className="border border-green-300 bg-green-50 rounded-md p-4">
          <SectionHeader label={`Add New ${isIndividual ? 'Player' : 'Team'}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label={isIndividual ? 'Player Name' : 'Team Name'}>
              <input
                type="text"
                value={newParticipant.name}
                onChange={e => setNewParticipant({ ...newParticipant, name: e.target.value })}
                className={inputCls()}
                placeholder={`Enter ${isIndividual ? 'player' : 'team'} name`}
                autoFocus
              />
            </Field>
            {isIndividual ? (
              <>
                <Field label="Jersey Number">
                  <input
                    type="text"
                    value={newParticipant.number}
                    onChange={e => setNewParticipant({ ...newParticipant, number: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter jersey number (optional)"
                  />
                </Field>
                <Field label="Position">
                  <input
                    type="text"
                    value={newParticipant.position}
                    onChange={e => setNewParticipant({ ...newParticipant, position: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter position (optional)"
                  />
                </Field>
              </>
            ) : (
              <Field label="City">
                <input
                  type="text"
                  value={newParticipant.city}
                  onChange={e => setNewParticipant({ ...newParticipant, city: e.target.value })}
                  className={inputCls()}
                  placeholder="Enter city (optional)"
                />
              </Field>
            )}
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
              onClick={handleAddParticipant}
              className="bg-green-900 text-white font-bold py-1.5 
                         px-6 rounded-md text-sm hover:bg-green-800 
                         transition-colors"
            >
              ✓ Add {isIndividual ? 'Player' : 'Team'}
            </button>
          </div>
        </div>
      )}

      {/* Edit Participant Form */}
      {editingId !== null && editingParticipant && (
        <div className="border border-blue-300 bg-blue-50 rounded-md p-4">
          <SectionHeader label={`Edit ${isIndividual ? 'Player' : 'Team'}: ${editingParticipant.name}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label={isIndividual ? 'Player Name' : 'Team Name'}>
              <input
                type="text"
                value={editingParticipant.name}
                onChange={e => setEditingParticipant({ ...editingParticipant, name: e.target.value })}
                className={inputCls()}
                placeholder={`Enter ${isIndividual ? 'player' : 'team'} name`}
                autoFocus
              />
            </Field>
            {isIndividual ? (
              <>
                <Field label="Jersey Number">
                  <input
                    type="text"
                    value={editingParticipant.number || ''}
                    onChange={e => setEditingParticipant({ ...editingParticipant, number: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter jersey number (optional)"
                  />
                </Field>
                <Field label="Position">
                  <input
                    type="text"
                    value={editingParticipant.position || ''}
                    onChange={e => setEditingParticipant({ ...editingParticipant, position: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter position (optional)"
                  />
                </Field>
              </>
            ) : (
              <Field label="City">
                <input
                  type="text"
                  value={editingParticipant.city || ''}
                  onChange={e => setEditingParticipant({ ...editingParticipant, city: e.target.value })}
                  className={inputCls()}
                  placeholder="Enter city (optional)"
                />
              </Field>
            )}
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
              onClick={handleUpdateParticipant}
              className="bg-blue-900 text-white font-bold py-1.5 
                         px-6 rounded-md text-sm hover:bg-blue-800 
                         transition-colors"
            >
              ✓ Update {isIndividual ? 'Player' : 'Team'}
            </button>
          </div>
        </div>
      )}

      {/* Participants List */}
      <div>
        <SectionHeader label={`${isIndividual ? 'Players' : 'Teams'} (${participants.length})`} />
        {participants.length === 0 ? (
          <div className="text-center py-8 border border-gray-200 rounded-md bg-gray-50">
            <p className="text-sm text-gray-600">No {isIndividual ? 'players' : 'teams'} added yet</p>
            {!isAdding && editingId === null && (
              <button
                onClick={() => setIsAdding(true)}
                className="mt-3 text-blue-900 hover:text-blue-700 text-sm font-semibold
                           px-4 py-1.5 rounded-md bg-blue-50 border border-blue-200
                           hover:bg-blue-100 transition-colors"
              >
                ➕ Add First {isIndividual ? 'Player' : 'Team'}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {participants.map((participant, index) =>
              isIndividual ? (
                <PlayerCard
                  key={index}
                  player={participant}
                  index={index}
                  onRemove={() => handleRemoveParticipant(index)}
                  onEdit={() => handleEditParticipant(index)}
                  editingId={editingId}
                />
              ) : (
                <TeamCard
                  key={index}
                  team={participant}
                  index={index}
                  onRemove={() => handleRemoveParticipant(index)}
                  onEdit={() => handleEditParticipant(index)}
                  editingId={editingId}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {participants.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
          <p className="text-sm font-semibold text-blue-900">
            📊 Summary: {participants.length} {isIndividual ? 'player' : 'team'}
            {participants.length !== 1 ? 's' : ''} added
          </p>
        </div>
      )}

      {/* Save Changes */}
      <div className="flex justify-end gap-3 pt-5 mt-6 border-t border-gray-300">
        <button
          onClick={() => navigate(`/competitions/${id}`)}
          className="bg-gray-100 text-gray-900 font-bold py-2 
                     px-7 rounded-md text-sm hover:bg-gray-200 
                     transition-colors"
        >
          ← Back
        </button>
        <button
          disabled={participants.length === 0}
          className="bg-green-900 text-white font-bold py-2 
                     px-7 rounded-md text-sm hover:bg-green-800 
                     transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          💾 Save {isIndividual ? 'Players' : 'Teams'}
        </button>
      </div>
    </PageWindow>
  )
}

export default CompetitionParticipants
