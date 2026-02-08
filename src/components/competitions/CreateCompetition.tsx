import React from 'react';
import Button from '../shared/Button';
import CreateModal from './CreateCompetitionModal';
import { useState } from 'react';

export default function CreateComponent() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<div className='flex flex-row justify-between items-start mt-8'>
				<p className='text-lg font-semibold m-4'></p>
				<Button text={`+ Create Competition`} 
					className='h-8 w-48 bg-green-800 text-gray-300 m-4 rounded-md' 
					onClick={() => {
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
		</>
	);
}
