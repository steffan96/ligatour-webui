import useStore from '../../store/useStore';
import React from 'react';

export default function Modal() {
	const closeModal = useStore(state => state.closeModal);
	const modalArgs = useStore(state => state.modalArgs);

	if (!modalArgs) return null;

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
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
