import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition, updateCompetition, startCompetition } from 'api/competitions'
import { CompetitionInterface } from 'api/competitions'
import { CompetitionTypeDisplay } from '../../api/interfaces/competitions'
import PageWindow from '../shared/PageWindow'
import { useToastStore } from '../../api/stores/useToastStore'
import CustomSelect from '../shared/CustomSelect'

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
  <div className="flex items-center justify-between py-2.5 border-b last:border-0">
    <div>
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      {description && <p className="text-xs font-medium text-gray-600">{description}</p>}
    </div>
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-10 items-center 
                   rounded-full transition-colors disabled:opacity-50 ${checked ? 'bg-green-900' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white 
                     transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  </div>
)

const SectionHeader = ({ label }: { label: string }) => (
  <p className="text-sm font-bold text-gray-900 mb-2.5 pb-1.5 border-b border-gray-300">{label}</p>
)

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    inactive: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    active: 'bg-green-50 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-700 border-gray-300',
  }
  const labels: Record<string, string> = {
    inactive: '⏳ Inactive',
    active: '🟢 Active',
    completed: '✅ Completed',
  }
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${styles[status] ?? styles.inactive}`}>
      {labels[status] ?? status}
    </span>
  )
}

const SingleCompetition = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()
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
        navigate('/competitions')
      }
    }
    fetchCompetition()
  }, [id, navigate, showToast])

  if (!competition || !draft) return null

  const set = (field: keyof CompetitionInterface, value: any) =>
    setDraft(prev => (prev ? { ...prev, [field]: value } : prev))

  const handleSave = async (overrides?: Partial<CompetitionInterface>) => {
    if (!draft || !id) return
    setIsSaving(true)
    try {
      const response = await updateCompetition(Number(id), { ...draft, ...overrides })
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

  const handleStartCompetition = async () => {
    try {
      const response = await startCompetition(competition.id)
      showToast('Competition started!', true)
      setCompetition(response?.data)
    } catch (err: any) {
      showToast(err || 'Failed to activate competition. Please try again or contact support.', false)
  }}

  const ro = !isEditing
  const isActive = competition.status === 'active'
  const isCompleted = competition.status === 'completed'

  return (
    <PageWindow
      title={`Manage competition - ${draft.name || ''}`}
      headerActionButtons={
        <div className="flex items-center gap-3">
          <button
            className="bg-gray-100 text-gray-900 text-sm 
                       font-semibold px-3.5 py-1.5 rounded-md 
                       hover:bg-gray-200 flex items-start gap-2 
                       transition-colors"
            onClick={() => navigate('/competitions')}
          >
            <span>←</span> Back to dashboard
          </button>
          <button
            className="bg-blue-50 text-blue-900 text-sm font-bold 
             px-3.5 py-1.5 rounded-md hover:bg-blue-100 
             border border-blue-200 transition-colors"
            onClick={() => navigate(`/competition/${id}/${draft.individual ? 'players' : 'teams'}`)}
          >
            {draft.individual ? '👤 Manage Players' : '👥 Manage Teams'}
          </button>
          <button
            className="bg-white text-green-900 text-sm font-bold 
                       px-3.5 py-1.5 rounded-md hover:bg-green-50 
                       border border-green-200 transition-colors"
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
      {/* Name + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
          <div className="flex items-center h-[34px]">
            <StatusBadge status={competition.status} />
          </div>
        </Field>
      </div>

      {/* Competition Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Field label="Competition Type">
          <CustomSelect
            value={draft.type}
            options={Object.entries(CompetitionTypeDisplay).map(([key, value]) => ({
              value: key,
              label: value,
            }))}
            onChange={value => set('type', value)}
            disabled={ro}
            className={inputCls(ro)}
          />
        </Field>
        <Field label="Individual">
          <CustomSelect
            value={draft.individual ? 'true' : 'false'}
            options={[
              { value: 'false', label: 'Team Based' },
              { value: 'true', label: 'Individual' },
            ]}
            onChange={value => set('individual', value === 'true')}
            disabled={ro}
            className={inputCls(ro)}
          />
        </Field>
      </div>

      {/* Points */}
      {(draft.points_for_win !== undefined ||
        draft.points_for_draw !== undefined ||
        draft.points_for_loss !== undefined) && (
        <div>
          <SectionHeader label="Points" />
          <div className="grid grid-cols-3 gap-3">
            {draft.points_for_win !== undefined && (
              <Field label="Win">
                <input
                  type="number"
                  min="0"
                  value={draft.points_for_win}
                  readOnly={ro}
                  onChange={e => set('points_for_win', parseInt(e.target.value) || 0)}
                  className={`${inputCls(ro)} text-center font-bold`}
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
                  className={`${inputCls(ro)} text-center font-bold`}
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
                  className={`${inputCls(ro)} text-center font-bold`}
                />
              </Field>
            )}
          </div>
        </div>
      )}

      {/* Tournament Details */}
      <div>
        <SectionHeader label="Tournament Details" />
        <div className="grid grid-cols-2 gap-3.5">
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
              onChange={e => set('number_of_teams', e.target.value === '' ? null : parseInt(e.target.value))}
              className={inputCls(ro)}
            />
          </Field>
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

      {/* Match Settings */}
      {(draft.has_third_place !== undefined || draft.two_legged !== undefined) && (
        <div>
          <SectionHeader label="Match Settings" />
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
      <div className="flex justify-between gap-3 pt-5">
        {!isCompleted && !isActive && (
          <button
            onClick={() => handleStartCompetition()}
            disabled={isSaving}
            className='text-sm font-medium transition-colors disabled:opacity-50 text-green-700 hover:text-green-900'
          >
            {'🚀 Start Competition'}
          </button>
        )}
        <div className="flex gap-3 ml-auto">
          {isEditing && (
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="bg-gray-100 text-gray-900 font-bold py-2 
                         px-7 rounded-md text-sm hover:bg-gray-200 
                         transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => handleSave()}
            disabled={isSaving || ro}
            className="bg-green-900 text-white font-bold py-2 
                       px-7 rounded-md text-sm disabled:opacity-50 
                       hover:bg-green-800 transition-colors"
          >
            {isSaving ? 'Saving…' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </PageWindow>
  )
}

export default SingleCompetition
