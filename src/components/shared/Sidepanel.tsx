import React from 'react';
import useStore from '../../store/useStore';
import Button from './Button';

export default function Sidepanel() {
	const openModal = useStore(state => state.openModal);
	return (
		<div className='w-[15%] h-[100%] bg-stone-100 shadow-md p-4'>
			{/* <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-2 border border-gray-300 rounded text-gray-700"
                />
            </div> */}

			{/* Categories */}
			<div className='mb-6'>
				<div className='flex flex-wrap gap-2'>
					<Button
						onClick={() => openModal({title: 'Create Competition'})}
						text='Create competition'
						className='w-full bg-white border border-amber-700 text-amber-700 font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-amber-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 py-2 px-4'>
					</Button>
					{/* <Button
						onClick={() => openModal({title: 'Create Tournament'})}
						text='Create Tournament'
						className='w-full mt-2 bg-white border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white transition-colors'>
					</Button> */}
				</div>
				<Button
					text='My Competitions'
					className='w-full mt-4 bg-white border border-amber-700 text-amber-700 font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-amber-700 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50 py-2 px-4'
					//onClick={}
				/>
			</div>

			{/* Auth Buttons */}
			{/* <div className="mt-auto">
                <div className="flex gap-2 mb-6">
                    <button className="flex-1 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50">Log in</button>
                    <button className="flex-1 py-2 bg-amber-700 text-white rounded hover:bg-amber-800">Sign up</button>
                </div>
            </div> */}
		</div>
	);
}
