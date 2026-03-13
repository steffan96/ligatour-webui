import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition, addTeamToCompetition, addPlayerToCompetition } from 'api/competitions'
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
  <p className="text-sm font-bold text-gray-900 mb-2.5 pb-1.5 border-b border-gray-300">{label}</p>
)

const ParticipantCard = ({
  participant,
  index,
  isIndividual,
  onRemove,
  onEdit,
  editingId,
}: {
  participant: any
  index: number
  isIndividual: boolean
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
        {isIndividual ? (
          <>
            <p className="text-sm font-bold text-gray-900">
              {participant.first_name} {participant.last_name}
            </p>
            {participant.email && <p className="text-xs text-gray-600 mt-1">{participant.email}</p>}
          </>
        ) : (
          <p className="text-sm font-bold text-gray-900">{participant.name}</p>
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
  const [newParticipant, setNewParticipant] = useState({ first_name: '', last_name: '', email: '', name: '' })
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingParticipant, setEditingParticipant] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    const fetchCompetition = async () => {
      try {
        const response = await getCompetition(Number(id))
        const data = response?.data
        setCompetition(data || null)
        if (data?.individual) {
          setParticipants(data.players || [])
        } else {
          setParticipants(data.teams || [])
        }
      } catch (err: any) {
        showToast(err || 'Failed to load competition.', false)
        navigate('/competitions')
      }
    }
    fetchCompetition()
  }, [id, navigate, showToast])

  if (!competition) return null

  const isIndividual = competition.individual

  const handleAddParticipant = async () => {
    if (!id) {
      showToast('Competition ID is missing', false)
      return
    }

    if (isIndividual) {
      if (!newParticipant.first_name.trim() || !newParticipant.last_name.trim()) {
        showToast('First name and last name are required', false)
        return
      }
    } else {
      if (!newParticipant.name.trim()) {
        showToast('Team name is required', false)
        return
      }
    }

    try {
      let response

      if (isIndividual) {
        response = await addPlayerToCompetition(id, {
          first_name: newParticipant.first_name,
          last_name: newParticipant.last_name,
          email: newParticipant.email,
        })
      } else {
        response = await addTeamToCompetition(id, newParticipant.name)
      }

      setParticipants([...participants, response?.data])
      setNewParticipant({ first_name: '', last_name: '', email: '', name: '' })
      setIsAdding(false)
      showToast(isIndividual ? 'Player added successfully!' : 'Team added successfully!', true)
    } catch (err: any) {
      showToast(err || `Failed to add ${isIndividual ? 'player' : 'team'}`, false)
    }
  }

  const handleUpdateParticipant = () => {
    if (isIndividual) {
      if (
        !editingParticipant.first_name.trim() ||
        !editingParticipant.last_name.trim() ||
        !editingParticipant.email.trim()
      ) {
        showToast('First name, last name and email are required', false)
        return
      }
    } else {
      if (!editingParticipant.name.trim()) {
        showToast('Team name is required', false)
        return
      }
    }

    if (editingId === null) return

    const updated = [...participants]
    updated[editingId] = editingParticipant
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
    setNewParticipant({ first_name: '', last_name: '', email: '', name: '' })
  }

  const handleBackClick = () => {
    setIsAdding(false)
    setEditingId(null)
    setEditingParticipant(null)
    navigate(`/competition/${id}`)
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
            onClick={handleBackClick}
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
            {isIndividual ? (
              <>
                <Field label="First Name">
                  <input
                    type="text"
                    value={newParticipant.first_name}
                    onChange={e => setNewParticipant({ ...newParticipant, first_name: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter first name"
                    autoFocus
                  />
                </Field>
                <Field label="Last Name">
                  <input
                    type="text"
                    value={newParticipant.last_name}
                    onChange={e => setNewParticipant({ ...newParticipant, last_name: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter last name"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={newParticipant.email}
                    onChange={e => setNewParticipant({ ...newParticipant, email: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter email"
                  />
                </Field>
              </>
            ) : (
              <Field label="Team Name">
                <input
                  type="text"
                  value={newParticipant.name}
                  onChange={e => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  className={inputCls()}
                  placeholder="Enter team name"
                  autoFocus
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
          <SectionHeader
            label={`Edit ${isIndividual ? 'Player' : 'Team'}: ${
              isIndividual
                ? `${editingParticipant.first_name} ${editingParticipant.last_name}`
                : editingParticipant.name
            }`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {isIndividual ? (
              <>
                <Field label="First Name">
                  <input
                    type="text"
                    value={editingParticipant.first_name}
                    onChange={e => setEditingParticipant({ ...editingParticipant, first_name: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter first name"
                    autoFocus
                  />
                </Field>
                <Field label="Last Name">
                  <input
                    type="text"
                    value={editingParticipant.last_name || ''}
                    onChange={e => setEditingParticipant({ ...editingParticipant, last_name: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter last name"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={editingParticipant.email || ''}
                    onChange={e => setEditingParticipant({ ...editingParticipant, email: e.target.value })}
                    className={inputCls()}
                    placeholder="Enter email"
                  />
                </Field>
              </>
            ) : (
              <Field label="Team Name">
                <input
                  type="text"
                  value={editingParticipant.name}
                  onChange={e => setEditingParticipant({ ...editingParticipant, name: e.target.value })}
                  className={inputCls()}
                  placeholder="Enter team name"
                  autoFocus
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
            {participants.map((participant, index) => (
              <ParticipantCard
                key={participant.id ?? index}
                participant={participant}
                index={index}
                isIndividual={isIndividual}
                onRemove={() => handleRemoveParticipant(index)}
                onEdit={() => handleEditParticipant(index)}
                editingId={editingId}
              />
            ))}
          </div>
        )}
      </div>
    </PageWindow>
  )
}

export default CompetitionParticipants