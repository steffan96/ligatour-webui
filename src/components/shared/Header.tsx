import React from 'react'
import HeaderButton from './HeaderButton'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Header = () => {
  const navigate = useNavigate()
  const isUserLoggedIn = Boolean(localStorage.getItem('token') || localStorage.getItem('refreshToken'))
  const [activeButton, setActiveButton] = useState('home')

  const buttonStyles = {
    active: `bg-green-900 text-white px-5 py-2 rounded-lg 
             font-semibold border-2 border-amber-500 
             transition-all`,
    inactive: `bg-transparent border-2 border-gray-300 
              text-gray-700 px-5 py-2 rounded-lg 
              font-semibold hover:border-green-900 
              hover:text-green-900 transition-colors`,
    logout: `bg-transparent border-2 border-gray-300 
            text-gray-700 px-5 py-2 rounded-lg 
            font-semibold hover:bg-red-50 
            hover:border-red-600 hover:text-red-600 
            transition-colors`,
  }

  return (
    <header
      className="w-full bg-white border-b border-gray-200 
                 px-8 py-5 flex items-center justify-between 
                 flex-shrink-0"
    >
      {/* Left Section - Navigation */}
      <div className="flex items-center gap-4">
        {!isUserLoggedIn ? (
          <>
            <HeaderButton
              text="Login"
              className={activeButton === 'login' ? buttonStyles.active : buttonStyles.inactive}
              onClick={() => {
                navigate('login')
                setActiveButton('login')
              }}
            />
            <HeaderButton
              text="Register"
              className={activeButton === 'register' ? buttonStyles.active : buttonStyles.inactive}
              onClick={() => {
                navigate('register')
                setActiveButton('register')
              }}
            />
          </>
        ) : null}
      </div>

      {/* Right Section - CTA / Logout */}
      <div className="flex items-center gap-4">
        <p className="text-lg font-semibold text-gray-700">Start your own competition.</p>
      </div>
    </header>
  )
}

export default Header
