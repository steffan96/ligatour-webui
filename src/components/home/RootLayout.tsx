import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../shared/Header';
import { InfoMessageCard } from '../shared/InfoMessageCard';
import { useToastStore } from '../../api/stores/useToastStore';
import SidebarComponent from './SidebarComponent';

export default function RootLayout() {
	const { toast, hideToast } = useToastStore();
	
	return (
		<div className='flex bg-gray-300 h-screen w-full overflow-hidden'>
			<SidebarComponent />
			<div className='flex flex-col flex-1 h-screen overflow-hidden'>
				{toast && (
					<div className="flex-shrink-0">
						<InfoMessageCard message={toast.message} isSuccess={toast.isSuccess} onClose={hideToast} />
					</div>
				)}
				<div className='flex-shrink-0'>
					<Header />
				</div>
				<main className='flex-1 min-h-0 overflow-hidden'>
					<Outlet />
				</main>
			</div>
		</div>
	);
}