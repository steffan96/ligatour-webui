import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../shared/Header';
import { InfoMessageCard } from '../shared/InfoMessageCard';
import { useToastStore } from '../../api/stores/useToastStore';
import SidebarCompetitions from '../competitions/SidebarCompetitions';

export default function RootLayout() {
	const { toast, hideToast } = useToastStore();
	return (
		<div className='bg-gray-300 h-full w-full'>
			{toast && (
				<InfoMessageCard message={toast.message} isSuccess={toast.isSuccess} onClose={hideToast} />
			)}
			<div className='flex flex-col h-full w-full'>
				<Header />
				<SidebarCompetitions />
				<main className='flex-1 bg-gray-300 overflow-auto'>
					<Outlet />
				</main>
				{/* <Footer /> */}
			</div>
		</div>
	);
}
