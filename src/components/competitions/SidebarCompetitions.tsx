import React from 'react'

const SidebarCompetitions = () => {
  return (
    <div className="w-[13%] !h-full border-r p-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 bg-green-900 rounded flex items-center justify-center">
          <span className="text-white text-xs">SA</span>
        </div>
        <span className="text-sm font-medium">Leagues center</span>
      </div>

      <div>
        <h3 className="text-xs text-gray-500 mb-2">Administration</h3>
        <div className="space-y-1">
          {[
            { icon: "▦", label: "Dashboard" },
            { icon: "👥", label: "User Management", active: true },
            // { icon: "📄", label: "Reports" },
            // { icon: "💳", label: "Payments" },
            { icon: "⚙️", label: "Settings" }
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-1.5 text-sm rounded ${
                item.active 
                  ? "bg-green-900 text-white" 
                  : "text-gray-600 hover:bg-gray-100"
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

export default SidebarCompetitions