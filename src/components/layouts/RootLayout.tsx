import React from 'react';
import Header from '../shared/header';
import LandingLayout from './LandingLayout';

export default function RootLayout() {
	return (
		<div className='bg-gray-300 h-full w-full'>
			<div className='flex flex-col h-full w-full'>
				<Header />
				<main className='flex-1 bg-gray-300 overflow-auto'>
					<LandingLayout />
				</main>
				{/* <Footer /> */}
			</div>
		</div>
	);
}
