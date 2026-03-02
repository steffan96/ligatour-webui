import React from 'react'
import Button from '../shared/HeaderButton'
import CreateModal from './CreateCompetitionModal'
import { useState } from 'react'

export default function CreateCompetitionComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        text={`+ Create Competition`}
        className="h-8 w-48 bg-green-800 text-gray-300 m-4 rounded-md"
        onClick={() => {
          setIsModalOpen(true)
        }}
      />
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-[50%] h-[75%]">
            <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
