import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CompetitionType } from './interfaces'

function isValidCompetitionType(type: string): type is CompetitionType {
  return Object.values(CompetitionType).includes(type as CompetitionType)
}

export default function CompetitionCard({ id, name, type }: { id: string; name: string; type?: string }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/competition/${id}`)
  }

  return (
    <div 
      className="p-4 border-b border-gray-900 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium">{name}</span>
        {type && isValidCompetitionType(type) && (
          <button
            className="w-7 h-7 flex items-center justify-center rounded-full 
         bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all duration-150 shadow-sm"
            onClick={(e) => {
              e.stopPropagation() // Prevent the card's onClick from firing
              handleClick()
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}