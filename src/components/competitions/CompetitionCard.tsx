import React from 'react'
import { CompetitionTypeDisplay, CompetitionType } from './constants'

function isValidCompetitionType(type: string): type is CompetitionType {
  return Object.values(CompetitionType).includes(type as CompetitionType);
}

export default function CompetitionCard({ name, type }: { name: string; type?: string }) {
  return (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-center">
        <span className="font-medium">{name}</span>
        {type && isValidCompetitionType(type) && (
          <span className="text-sm text-gray-600">
            {CompetitionTypeDisplay[type]}
          </span>
        )}
      </div>
    </div>
  )
}