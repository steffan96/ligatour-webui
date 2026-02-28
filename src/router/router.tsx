import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import RootLayout from '../components/home/RootLayout';
import DashboardComponent from '../components/competitions/DashboardComponent';
import RegisterComponent from '../components/auth/RegisterComponent';
import CompetitionTeams from '../components/competitions/CompetitionTeams';
import LoginComponent from '../components/auth/LoginComponent';
import ResetPasswordComponent from '../components/auth/ResetPasswordComponent';
import ForgotPasswordComponent from '../components/auth/ForgotPasswordComponent';
import SingleCompetition from '../components/competitions/SingleCompetition';
import ProfileComponent from '../components/auth/ProfileComponent';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			// Competitions routes
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
			},
			{
				path: '/competition/:id/teams',
				element: <CompetitionTeams />,
			},

			// Auth routes
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
			}
		],
	},
]);
