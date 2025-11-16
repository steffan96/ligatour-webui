import {createHashRouter} from 'react-router-dom';
import RootLayout from '../components/layouts/RootLayout';
import MyCompetitions from '../components/layouts/MyCompetitions';
import RegisterComponent from '../components/auth/RegisterComponent';
import React from 'react';

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
	  }
    ],
  },
]);
