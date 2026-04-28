import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition, startCompetition } from 'api/competitions'
import { CompetitionInterface } from 'api/competitions'
import PageWindow from '../shared/PageWindow'
import { useToastStore } from '../../api/stores/useToastStore'
import CompetitionSettings from './CompetitionSettings'
import Teams from '../teams/Teams'
import Rounds from '../rounds/Rounds'
import ConfirmModal from '../common/ConfirmModal'

type Tab = {
  id: string
  label: string
  icon: string
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '🏆' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'teams', label: 'Teams', icon: '👥' },
  { id: 'rounds', label: 'Rounds', icon: '🔀' },
]

const TabBar = ({
  activeTab,
  onTabChange,
  isIndividual,
}: {
  activeTab: string
  onTabChange: (id: string) => void
  isIndividual?: boolean
}) => (
  <div className="flex items-center justify-between border-b border-gray-200 mb-5">
    <div className="flex gap-1">
      {TABS.map(tab => {
        const label =
          tab.id === 'teams' && isIndividual ? 'Players' : tab.label
        const icon =
          tab.id === 'teams' && isIndividual ? '👤' : tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold
                        border-b-2 transition-colors -mb-px
                        ${
                          activeTab === tab.id
                            ? 'border-green-900 text-green-900'
                            : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                        }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        )
      })}
    </div>
  </div>
)

const CompetitionOverview = ({
  competition,
  onCopy,
  onStart,
}: {
  competition: CompetitionInterface
  onCopy: (text: string) => void
  onStart: () => void
}) => {
  const isActive = competition.status === 'active'
  const isCompleted = competition.status === 'completed'

  return (
    <div className="space-y-5">
      {competition.public_link ? (
        <div>
          <p className="text-sm font-bold text-gray-900 mb-1.5">Public Sharing Link</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={competition.public_link}
              readOnly
              className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md
                       text-sm font-mono text-gray-700 bg-gray-50
                       focus:outline-none cursor-default select-all"
            />
            <button
              onClick={() => onCopy(competition.public_link)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold
                       bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md
                       border border-gray-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 
                     2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Share with participants to view standings and results</p>
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">No public link available for this competition.</p>
      )}

      {!isActive && !isCompleted && (
        <div className="pt-4 border-t border-gray-200">
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-green-900">Ready to begin?</p>
                <p className="text-xs text-green-700 mt-0.5">
                  Starting the competition will lock its settings and generate matches and rounds.
                </p>
              </div>
              <button
                onClick={onStart}
                className="shrink-0 flex items-center gap-2 bg-green-900 hover:bg-green-800
                           active:scale-95 text-white text-sm font-bold
                           px-5 py-2.5 rounded-lg shadow-sm transition-all duration-150"
              >
                <span className="text-base">🚀</span>
                Start Competition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const SingleCompetition = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()
  const [competition, setCompetition] = useState<CompetitionInterface | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [showStartModal, setShowStartModal] = useState(false)

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

  const handleStartCompetition = async () => {
    setShowStartModal(false)
    try {
      const response = await startCompetition(competition.id)
      setCompetition(response?.data)
      showToast('Competition started!', true)
    } catch (err: any) {
      showToast(err || 'Failed to activate competition.', false)
    }
  }

  return (
    <PageWindow
      title={`Manage competition - ${competition.name || ''}`}
      headerActionButtons={
        <button
          className="bg-gray-100 text-gray-900 text-sm font-semibold px-3.5 py-1.5
                     rounded-md hover:bg-gray-200 flex items-start gap-2 transition-colors"
          onClick={() => navigate('/competitions')}
        >
          <span>←</span> Back to dashboard
        </button>
      }
    >
      {showStartModal && (
        <ConfirmModal
          title="Start Competition?"
          description="This will lock settings and begin match generation. This action cannot be undone."
          confirmLabel="Start"
          onConfirm={handleStartCompetition}
          onCancel={() => setShowStartModal(false)}
        />
      )}

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isIndividual={competition.individual}
      />

      {activeTab === 'overview' && (
        <CompetitionOverview
          competition={competition}
          onCopy={text => {
            navigator.clipboard.writeText(text)
            showToast('Public link copied to clipboard!', true)
          }}
          onStart={() => setShowStartModal(true)}
        />
      )}

      {activeTab === 'teams' && (
        <Teams competition={competition} />
      )}

      {activeTab === 'rounds' && (
        <Rounds competition={competition} />
      )}

      {activeTab === 'settings' && (
        <CompetitionSettings competition={competition} onCompetitionChange={setCompetition} />
      )}
    </PageWindow>
  )
}

export default SingleCompetition