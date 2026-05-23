import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition, CompetitionInterface } from 'api/competitions'
import PageWindow from '../shared/PageWindow'
import { useToastStore } from '../../api/stores/useToastStore'
import CompetitionSettings from './CompetitionSettings'
import Teams from '../teams/Teams'
import TeamPlayers from '../teams/TeamPlayers'
import Rounds from '../rounds/Rounds'
import SingleRound from '../rounds/SingleRounds'

type TabId = 'overview' | 'settings' | 'teams' | 'rounds'

type Tab = {
  id: TabId
  label: string
  icon: string
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '🏆' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'teams', label: 'Teams', icon: '👥' },
  { id: 'rounds', label: 'Rounds', icon: '🔀' },
]

const BackButton = ({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) => (
  <button
    className="bg-gray-100 text-gray-900 text-sm font-semibold px-3.5 py-1.5
               rounded-md hover:bg-gray-200 flex items-center gap-2 transition-colors"
    onClick={onClick}
  >
    <span>←</span> {label}
  </button>
)

const TabBar = ({
  activeTab,
  onTabChange,
  isIndividual,
}: {
  activeTab: TabId
  onTabChange: (id: TabId) => void
  isIndividual?: boolean
}) => (
  <div className="flex items-center justify-between border-b border-gray-200 mb-5">
    <div className="flex gap-1">
      {TABS.map(tab => {
        const isTeams = tab.id === 'teams'
        const label = isTeams && isIndividual ? 'Players' : tab.label
        const icon = isTeams && isIndividual ? '👤' : tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold
                        border-b-2 transition-colors -mb-px
                        ${activeTab === tab.id
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

const PublicLink = ({
  link,
  onCopy,
}: {
  link: string
  onCopy: (text: string) => void
}) => (
  <div>
    <p className="text-sm font-bold text-gray-900 mb-1.5">Public Sharing Link</p>
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={link}
        readOnly
        className="w-full px-2.5 py-1.5 border border-gray-300 rounded-md
                   text-sm font-mono text-gray-700 bg-gray-50
                   focus:outline-none cursor-default select-all"
      />
      <button
        onClick={() => onCopy(link)}
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
)

const CompetitionOverview = ({
  competition,
  onCopy,
}: {
  competition: CompetitionInterface
  onCopy: (text: string) => void
}) => {
  return (
    <div className="space-y-5">
      {competition.public_link && <PublicLink link={competition.public_link} onCopy={onCopy} />}
    </div>
  )
}

const SingleCompetition = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()
  const [competition, setCompetition] = useState<CompetitionInterface | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return
    getCompetition(Number(id))
      .then(res => setCompetition(res?.data ?? null))
      .catch(err => {
        showToast(err || 'Failed to load competition.', false)
        navigate('/competitions')
      })
  }, [id, navigate, showToast])

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab)
    if (tab !== 'teams') setSelectedTeamId(null)
    if (tab !== 'rounds') setSelectedRoundId(null)
  }, [])

  const handleCopyLink = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    showToast('Public link copied to clipboard!', true)
  }, [showToast])

  const headerActionButton = useMemo(() => {
    if (selectedRoundId !== null)
      return <BackButton label="Back to Rounds" onClick={() => setSelectedRoundId(null)} />
    if (selectedTeamId !== null)
      return <BackButton label="Back to Teams" onClick={() => setSelectedTeamId(null)} />
    return <BackButton label="Back to dashboard" onClick={() => navigate('/competitions')} />
  }, [selectedRoundId, selectedTeamId, navigate])

  if (!competition) return null

  return (
    <PageWindow
      title={`${competition.name}`}
      headerActionButtons={headerActionButton}
    >
      <TabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isIndividual={competition.individual}
      />

      {activeTab === 'overview' && (
        <CompetitionOverview
          competition={competition}
          onCopy={handleCopyLink}
        />
      )}

      {activeTab === 'teams' && (
        selectedTeamId === null
          ? <Teams competition={competition} onManagePlayers={setSelectedTeamId} />
          : <TeamPlayers teamId={String(selectedTeamId)} onBack={() => setSelectedTeamId(null)} />
      )}

      {activeTab === 'rounds' && (
        selectedRoundId === null
          ? <Rounds competition={competition} onSelectRound={setSelectedRoundId} />
          : <SingleRound competitionId={competition.id}
            roundId={selectedRoundId} />
      )}

      {activeTab === 'settings' && (
        <CompetitionSettings competition={competition} onCompetitionChange={setCompetition} />
      )}
    </PageWindow>
  )
}

export default SingleCompetition