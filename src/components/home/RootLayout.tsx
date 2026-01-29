import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../shared/Header';

export default function RootLayout() {
	return (
		<div className='bg-gray-300 h-full w-full'>
			<div className='flex flex-col h-full w-full'>
				<Header />
				<main className='flex-1 bg-gray-300 overflow-auto'>
						<Outlet />
				</main>
				{/* <Footer /> */}
			</div>
		</div>
	);
}
