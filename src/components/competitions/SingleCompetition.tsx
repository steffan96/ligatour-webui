import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCompetition, updateCompetition } from 'api/competitions'
import { CompetitionInterface } from 'api/competitions'
import PageWindow from '../shared/PageWindow'

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'finished', label: 'Finished' },
]

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
)

const inputCls = (readOnly?: boolean) =>
  `w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${readOnly ? 'bg-gray-50' : ''}`

const Toggle = ({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${checked ? 'bg-green-700' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
)

const SingleCompetition = () => {
  const { id } = useParams<{ id: string }>()
  const [competition, setCompetition] = useState<CompetitionInterface | null>(null)
  const [draft, setDraft] = useState<CompetitionInterface | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!id) return
    getCompetition(Number(id))
      .then(data => { setCompetition(data || null); setDraft(data || null) })
      .catch(() => setError('Failed to load competition.'))
  }, [id])

  if (!competition || !draft)
    return <p className="text-gray-500 text-center py-8">Competition not found</p>

  const set = (field: keyof CompetitionInterface, value: any) =>
    setDraft(prev => prev ? { ...prev, [field]: value } : prev)

  const handleSave = async () => {
    if (!draft || !id) return
    setIsSaving(true)
    setError(null)
    try {
      const updated = await updateCompetition(Number(id), draft)
      setCompetition(updated)
      setDraft(updated)
      setIsEditing(false)
    } catch {
      setError('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const ro = !isEditing

  const editButton = (
    <button
      className="bg-white text-green-900 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-green-50"
      onClick={() => { setIsEditing(!isEditing); setDraft(competition) }}
    >
      {isEditing ? 'Cancel' : 'Edit'}
    </button>
  )

  return (
    <PageWindow
      title={competition.name || 'Competition Details'}
      subtitle="Update competition details"
      backPath="/competitions"
      headerAction={editButton}
    >
      {/* Name + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {draft.name !== undefined && (
          <Field label="Competition Name">
            <input type="text" value={draft.name} readOnly={ro}
              onChange={e => set('name', e.target.value)}
              className={inputCls(ro)} placeholder="Competition name" />
          </Field>
        )}
        {draft.status !== undefined && (
          <Field label="Status">
            <select value={draft.status} disabled={ro}
              onChange={e => set('status', e.target.value)}
              className={inputCls(ro)}>
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        )}
      </div>

      {/* Points */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Points</p>
        <div className="grid grid-cols-3 gap-4">
          {(['points_for_win', 'points_for_draw', 'points_for_loss'] as const).map((f, i) => (
            draft[f] !== undefined && (
              <Field key={f} label={['Win', 'Draw', 'Loss'][i]}>
                <input type="number" min="0" value={draft[f] as number} readOnly={ro}
                  onChange={e => set(f, parseInt(e.target.value) || 0)}
                  className={`${inputCls(ro)} text-center font-semibold`} />
              </Field>
            )
          ))}
        </div>
      </div>

      {/* Tournament Details */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Tournament Details</p>
        <div className="grid grid-cols-2 gap-4">
          {([
            ['current_round', 'Current Round'],
            ['number_of_teams', 'Teams'],
            ['number_of_groups', 'Groups'],
            ['teams_per_group', 'Teams per Group'],
          ] as const).map(([f, label]) => (
            draft[f] !== undefined && (
              <Field key={f} label={label}>
                <input type="number" min="0" value={draft[f] as number} readOnly={ro}
                  onChange={e => set(f, parseInt(e.target.value) || 0)}
                  className={inputCls(ro)} />
              </Field>
            )
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1 pb-1 border-b">Match Settings</p>
        {draft.has_third_place !== undefined && (
          <Toggle label="3rd Place Match" description="Enable third place playoff"
            checked={draft.has_third_place} disabled={ro}
            onChange={() => set('has_third_place', !draft.has_third_place)} />
        )}
        {draft.two_legged !== undefined && (
          <Toggle label="Two-Legged" description="Enable home and away matches"
            checked={draft.two_legged} disabled={ro}
            onChange={() => set('two_legged', !draft.two_legged)} />
        )}
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={isSaving || ro}
        className="w-full bg-green-900 text-white 
        font-medium py-2.5 rounded-lg disabled:opacity-50 hover:bg-green-900 transition-colors">
        {isSaving ? 'Saving…' : '💾 Save Changes'}
      </button>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
      )}
    </PageWindow>
  )
}

export default SingleCompetition