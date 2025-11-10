import {Outlet} from 'react-router-dom';
import React from 'react';
import Header from '../shared/header';
import Modal from '../shared/modal';
import useStore from '../../store/useStore';

export default function RootLayout() {
	const {isModalOpen} = useStore();
	return (
		<div className='bg-gray-300 h-full w-full'>
			<div className='flex flex-col h-full w-full'>
				<Header />
				<main className='flex-1 bg-gray-300 overflow-auto'>
					{isModalOpen && <Modal />}
					<Outlet />
				</main>
				{/* <Footer /> */}
			</div>
		</div>
	);
}
