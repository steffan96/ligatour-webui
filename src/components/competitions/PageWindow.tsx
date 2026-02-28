import React from 'react'
import { useNavigate } from 'react-router-dom'

interface PageWindowProps {
  title: string
  subtitle?: string
  backPath?: string
  headerAction?: React.ReactNode
  children: React.ReactNode
}

const PageWindow = ({ title, subtitle, backPath, headerAction, children }: PageWindowProps) => {
  const navigate = useNavigate()

  return (
    <div className="h-full w-full p-4">
      <div className="bg-white rounded-2xl shadow flex flex-col h-full overflow-hidden">
        {/* Header - Fixed */}
        <div className="bg-green-900 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {backPath && (
              <button
                className="bg-green-800 text-white 
                text-xs font-semibold px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => navigate(backPath)}
              >
                ←
              </button>
            )}
            <div>
              <h1 className="text-white text-xl font-semibold">{title}</h1>
              {subtitle && <p className="text-green-200 text-xs mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default PageWindow