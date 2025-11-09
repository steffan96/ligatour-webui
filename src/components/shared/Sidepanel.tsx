import React from 'react';
import Button from './Button';
import useStore from '../../store/useStore';

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
					<Button onClick={openModal} text='Create league' className='bg-amber-700 hover:bg-gray-700 text-white'></Button>
					<Button onClick={openModal} text='Create Tournament' className='text-gray-700 hover:bg-amber-700'></Button>
				</div>
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
