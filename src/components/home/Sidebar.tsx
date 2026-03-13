import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../api/auth'
import { useToastStore } from '../../api/stores/useToastStore'

const SidebarComponent = () => {
  const navigate = useNavigate()
  const { showToast } = useToastStore()
  const [activeButton, setActiveButton] = useState('Home')

  const menuItems = [
    { icon: '▦', label: 'Dashboard', onClick: () => navigate('/competitions') },
    { icon: '👥', label: 'Profile', onClick: () => navigate('profile') },
  ]

  const handleLogout = () => {
    logoutUser()
    showToast('Logout successful!', true)
  }

  return (
    <div className="w-[13%] border-r p-4 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-xs text-gray-500 mb-2">Administration</h3>
        <div className="space-y-1">
          {menuItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                setActiveButton(item.label)
                item.onClick()
              }}
              className={`w-full flex items-center gap-3 px-3 py-1.5 text-sm rounded ${
                activeButton === item.label ? 'bg-green-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-1.5 text-sm rounded text-red-600 hover:bg-red-50"
      >
        <span className="text-base">🚪</span>
        <span>Log out</span>
      </button>
    </div>
  )
}

export default SidebarComponent