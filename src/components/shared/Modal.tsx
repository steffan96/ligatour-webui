import useStore from '../../store/useStore';
import React from 'react';
export default function Modal() {
	const closeModal = useStore(state => state.closeModal);
	const leagueTypes = [
		{id: 1, label: 'Round robin', key: 'round_robin'},
		{id: 2, label: 'Group stage', key: 'group_stage'},
		{id: 3, label: 'Swiss', key: 'swiss'},
	];

	return (
		<div className='fixed inset-0 flex items-center justify-center p-4 bg-black/50'>
			<div className='bg-green-900 rounded-lg relative w-[50%] h-[40%]'>
				<button
					onClick={closeModal}
					className='absolute top-3 right-3 text-white hover:text-gray-300 text-xl'
				>
					×
				</button>
				<div className='p-6'>
					<div className='text-center'>
						<h1 className='text-2xl text-gray-300 pb-2'>
							Create new League
						</h1>
						<div className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								{leagueTypes.map(type => (
									<button
										key={type.id}
										className='bg-green-800 hover:bg-green-700 p-4 
										rounded-lg text-white text-lg transition-colors duration-200 
										border-2 border-transparent hover:border-green-400'
										onClick={() => {
											console.log('Selected:', type.key);
										}}
									>
										{type.label}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
