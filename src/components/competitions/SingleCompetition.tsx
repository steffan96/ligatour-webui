import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom'
import { getCompetition, startCompetition } from 'api/competitions'
import { CompetitionInterface } from 'api/competitions'
import PageWindow from '../shared/PageWindow'
import { useToastStore } from '../../api/stores/useToastStore'
import CompetitionSettings from './CompetitionSettings'

export type SingleCompetitionContext = { competition: CompetitionInterface }

type Tab = {
  id: string
  label: string
  icon: string
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '🏆' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const TabBar = ({
  activeTab,
  onTabChange,
  actions,
}: {
  activeTab: string
  onTabChange: (id: string) => void
  actions?: React.ReactNode
}) => (
  <div className="flex items-center justify-between border-b border-gray-200 mb-5">
    <div className="flex gap-1">
      {TABS.map(tab => (
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
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
    {actions && <div className="flex items-center gap-2 pb-1">{actions}</div>}
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 
                2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
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
        <div className="pt-2 border-t border-gray-200">
          <button
            onClick={onStart}
            className="text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
          >
            🚀 Start Competition
          </button>
        </div>
      )}
    </div>
  )
}

const SingleCompetition = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToastStore()
  const [competition, setCompetition] = useState<CompetitionInterface | null>(null)
  const [activeTab, setActiveTab] = useState<string>('overview')

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

  const isChildRoute = location.pathname !== `/competition/${id}`
  if (isChildRoute) {
    return <Outlet context={{ competition } satisfies SingleCompetitionContext} />
  }

  const handleStartCompetition = async () => {
    try {
      const response = await startCompetition(competition.id)
      setCompetition(response?.data)
      showToast('Competition started!', true)
    } catch (err: any) {
      showToast(err || 'Failed to activate competition. Please try again or contact support.', false)
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
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        actions={
          <>
            <button
              className="bg-blue-50 text-blue-900 text-sm font-bold px-3.5 py-1.5
                         rounded-md hover:bg-blue-100 border border-blue-200 transition-colors"
              onClick={() => navigate(`/competition/${id}/teams`)}
            >
              {competition.individual ? '👤 Manage Players' : '👥 Manage Teams'}
            </button>
            <button
              className="bg-orange-50 text-orange-900 text-sm font-bold px-3.5 py-1.5
                         rounded-md hover:bg-orange-100 border border-orange-200 transition-colors"
              onClick={() => navigate(`/competition/${id}/matches?round=${competition.current_round ?? 1}`)}
            >
              🔀 Matches
            </button>
          </>
        }
      />

      {activeTab === 'overview' && (
        <CompetitionOverview
          competition={competition}
          onCopy={text => {
            navigator.clipboard.writeText(text)
            showToast('Public link copied to clipboard!', true)
          }}
          onStart={handleStartCompetition}
        />
      )}

      {activeTab === 'settings' && (
        <CompetitionSettings competition={competition} onCompetitionChange={setCompetition} />
      )}
    </PageWindow>
  )
}

export default SingleCompetition
