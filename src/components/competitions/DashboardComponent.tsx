import React from 'react'
import { useState, useEffect } from 'react'
import { listCompetitions } from 'api/competitions'
import CompetitionCard from './CompetitionCard'
import CreateComponentComponent from './CreateCompetitionComponent'
import { CompetitionTypeDisplay } from './constants'
import PageWindow from './PageWindow'

export default function DashboardComponent() {
  const [competitions, setCompetitions] = useState<{ id: string; name: string; type?: string }[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [filteredCompetitions, setFilteredCompetitions] = useState<{ id: string; name: string; type?: string }[]>([])

  const fetchCompetitions = async () => {
    const data = await listCompetitions()
    setCompetitions(data || [])
    setFilteredCompetitions(data || [])
  }

  useEffect(() => {
    let filtered = competitions
    if (searchTerm) {
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedType) {
      filtered = filtered.filter(comp => comp.type === selectedType)
    }
    setFilteredCompetitions(filtered)
  }, [searchTerm, selectedType, competitions])

  useEffect(() => {
    fetchCompetitions()
  }, [])

  return (
    <PageWindow title="Dashboard" subtitle="">
      <CreateComponentComponent />

      {/* Search & Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search competitions..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 
          rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 
          rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">All Types</option>
          {Object.entries(CompetitionTypeDisplay).map(([type, displayName]) => (
            <option key={type} value={type}>{displayName}</option>
          ))}
        </select>
      </div>

      {/* Competition List */}
      <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 grid grid-cols-1 gap-2">
        {filteredCompetitions.length > 0 ? (
          filteredCompetitions.map(competition => (
            <CompetitionCard
              key={competition.id}
              id={competition.id}
              name={competition.name}
              type={competition.type}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No competitions found</p>
        )}
      </div>
    </PageWindow>
  )
}