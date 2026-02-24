import React from 'react'
import { useState, useEffect } from 'react'
import { listCompetitions } from 'api/competitions'
import CompetitionCard from './CompetitionCard'
import CreateComponentComponent from './CreateCompetitionComponent'
import { CompetitionTypeDisplay } from './constants'

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

  // Filter competitions based on search term and type
  useEffect(() => {
    let filtered = competitions

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(comp => 
        comp.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by competition type
    if (selectedType) {
      filtered = filtered.filter(comp => comp.type === selectedType)
    }

    setFilteredCompetitions(filtered)
  }, [searchTerm, selectedType, competitions])

  useEffect(() => {
    fetchCompetitions()
  }, [])

  return (
    <div className="flex flex-col w-full p-2">
      <div className="w-[98%] ml-auto">
        <CreateComponentComponent />
        
        <div className="flex items-center gap-4 m-2">
          <h3 className="text-1xl font-bold">List of competitions</h3>
          
          {/* Search input */}
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Type filter dropdown */}
          <select 
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {Object.entries(CompetitionTypeDisplay).map(([type, displayName]) => (
              <option key={type} value={type}>
                {displayName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 border border-gray-200 rounded-lg p-4 mr-8">
          {filteredCompetitions.length > 0 ? (
            filteredCompetitions.map(competition => (
              <CompetitionCard key={competition.id} name={competition.name} type={competition.type} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No competitions found</p>
          )}
        </div>
      </div>
    </div>
  )
}