import React from 'react';
import Button from '../shared/Button';
import CreateComponentHeader from './CreateComponentHeader';
import CreateModal from './CreateModal';
import { useState } from 'react';

export default function CreateComponent({type}: {type: 'leagues' | 'tournaments'}) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	return (
		<>
			<div className='flex flex-row justify-between items-start mt-8'>
				<CreateComponentHeader
					title={type === 'leagues' ? 'Leagues' : 'Tournaments'}
					description={`Create and manage your ${type}`}
				/>
				<Button text={`+ Create ${type === 'leagues' ? 'League' : 'Tournament'}`} className='h-8 w-48 bg-green-800 text-gray-300 mt-4 ml-4 rounded-md' onClick={() => {
					setIsModalOpen(true);
				}} />
			</div>
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black bg-opacity-50 mb-8">
					<div className="w-[50%] h-[75%]">
						<CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
					</div>
				</div>
			)}
			<div className='ml-4 border-2 border-dotted border-black p-4'>
				<div className='flex flex-col justify-center items-center'>
					<h1 className='text-lg font-semibold mb-4'>{`No ${type} yet`}</h1>
					<p>{`Create your first ${type === 'leagues' ? 'league' : 'tournament'} to get started.`}</p>
					<Button text={`+ Create ${type === 'leagues' ? 'League' : 'Tournament'}`} className='h-8 w-48 bg-green-800 text-gray-300 mt-4 ml-4 rounded-md' onClick={() => {
						// TODO: Implement create functionality
					}} />
				</div>
			</div>
		</>
	);
}
