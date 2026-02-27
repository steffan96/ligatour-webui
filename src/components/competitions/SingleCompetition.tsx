import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CompetitionType, CompetitionTypeDisplay } from './constants'
import { getCompetition, updateCompetition, deleteCompetition } from 'api/competitions'
import { CompetitionInterface } from 'api/interfaces/competitions'

const statusStyles: Record<string, { badge: string; dot: string }> = {
  pending: { badge: 'bg-amber-100 text-amber-700 border border-amber-200', dot: 'bg-amber-400' },
  active: { badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-400 animate-pulse' },
  finished: { badge: 'bg-gray-100 text-gray-500 border border-gray-200', dot: 'bg-gray-400' },
}

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  type?: string
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="font-medium text-gray-800 border border-gray-300 
      rounded px-2 py-0.5 w-32 text-right focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
    />
  </div>
)

const ToggleField = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
        value ? 'bg-emerald-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          value ? 'translate-x-4.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  </div>
)

const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-500">{label}</span>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="font-medium text-gray-800 border border-gray-300
      rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
)

const SingleCompetition = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [competition, setCompetition] = useState<CompetitionInterface | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<CompetitionInterface | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getCompetition(Number(id))
      .then(data => {
        setCompetition(data || null)
        setDraft(data || null)
      })
      .catch(err => {
        console.error('Failed to load competition:', err)
      })
  }, [id])

  if (!competition || !draft)
    return (
      <div className="flex flex-col w-full p-2">
        <p className="text-gray-500 text-center py-4">Competition not found</p>
      </div>
    )

  const status = statusStyles[competition.status] ?? {
    badge: 'bg-gray-300 text-gray-500 border border-gray-200',
    dot: 'bg-gray-400',
  }

  const handleEdit = () => {
    setDraft({ ...competition })
    setIsEditing(true)
    setError(null)
  }

  const handleCancel = () => {
    setDraft({ ...competition })
    setIsEditing(false)
    setError(null)
  }

  const handleSave = async () => {
    if (!draft || !id) return
    setIsSaving(true)
    setError(null)
    try {
      const updated = await updateCompetition(Number(id), draft)
      setCompetition(updated)
      setDraft(updated)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update competition:', err)
      setError('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    setError(null)
    try {
      await deleteCompetition(Number(id))
      navigate(-1)
    } catch (err) {
      console.error('Failed to delete competition:', err)
      setError('Failed to delete competition. Please try again.')
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const set = (key: keyof CompetitionInterface) => (value: string | number | boolean) => {
    setDraft(prev => (prev ? { ...prev, [key]: value } : prev))
  }

  const current = isEditing ? draft : competition

  return (
    <div className="flex flex-col w-full p-2">
      <div className="w-[98%] ml-auto">
        <div className="m-4 flex items-start justify-between">
          <div>
            {isEditing ? (
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={draft.name}
                  onChange={e => set('name')(e.target.value)}
                  className="text-xl font-bold border-b-2 border-blue-400
                  bg-transparent focus:outline-none w-64 px-0.5 py-1 rounded"
                  style={{ fontSize: '1.25rem', lineHeight: '1.75rem' }}
                />
                <span className="text-xs text-gray-400">Competition Name</span>
              </div>
            ) : (
              <h3 className="text-xl font-bold">{competition.name}</h3>
            )}
            <p className="text-sm text-gray-500 mt-0.5">
              {CompetitionTypeDisplay[competition.type as CompetitionType] || competition.type}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="text-sm px-3 py-1.5 rounded-lg border 
                  border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 
                  text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving && (
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  )}
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="text-sm px-3 py-1.5 rounded-lg border 
                  border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 
                      2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm px-3 py-1.5 rounded-lg border
                   border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2
                       2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mx-4 mb-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="border border-gray-200 rounded-lg p-4 mr-8 bg-gray-200">
          {/* Header row */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
            <div
              className="w-14 h-14 rounded-xl bg-gray-100 flex 
            items-center justify-center flex-shrink-0 overflow-hidden"
            >
              {current.logo ? (
                <img src={current.logo} alt={current.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-base font-bold text-gray-500">{current.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    placeholder="Logo URL"
                    value={draft.logo || ''}
                    onChange={e => set('logo')(e.target.value)}
                    className="text-xs text-gray-500 border 
                    border-gray-300 rounded px-2 py-0.5 w-48 
                    focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                  />
                  <span className="text-xs text-gray-400">Logo URL</span>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Created {new Date(competition.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              )}
            </div>
            {isEditing ? (
              <SelectField
                label=""
                value={draft.status}
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'active', label: 'Active' },
                  { value: 'finished', label: 'Finished' },
                ]}
                onChange={v => set('status')(v)}
              />
            ) : (
              <span
                className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full capitalize ${status.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {competition.status}
              </span>
            )}
          </div>

          {/* Points row */}
          <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-200 my-2">
            {[
              { label: 'Win', key: 'points_for_win' as const, color: 'text-emerald-600' },
              { label: 'Draw', key: 'points_for_draw' as const, color: 'text-gray-700' },
              { label: 'Loss', key: 'points_for_loss' as const, color: 'text-red-500' },
            ].map(({ label, key, color }) => (
              <div key={label} className="flex flex-col items-center py-4 gap-1">
                {isEditing ? (
                  <input
                    type="number"
                    value={draft[key] as number}
                    onChange={e => set(key)(Number(e.target.value))}
                    className={`text-2xl font-bold ${color} w-16 text-center border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-300`}
                  />
                ) : (
                  <span className={`text-2xl font-bold ${color}`}>{competition[key] as number}</span>
                )}
                <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="pt-2 space-y-3">
            {isEditing ? (
              <>
                <InputField
                  label="Current Round"
                  value={draft.current_round}
                  onChange={v => set('current_round')(Number(v))}
                  type="number"
                />
                <InputField
                  label="Teams"
                  value={draft.number_of_teams}
                  onChange={v => set('number_of_teams')(Number(v))}
                  type="number"
                />
                <InputField
                  label="Groups"
                  value={draft.number_of_groups}
                  onChange={v => set('number_of_groups')(Number(v))}
                  type="number"
                />
                <InputField
                  label="Teams per Group"
                  value={draft.teams_per_group}
                  onChange={v => set('teams_per_group')(Number(v))}
                  type="number"
                />
                <ToggleField
                  label="3rd Place Match"
                  value={draft.has_third_place}
                  onChange={v => set('has_third_place')(v)}
                />
                <ToggleField label="Two-Legged" value={draft.two_legged} onChange={v => set('two_legged')(v)} />
              </>
            ) : (
              [
                { label: 'Current Round', value: competition.current_round },
                { label: 'Teams', value: competition.number_of_teams },
                ...(competition.number_of_groups > 0
                  ? [
                      {
                        label: 'Groups',
                        value: `${competition.number_of_groups} × ${competition.teams_per_group} teams`,
                      },
                    ]
                  : []),
                { label: '3rd Place Match', value: competition.has_third_place ? 'Yes' : 'No' },
                { label: 'Two-Legged', value: competition.two_legged ? 'Yes' : 'No' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">Delete Competition</h4>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete <span className="font-medium text-gray-700">`{competition.name}`</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-lg border 
                border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 
                text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex 
                items-center gap-1.5"
              >
                {isDeleting && (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SingleCompetition
