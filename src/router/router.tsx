import { createBrowserRouter } from 'react-router-dom'
import React from 'react'
import RootLayout from '../components/home/RootLayout'
import PublicLayout from '../components/home/PublicLayout'
import DashboardComponent from '../components/competitions/Dashboard'
import RegisterComponent from '../components/auth/Register'
import LoginComponent from '../components/auth/Login'
import ResetPasswordComponent from '../components/auth/ResetPassword'
import ForgotPasswordComponent from '../components/auth/ForgotPassword'
import SingleCompetition from '../components/competitions/SingleCompetition'
import CompetitionTeams from '../components/teams/CompetitionTeams'
import TeamPlayers from '../components/teams/TeamPlayers'
import ProfileComponent from '../components/auth/Profile'
import PublicCompetition from '../components/competitions/PublicCompetition'
import Rounds from '../components/rounds/Rounds'

export const router = createBrowserRouter([
  {
    path: '/public',
    element: <PublicLayout />,
    children: [
      {
        path: '/public/:slug',
        element: <PublicCompetition />,
      },
    ],
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        index: true,
        element: <DashboardComponent />,
      },
      {
        path: '/competitions',
        element: <DashboardComponent />,
      },
      {
        path: '/competition/:id',
        element: <SingleCompetition />,
        children: [
          {
            path: 'rounds',
            element: <Rounds />,
          },
        ],
      },
      {
        path: '/competition/:id/teams',
        element: <CompetitionTeams />,
      },
      {
        path: '/team/:teamId/players',
        element: <TeamPlayers />,
      },
      {
        path: '/register',
        element: <RegisterComponent />,
      },
      {
        path: '/login',
        element: <LoginComponent />,
      },
      {
        path: '/reset-password/:token',
        element: <ResetPasswordComponent />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordComponent />,
      },
      {
        path: '/profile',
        element: <ProfileComponent />,
      },
    ],
  },
])
