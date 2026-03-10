import React, { useState } from 'react'
import { createCompetition } from '../../api/competitions'
import { useToastStore } from '../../api/stores/useToastStore'
import { useNavigate } from 'react-router-dom'
import { CompetitionTypeDisplay } from '../../api/interfaces/competitions'

export default function CreateModal({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [individual, setIndividual] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { showToast } = useToastStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await createCompetition(name, type, individual)
      onClose?.()
      showToast('Competition created successfully!', true)
      navigate(`/competition/${response.data.id}`)
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Competition creation failed.', false)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 
                           transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl 
                               overflow-hidden animate-in fade-in zoom-in-95 
                               duration-300"
        >
          {/* Header */}
          <div
            className="relative bg-gradient-to-r from-green-900 
                                   to-green-800 px-8 py-8"
          >
            <h2 className="text-2xl font-bold text-white tracking-tight">Create Competition</h2>
            <p className="text-green-100 text-sm mt-1">Set up a new competition and start managing entries</p>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 
                                       rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
                Competition Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 rounded-lg border 
                                          border-gray-300 focus:border-green-900 
                                          focus:ring-2 focus:ring-green-900/20 
                                          outline-none transition-all bg-white 
                                          text-gray-900 placeholder-gray-500"
                placeholder="e.g. Premier Competition 2025"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">Use a descriptive name to identify this competition</p>
            </div>

            {/* Type Field */}
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-semibold text-gray-900">
                Competition Type
              </label>
              <select
                id="type"
                className="w-full px-4 py-3 rounded-lg border 
                                          border-gray-300 focus:border-green-900 
                                          focus:ring-2 focus:ring-green-900/20 
                                          outline-none transition-all bg-white 
                                          text-gray-900"
                required
                value={type}
                onChange={e => setType(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select a competition type</option>
                {Object.entries(CompetitionTypeDisplay).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">Choose the type that best describes your competition</p>
            </div>

            {/* Individual Competition Toggle */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="individual" className="block text-sm font-semibold text-gray-900">
                    Individual Competition
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {individual ? 'Competitors participate individually' : 'Competitors participate in teams'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIndividual(!individual)}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center 
                                               rounded-full transition-colors ${
                                                 individual ? 'bg-green-900' : 'bg-gray-300'
                                               } disabled:opacity-50`}
                  role="switch"
                  aria-checked={individual}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white 
                                                   transition-transform ${
                                                     individual ? 'translate-x-6' : 'translate-x-1'
                                                   }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg font-medium 
                                          text-gray-700 bg-gray-100 hover:bg-gray-200 
                                          transition-colors disabled:opacity-50 
                                          disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !name || !type}
                className="flex-1 px-4 py-3 rounded-lg font-medium 
                                          text-white bg-gradient-to-r from-green-900 
                                          to-green-800 hover:from-green-800 
                                          hover:to-green-700 transition-all 
                                          disabled:opacity-50 disabled:cursor-not-allowed 
                                          shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Creating...
                  </span>
                ) : (
                  'Create Competition'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
