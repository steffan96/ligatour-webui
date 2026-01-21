import {createHashRouter} from 'react-router-dom';
import React from 'react';
import RootLayout from '../components/layouts/RootLayout';
import MyCompetitions from '../components/layouts/MyCompetitionsLayout';
import RegisterComponent from '../components/auth/RegisterComponent';

export const router = createHashRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				path: '/my-competitions',
				element: <MyCompetitions />,
			},
	  {
				path: '/registration',
				element: <RegisterComponent />,
	  },
		],
	},
]);
