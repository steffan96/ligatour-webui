import useStore from '../../store/useStore';
import React from 'react';
import ButtonWithInput from './ButtonWithInput';

const leagueTypes = [
    {id: 1, label: 'Round robin', key: 'round_robin'},
    {id: 2, label: 'Group stage', key: 'group_stage'},
    {id: 3, label: 'Swiss', key: 'swiss'},
];

const tournamentTypes = [
    {id: 1, label: 'Single elimination', key: 'single_elimination'},
    {id: 2, label: 'Double elimination', key: 'double_elimination'},
];

export default function Modal() {
	const closeModal = useStore(state => state.closeModal);
	const modalArgs = useStore(state => state.modalArgs);

	if (!modalArgs) return null;

	let competitionTypes: CompetitionTypes[] = [];
	if (modalArgs.title === 'Create League') {
		competitionTypes = leagueTypes;
	} else if (modalArgs.title === 'Create Tournament') {
		competitionTypes = tournamentTypes;
	}

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
								{modalArgs.title}
						</h1>
						<div className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								{competitionTypes?.map(type => (
									<ButtonWithInput key={type.id} type={type} />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
