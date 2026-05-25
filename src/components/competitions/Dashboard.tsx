import { listCompetitions } from 'api/competitions';
import React, { useEffect, useState } from 'react';
import { CompetitionTypeDisplay } from '../../api/interfaces/competitions';
import { useToastStore } from '../../api/stores/useToastStore';
import Pagination from '../common/Pagination';
import PageWindow from '../shared/PageWindow';
import CompetitionCard from './CompetitionCard';
import CreateCompetitionComponent from './CreateCompetition';

export default function DashboardComponent() {
  const { showToast } = useToastStore();
  const [competitions, setCompetitions] = useState<
    { id: string; name: string; type?: string; number_of_teams?: number }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [filteredCompetitions, setFilteredCompetitions] = useState<
    { id: string; name: string; type?: string; number_of_teams?: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchCompetitions = async () => {
    setIsLoading(true);
    try {
      const response = await listCompetitions();
      const data = response?.data || [];
      setCompetitions(data);
      setFilteredCompetitions(data);
    } catch (err: any) {
      showToast(err || 'Failed to load competitions.', false);
      setCompetitions([]);
      setFilteredCompetitions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = competitions;
    if (searchTerm) {
      filtered = filtered.filter((comp) => comp.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedType) {
      filtered = filtered.filter((comp) => comp.type === selectedType);
    }
    setFilteredCompetitions(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedType, competitions]);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const totalPages = Math.ceil(filteredCompetitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompetitions = filteredCompetitions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <PageWindow title="Main Dashboard">
      {/* Search & Filter */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 
            rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
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
        {isLoading ? (
          <p className="text-gray-500 text-center py-4">Loading competitions...</p>
        ) : paginatedCompetitions.length > 0 ? (
          paginatedCompetitions.map((competition) => (
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

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCompetitions.length}
          itemLabel="competitions"
          onPageChange={setCurrentPage}
        />
      )}
    </PageWindow>
  );
}
