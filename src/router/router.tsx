import {createHashRouter} from 'react-router-dom';
import React from 'react';
import RootLayout from '../components/home/RootLayout';
import MyCompetitions from '../components/home/MyCompetitionsLayout';
import RegisterComponent from '../components/auth/RegisterComponent';
import LandingLayout from '../components/home/LandingLayout';
import LoginComponent from '../components/auth/LoginComponent';
import ResetPasswordComponent from '../components/auth/ResetPasswordComponent';
import ForgotPasswordComponent from '../components/auth/ForgotPasswordComponent';

export const router = createHashRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				path: '/',
				index: true,
				element: <LandingLayout />,
			},
			{
				path: '/my-competitions',
				element: <MyCompetitions />,
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
				path: '/reset-password',
				element: <ResetPasswordComponent />,
			},
			{
				path: '/forgot-password',
				element: <ForgotPasswordComponent />,
			}
		],
	},
]);
