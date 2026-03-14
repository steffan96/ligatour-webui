import React, { useState } from 'react'
import { deletePlayer, updatePlayer } from 'api/players'
import { useToastStore } from '../../api/stores/useToastStore'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-bold text-gray-900">{label}</label>
    {children}
  </div>
)

export const inputCls = (readOnly?: boolean) =>
  `w-full px-2.5 py-1.5 border border-gray-300 rounded-md 
   text-sm font-medium focus:ring-2 
   focus:ring-green-900 focus:border-green-900 ${readOnly ? 'bg-gray-50 text-gray-700' : 'text-gray-900'}`

export const SectionHeader = ({ label }: { label: string }) => (
  <p className="text-sm font-bold text-gray-900 mb-2.5 pb-1.5 border-b border-gray-300">{label}</p>
)

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

export const emptyPlayer = { first_name: '', last_name: '', email: '' }
export type PlayerFields = typeof emptyPlayer

export const PlayerCard = ({
  participant,
  index,
  onRemove,
  onEdit,
  editingId,
}: {
  participant: any
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
          {participant.first_name} {participant.last_name}
        </p>
        {participant.email && <p className="text-xs text-gray-600 mt-1">{participant.email}</p>}
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

export const AddPlayerForm = ({
  onAdd,
  onCancel,
}: {
  onAdd: (player: PlayerFields) => Promise<void>
  onCancel: () => void
}) => {
  const [newPlayer, setNewPlayer] = useState(emptyPlayer)
  const { showToast } = useToastStore()

  const handleSubmit = async () => {
    if (!newPlayer.first_name.trim() || !newPlayer.last_name.trim()) {
      showToast('First name and last name are required', false)
      return
    }
    if (newPlayer.email && !isValidEmail(newPlayer.email)) {
      showToast('Please enter a valid email address', false)
      return
    }
    await onAdd(newPlayer)
    setNewPlayer(emptyPlayer)
  }

  return (
    <div className="border border-green-300 bg-green-50 rounded-md p-4">
      <SectionHeader label="Add New Player" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Field label="First Name">
          <input
            type="text"
            value={newPlayer.first_name}
            onChange={e => setNewPlayer({ ...newPlayer, first_name: e.target.value })}
            className={inputCls()}
            placeholder="Enter first name"
            autoFocus
          />
        </Field>
        <Field label="Last Name">
          <input
            type="text"
            value={newPlayer.last_name}
            onChange={e => setNewPlayer({ ...newPlayer, last_name: e.target.value })}
            className={inputCls()}
            placeholder="Enter last name"
          />
        </Field>
        <Field label="Email (optional)">
          <input
            type="email"
            value={newPlayer.email}
            onChange={e => setNewPlayer({ ...newPlayer, email: e.target.value })}
            className={inputCls()}
            placeholder="Enter email"
          />
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-3 mt-3 border-t border-green-200">
        <button
          onClick={onCancel}
          className="bg-gray-100 text-gray-900 font-bold py-1.5 
                     px-6 rounded-md text-sm hover:bg-gray-200 
                     transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-900 text-white font-bold py-1.5 
                     px-6 rounded-md text-sm hover:bg-green-800 
                     transition-colors"
        >
          ✓ Add Player
        </button>
      </div>
    </div>
  )
}

export const EditPlayerForm = ({
  player,
  onUpdate,
  onCancel,
}: {
  player: any
  onUpdate: (player: any) => Promise<void>
  onCancel: () => void
}) => {
  const [editingPlayer, setEditingPlayer] = useState(player)
  const { showToast } = useToastStore()

  const handleSubmit = async () => {
    if (!editingPlayer.first_name.trim() || !editingPlayer.last_name.trim() || !editingPlayer.email.trim()) {
      showToast('First name, last name and email are required', false)
      return
    }
    if (!isValidEmail(editingPlayer.email)) {
      showToast('Please enter a valid email address', false)
      return
    }
    await onUpdate(editingPlayer)
  }

  return (
    <div className="border border-blue-300 bg-blue-50 rounded-md p-4">
      <SectionHeader label={`Edit Player: ${editingPlayer.first_name} ${editingPlayer.last_name}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Field label="First Name">
          <input
            type="text"
            value={editingPlayer.first_name}
            onChange={e => setEditingPlayer({ ...editingPlayer, first_name: e.target.value })}
            className={inputCls()}
            placeholder="Enter first name"
            autoFocus
          />
        </Field>
        <Field label="Last Name">
          <input
            type="text"
            value={editingPlayer.last_name || ''}
            onChange={e => setEditingPlayer({ ...editingPlayer, last_name: e.target.value })}
            className={inputCls()}
            placeholder="Enter last name"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={editingPlayer.email || ''}
            onChange={e => setEditingPlayer({ ...editingPlayer, email: e.target.value })}
            className={inputCls()}
            placeholder="Enter email"
          />
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-3 mt-3 border-t border-blue-200">
        <button
          onClick={onCancel}
          className="bg-gray-100 text-gray-900 font-bold py-1.5 
                     px-6 rounded-md text-sm hover:bg-gray-200 
                     transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-900 text-white font-bold py-1.5 
                     px-6 rounded-md text-sm hover:bg-blue-800 
                     transition-colors"
        >
          ✓ Update Player
        </button>
      </div>
    </div>
  )
}

// Shared hook for player list management (edit/remove)
export const usePlayerList = (
  players: any[],
  setPlayers: (p: any[]) => void,
) => {
  const { showToast } = useToastStore()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<any>(null)

  const handleEditPlayer = (index: number) => {
    setEditingId(index)
    setEditingPlayer({ ...players[index] })
  }

  const handleUpdatePlayer = async (updated: any) => {
    if (editingId === null) return
    try {
      const result = await updatePlayer(String(updated.id), {
        first_name: updated.first_name,
        last_name: updated.last_name,
        email: updated.email,
      })
      const updatedList = [...players]
      updatedList[editingId] = result
      setPlayers(updatedList)
      setEditingId(null)
      setEditingPlayer(null)
      showToast('Player updated successfully!', true)
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to update player', false)
    }
  }

  const handleRemovePlayer = async (index: number) => {
    const player = players[index]
    try {
      await deletePlayer(String(player.id))
      setPlayers(players.filter((_, i) => i !== index))
      showToast('Player removed', true)
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to remove player', false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingPlayer(null)
  }

  return { editingId, editingPlayer, handleEditPlayer, handleUpdatePlayer, handleRemovePlayer, handleCancel }
}
