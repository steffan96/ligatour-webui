import React from 'react'
// import { useNavigate } from 'react-router-dom'

interface PageWindowProps {
  headerActionButtons?: React.ReactNode
  children: React.ReactNode
  title?: string
}

const PageWindow = ({ headerActionButtons, children, title }: PageWindowProps) => {
  return (
    <div className="h-full w-full p-2">
      <div className="bg-white rounded-lg shadow-lg flex flex-col h-full overflow-hidden border border-gray-100">
        <div
          className="px-6 py-4 flex items-center 
        justify-between flex-shrink-0 border-b border-gray-100"
        >
          <div className="flex items-center space-x-2">
            {/* Window control dots (like macOS) */}
            {/* <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 "></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 "></div>
              <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 "></div>
            </div> */}

            {/* Title with subtle styling */}
            {title && (
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">{title}</span>
              </div>
            )}
          </div>

          {headerActionButtons && (
            <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
              {headerActionButtons}
            </div>
          )}
        </div>

        {/* Subtle decorative element */}
        <div className="h-1 bg-green-700"></div>

        {/* Body - Scrollable with improved spacing */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm p-6">{children}</div>
        </div>

        {/* Optional footer with subtle border */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 flex justify-between">
          <span>Ready</span>
          <span className="flex items-center space-x-4">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Connected
            </span>
            <span>v1.0.0</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default PageWindow
