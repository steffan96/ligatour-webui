import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition, updateCompetition } from 'api/competitions'
import { CompetitionInterface } from 'api/competitions'
import PageWindow from '../shared/PageWindow'
import { useToastStore } from '../../api/stores/useToastStore';

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
  `w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
    readOnly ? 'bg-gray-50' : ''
  }`

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
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? 'bg-green-700' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
)

const SingleCompetition = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore();
  const [competition, setCompetition] = useState<CompetitionInterface | null>(null)
  const [draft, setDraft] = useState<CompetitionInterface | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!id) return
    
    const fetchCompetition = async () => {
      try {
        const response = await getCompetition(Number(id))
        setCompetition(response?.data || null)
        setDraft(response?.data || null)
      } catch (err: any) {
        showToast(err || 'Failed to load competition.', false)
        navigate('/competitions') // Navigate back on error
      }
    }

    fetchCompetition()
  }, [id, navigate, showToast])

  if (!competition || !draft) {
    return null // Don't show anything while loading/redirecting
  }

  const set = (field: keyof CompetitionInterface, value: any) =>
    setDraft(prev => (prev ? { ...prev, [field]: value } : prev))

  const handleSave = async () => {
    if (!draft || !id) return
    setIsSaving(true)
    try {
      const response = await updateCompetition(Number(id), draft)
      setCompetition(response?.data)
      setDraft(response?.data)
      setIsEditing(false)
      showToast('Changes saved successfully!', true)
    } catch (err: any) {
      showToast(err || 'Failed to save changes. Please try again.', false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setDraft(competition)
    setIsEditing(false)
  }

  const ro = !isEditing

  return (
    <PageWindow
      headerActionButtons={
        <div className="flex items-center gap-3">
          <button
            className="bg-gray-100 text-gray-700 text-sm font-semibold 
            px-4 py-1.5 rounded-lg hover:bg-gray-200 flex items-start gap-2"
            onClick={() => navigate('/competitions')}
          >
            <span>←</span> Back
          </button>
          <button
            className="bg-white text-green-900 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-green-50"
            onClick={() => {
              setIsEditing(!isEditing)
              setDraft(competition)
            }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      }
    >
      {/* Name + Status - Always visible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Competition Name">
          <input
            type="text"
            value={draft.name}
            readOnly={ro}
            onChange={e => set('name', e.target.value)}
            className={inputCls(ro)}
            placeholder="Competition name"
          />
        </Field>
        <Field label="Status">
          <select
            value={draft.status}
            disabled={ro}
            onChange={e => set('status', e.target.value)}
            className={inputCls(ro)}
          >
            {statusOptions.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Points - Only for types that use points */}
      {(draft.points_for_win !== undefined || 
        draft.points_for_draw !== undefined || 
        draft.points_for_loss !== undefined) && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Points</p>
          <div className="grid grid-cols-3 gap-4">
            {draft.points_for_win !== undefined && (
              <Field label="Win">
                <input
                  type="number"
                  min="0"
                  value={draft.points_for_win}
                  readOnly={ro}
                  onChange={e => set('points_for_win', parseInt(e.target.value) || 0)}
                  className={`${inputCls(ro)} text-center font-semibold`}
                />
              </Field>
            )}
            {draft.points_for_draw !== undefined && (
              <Field label="Draw">
                <input
                  type="number"
                  min="0"
                  value={draft.points_for_draw}
                  readOnly={ro}
                  onChange={e => set('points_for_draw', parseInt(e.target.value) || 0)}
                  className={`${inputCls(ro)} text-center font-semibold`}
                />
              </Field>
            )}
            {draft.points_for_loss !== undefined && (
              <Field label="Loss">
                <input
                  type="number"
                  min="0"
                  value={draft.points_for_loss}
                  readOnly={ro}
                  onChange={e => set('points_for_loss', parseInt(e.target.value) || 0)}
                  className={`${inputCls(ro)} text-center font-semibold`}
                />
              </Field>
            )}
          </div>
        </div>
      )}

      {/* Tournament Details - Common fields + type-specific */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Tournament Details</p>
        <div className="grid grid-cols-2 gap-4">
          {/* Common fields */}
          <Field label="Current Round">
            <input
              type="number"
              min="0"
              value={draft.current_round}
              readOnly={ro}
              onChange={e => set('current_round', parseInt(e.target.value) || 0)}
              className={inputCls(ro)}
            />
          </Field>
          <Field label="Number of Teams">
            <input
              type="number"
              min="0"
              value={draft.number_of_teams}
              readOnly={ro}
              onChange={e => set('number_of_teams', parseInt(e.target.value) || 0)}
              className={inputCls(ro)}
            />
          </Field>

          {/* Group stage specific fields */}
          {draft.number_of_groups !== undefined && (
            <Field label="Number of Groups">
              <input
                type="number"
                min="0"
                value={draft.number_of_groups}
                readOnly={ro}
                onChange={e => set('number_of_groups', parseInt(e.target.value) || 0)}
                className={inputCls(ro)}
              />
            </Field>
          )}
          {draft.teams_per_group !== undefined && (
            <Field label="Teams per Group">
              <input
                type="number"
                min="0"
                value={draft.teams_per_group}
                readOnly={ro}
                onChange={e => set('teams_per_group', parseInt(e.target.value) || 0)}
                className={inputCls(ro)}
              />
            </Field>
          )}
        </div>
      </div>

      {/* Match Settings - Only for types that use these toggles */}
      {(draft.has_third_place !== undefined || draft.two_legged !== undefined) && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1 pb-1 border-b">Match Settings</p>
          {draft.has_third_place !== undefined && (
            <Toggle
              label="3rd Place Match"
              description="Enable third place playoff"
              checked={draft.has_third_place}
              disabled={ro}
              onChange={() => set('has_third_place', !draft.has_third_place)}
            />
          )}
          {draft.two_legged !== undefined && (
            <Toggle
              label="Two-Legged"
              description="Enable home and away matches"
              checked={draft.two_legged}
              disabled={ro}
              onChange={() => set('two_legged', !draft.two_legged)}
            />
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {isEditing && (
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="w-[15%] m-8 bg-gray-100 
            text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving || ro}
          className="w-[15%] m-8 bg-green-900 
          text-white font-medium py-2.5 rounded-lg disabled:opacity-50 hover:bg-green-900 transition-colors"
        >
          {isSaving ? 'Saving…' : '💾 Save Changes'}
        </button>
      </div>
    </PageWindow>
  )
}

export default SingleCompetition
