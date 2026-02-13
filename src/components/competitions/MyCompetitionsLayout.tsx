import React from 'react'
import { useState, useEffect } from 'react'
import { listCompetitions } from 'api/competitions'
import CompetitionCard from './CompetitionCard'

export default function MyCompetitions() {
  const [competitions, setCompetitions] = useState<{ id: string; name: string }[]>([])
  const fetchCompetitions = async () => {
    const data = await listCompetitions()
    setCompetitions(data || [])
  }

  useEffect(() => {
    fetchCompetitions()
  }, [])

  return (
    <div className="flex flex-col">
      <h3 className="text-1xl font-bold ml-8">List of competitions</h3>
      {competitions.map(competition => (
        <CompetitionCard key={competition.id} name={competition.name} />
      ))}
    </div>
  )
}
