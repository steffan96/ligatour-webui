import React, { useState, useRef, useEffect } from 'react'

const CustomSelect = ({
  value,
  options,
  onChange,
  disabled = false,
  className = '',
}: {
  value: string
  options: Array<{ value: string; label: string }>
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value)
  
  // Sort options: selected first, then others
  const sortedOptions = [
    selectedOption,
    ...options.filter(opt => opt.value !== value),
  ].filter((option) => option !== undefined)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`${className} flex items-center justify-between`}
      >
        <span>{selectedOption?.label || 'Select...'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full 
        left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {sortedOptions.map((option) => {
            if (!option) return null
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
                  option.value === value
                    ? 'bg-green-900 text-white'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CustomSelect