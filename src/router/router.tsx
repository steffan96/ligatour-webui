import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import RootLayout from '../components/home/RootLayout';
import DashboardComponent from '../components/competitions/Dashboard';
import RegisterComponent from '../components/auth/Register';
import CompetitionParticipants from '../components/competitions/CompetitionParticipants';
import LoginComponent from '../components/auth/Login';
import ResetPasswordComponent from '../components/auth/ResetPassword';
import ForgotPasswordComponent from '../components/auth/ForgotPassword';
import SingleCompetition from '../components/competitions/SingleCompetition';
import ProfileComponent from '../components/auth/Profile';

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
				element: <CompetitionParticipants />,
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
