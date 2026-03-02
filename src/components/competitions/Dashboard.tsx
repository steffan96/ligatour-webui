import React from 'react'
import { useState, useEffect } from 'react'
import { listCompetitions } from 'api/competitions'
import CompetitionCard from './CompetitionCard'
import CreateCompetitionComponent from './CreateCompetition'
import { CompetitionTypeDisplay } from './interfaces'
import PageWindow from '../shared/PageWindow'

export default function DashboardComponent() {
  const [competitions, setCompetitions] = useState<
    { id: string; name: string; type?: string; number_of_teams?: number }[]
  >([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [filteredCompetitions, setFilteredCompetitions] = useState<
    { id: string; name: string; type?: string; number_of_teams?: number }[]
  >([])

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(4)
  const [paginatedCompetitions, setPaginatedCompetitions] = useState<
    { id: string; name: string; type?: string; number_of_teams?: number }[]
  >([])

  const fetchCompetitions = async () => {
    const data = await listCompetitions()
    setCompetitions(data || [])
    setFilteredCompetitions(data || [])
  }

  useEffect(() => {
    let filtered = competitions
    if (searchTerm) {
      filtered = filtered.filter(comp => comp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (selectedType) {
      filtered = filtered.filter(comp => comp.type === selectedType)
    }
    setFilteredCompetitions(filtered)
    // Reset to first page when filters change
    setCurrentPage(1)
  }, [searchTerm, selectedType, competitions])

  // Update paginated data when filtered competitions or current page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setPaginatedCompetitions(filteredCompetitions.slice(startIndex, endIndex))
  }, [filteredCompetitions, currentPage, itemsPerPage])

  useEffect(() => {
    fetchCompetitions()
  }, [])

  // Calculate total pages
  const totalPages = Math.ceil(filteredCompetitions.length / itemsPerPage)

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  return (
    <PageWindow title="Dashboard" subtitle="">
      {/* Search & Filter */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <div className="flex items-center gap-3">
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
              <option key={type} value={type}>
                {displayName}
              </option>
            ))}
          </select>
        </div>
        <CreateCompetitionComponent />
      </div>

      {/* Competition List */}
      <div className="grid grid-cols-1 gap-2">
        {paginatedCompetitions.length > 0 ? (
          paginatedCompetitions.map(competition => (
            <CompetitionCard
              key={competition.id}
              id={competition.id}
              name={competition.name}
              type={competition.type}
              numberOfTeams={competition.number_of_teams}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No competitions found</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-700">Number of total competitions: {filteredCompetitions.length}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded border ${
                    currentPage === page
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </PageWindow>
  )
}
