import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addTeamToCompetition } from 'api/competitions'
import { deleteTeam, updateTeam } from 'api/teams'
import { CompetitionInterface } from '../../api/competitions'
import { useCompetitionParticipants } from '../competitions/UseCompetitionParticipants'
import { useToastStore } from '../../api/stores/useToastStore'

// ─── Shared primitives ─────────────────────────────────────────────────────────

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

// ─── Team row ──────────────────────────────────────────────────────────────────

const TeamRow = ({
  participant,
  index,
  editingId,
  onEdit,
  onRemove,
  onManagePlayers,
}: {
  participant: any
  index: number
  editingId: number | null
  onEdit: () => void
  onRemove: () => void
  onManagePlayers: () => void
}) => (
  <div
    className={`flex items-center justify-between py-2.5 border-b last:border-0
                -mx-1 px-1 rounded transition-colors
                ${editingId === index ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
  >
    <span className="text-sm font-semibold text-gray-900">{participant.name}</span>
    <div className="flex gap-2">
      <button
        onClick={onManagePlayers}
        className="text-green-900 hover:text-green-700 text-xs font-semibold
                   px-2.5 py-1 rounded-md bg-green-50 border border-green-200
                   hover:bg-green-100 transition-colors"
      >
        Players
      </button>
      <button
        onClick={onEdit}
        className="text-blue-900 hover:text-blue-700 text-xs font-semibold
                   px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200
                   hover:bg-blue-100 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={onRemove}
        className="text-red-900 hover:text-red-700 text-xs font-semibold
                   px-2.5 py-1 rounded-md bg-red-50 border border-red-200
                   hover:bg-red-100 transition-colors"
      >
        Remove
      </button>
    </div>
  </div>
)

// ─── Inline form (shared by add + edit) ───────────────────────────────────────

const InlineForm = ({
  title,
  accent,
  fieldLabel,
  value,
  placeholder,
  confirmLabel,
  onChange,
  onConfirm,
  onCancel,
}: {
  title: string
  accent: 'green' | 'blue'
  fieldLabel: string
  value: string
  placeholder: string
  confirmLabel: string
  onChange: (v: string) => void
  onConfirm: () => void
  onCancel: () => void
}) => {
  const g = accent === 'green'
  return (
    <div className={`border rounded-md p-4 mb-1 ${g ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'}`}>
      <SectionHeader label={title} />
      <Field label={fieldLabel}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls()}
          placeholder={placeholder}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') onConfirm()
            if (e.key === 'Escape') onCancel()
          }}
        />
      </Field>
      <div className={`flex justify-end gap-3 pt-3 mt-3 border-t ${g ? 'border-green-200' : 'border-blue-200'}`}>
        <button
          onClick={onCancel}
          className="bg-gray-100 text-gray-900 font-bold py-1.5 px-6
                     rounded-md text-sm hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`font-bold py-1.5 px-6 rounded-md text-sm text-white transition-colors
                      ${g ? 'bg-green-900 hover:bg-green-800' : 'bg-blue-900 hover:bg-blue-800'}`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface TeamsProps {
  competition: CompetitionInterface
}

const emptyTeam = { name: '' }

const Teams = ({ competition }: TeamsProps) => {
  const navigate = useNavigate()
  const { showToast } = useToastStore()

  const {
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
  } = useCompetitionParticipants()

  const [newTeam, setNewTeam] = useState(emptyTeam)

  const label = competition.individual ? 'Player' : 'Team'
  const resetNew = () => setNewTeam(emptyTeam)
  const isIdle = !isAdding && editingId === null

  const handleAddTeam = async () => {
    if (!newTeam.name.trim()) {
      showToast(`${label} name is required`, false)
      return
    }
    try {
      const response = await addTeamToCompetition(String(competition.id), newTeam.name)
      setParticipants([...participants, response?.data])
      resetNew()
      setIsAdding(false)
      showToast(`${label} added successfully!`, true)
    } catch (err: any) {
      showToast(err || 'Failed to add participant', false)
    }
  }

  const handleUpdateTeam = async () => {
    if (!(editingParticipant?.name ?? '').trim()) {
      showToast(`${label} name is required`, false)
      return
    }
    if (editingId === null) return
    try {
      await updateTeam(String(editingParticipant.id), editingParticipant.name)
      const updated = [...participants]
      updated[editingId] = { ...participants[editingId], name: editingParticipant.name }
      setParticipants(updated)
      setEditingId(null)
      setEditingParticipant(null)
      showToast(`${label} updated successfully!`, true)
    } catch (err: any) {
      showToast(err || 'Failed to update participant', false)
    }
  }

  const handleRemoveTeam = async (index: number) => {
    try {
      await deleteTeam(String(participants[index].id))
      setParticipants(participants.filter((_, i) => i !== index))
      showToast(`${label} removed`, true)
    } catch (err: any) {
      showToast(err || 'Failed to remove participant', false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header row — mirrors CompetitionSettings edit-toggle row */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <p className="text-xs text-gray-500 font-medium">
          {participants.length === 0
            ? `No ${label.toLowerCase()}s added yet`
            : `${participants.length} ${label.toLowerCase()}${participants.length !== 1 ? 's' : ''}`}
        </p>
        {isIdle && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-white text-green-900 text-sm font-bold
                       px-3.5 py-1.5 rounded-md hover:bg-green-50
                       border border-green-200 transition-colors"
          >
            + Add {label}
          </button>
        )}
      </div>

      {/* Add form */}
      {isAdding && (
        <InlineForm
          title={`Add New ${label}`}
          accent="green"
          fieldLabel={`${label} Name`}
          value={newTeam.name}
          placeholder={`Enter ${label.toLowerCase()} name`}
          confirmLabel={`Add ${label}`}
          onChange={(v) => setNewTeam({ name: v })}
          onConfirm={handleAddTeam}
          onCancel={() => handleCancel(resetNew)}
        />
      )}

      {/* Edit form */}
      {editingId !== null && editingParticipant && (
        <InlineForm
          title={`Edit ${label}: ${editingParticipant.name}`}
          accent="blue"
          fieldLabel={`${label} Name`}
          value={editingParticipant.name ?? ''}
          placeholder={`Enter ${label.toLowerCase()} name`}
          confirmLabel={`Update ${label}`}
          onChange={(v) => setEditingParticipant({ ...editingParticipant, name: v })}
          onConfirm={handleUpdateTeam}
          onCancel={() => handleCancel(resetNew)}
        />
      )}

      {/* Participants list */}
      <div>
        <SectionHeader label={`${label}s (${participants.length})`} />
        {participants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <div className="text-3xl">👥</div>
            <p className="text-sm font-bold text-gray-700">No {label.toLowerCase()}s yet</p>
            <p className="text-xs font-medium text-gray-500">
              Add {label.toLowerCase()}s to get the competition going
            </p>
          </div>
        ) : (
          <div>
            {participants.map((team, index) => (
              <TeamRow
                key={team.id ?? index}
                participant={team}
                index={index}
                editingId={editingId}
                onEdit={() => handleEditParticipant(index)}
                onRemove={() => handleRemoveTeam(index)}
                onManagePlayers={() => navigate(`/team/${team.id}/players`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Teams