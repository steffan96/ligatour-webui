import {createHashRouter} from 'react-router-dom';
import Sidepanel from '../components/shared/sidepanel';
import RootLayout from '../components/layouts/rootLayout';
import React from 'react';

export const router = createHashRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{
				path: '/',
				element: <Sidepanel />,
			},
		],
	},
]);
