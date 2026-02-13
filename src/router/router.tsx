import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import RootLayout from '../components/home/RootLayout';
import MyCompetitions from '../components/competitions/MyCompetitionsLayout';
import RegisterComponent from '../components/auth/RegisterComponent';
import LandingLayout from '../components/home/LandingLayout';
import LoginComponent from '../components/auth/LoginComponent';
import ResetPasswordComponent from '../components/auth/ResetPasswordComponent';
import ForgotPasswordComponent from '../components/auth/ForgotPasswordComponent';
import SingleCompetition from '../components/competitions/SingleCompetition';

export const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			// Competitions routes
			{
				path: '/',
				index: true,
				element: <LandingLayout />,
			},
			{
				path: '/competitions',
				element: <MyCompetitions />,
			},
			{
				path: '/competition/:id',
				element: <SingleCompetition />,
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
			}
		],
	},
]);
