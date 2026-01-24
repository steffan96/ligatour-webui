import {createHashRouter} from 'react-router-dom';
import React from 'react';
import RootLayout from '../components/layouts/RootLayout';
import MyCompetitions from '../components/layouts/MyCompetitionsLayout';
import RegisterComponent from '../components/auth/RegisterComponent';
import LandingLayout from '../components/layouts/LandingLayout';

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
		],
	},
]);
