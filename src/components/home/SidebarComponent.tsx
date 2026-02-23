import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SidebarComponent = () => {
  const navigate = useNavigate()
  const [activeButton, setActiveButton] = useState('Home')

  const menuItems = [
    { icon: '🏠', label: 'Home', onClick: () => navigate('/') },
    { icon: '▦', label: 'Dashboard', onClick: () => navigate('/competitions') },
    { icon: '👥', label: 'Profile', onClick: () => navigate('profile') },
  ]

  return (
    <div className="w-[13%] border-r p-4">
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
    </div>
  )
}

export default SidebarComponent