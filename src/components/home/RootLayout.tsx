import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../shared/Header'
import { InfoMessageCard } from '../shared/InfoMessageCard'
import { useToastStore } from '../../api/stores/useToastStore'
import SidebarComponent from './Sidebar'

export default function RootLayout() {
  const { toast, hideToast } = useToastStore()

  return (
    <div
      className="flex bg-gray-100 h-screen w-full 
                 overflow-hidden"
    >
      {/* Sidebar */}
      <SidebarComponent />

      {/* Main Content Area */}
      <div
        className="flex flex-col flex-1 h-screen 
                   overflow-hidden"
      >
        {/* Toast Notification */}
        {toast && (
          <InfoMessageCard
            message={toast.message}
            isSuccess={toast.isSuccess}
            onClose={hideToast}
          />
        )}

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main
          className="flex-1 min-h-0 overflow-auto 
                     p-8 bg-white"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}