import React from 'react';

export default function CreateModal({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void; }) {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    }

    const inputClass = 'w-full px-12 py-2 rounded-md border border-gray-300 ' + 
	'focus:border-green-900 focus:ring-2 focus:ring-green-200 focus:outline-none' + 
	' text-gray-800 bg-white shadow-sm transition duration-150';
	return (
		<div className={`flex flex-col p-4 bg-white rounded-md shadow-md ${isOpen ? 'block' : 'hidden'} w-[80%] h-[50%]`}>
            <div className="flex flex-row items-center justify-between">
                <h2 className='font-semibold mb-2'>Create New League</h2>
                <button className="flex justify-end" onClick={onClose}>
                    &#10005;
                </button>
            </div>
			<form onSubmit={handleSubmit} className='space-y-4'>
				{/* Form elements go here */}
				<input type="text" className={inputClass} placeholder="Name" required />
				<input type="select" className={inputClass} placeholder="Type" required />
				<button 
                    type="submit" 
                    className='w-full py-2 rounded-md bg-green-900 hover:bg-green-800 
                    text-white font-semibold transition duration-150'
                    >Create League
                </button>
                <button
                type="button"
                className='w-full py-2 rounded-md bg-red-900 hover:bg-red-800 
                text-white font-semibold transition duration-150'
                onClick={onClose}>
                    Cancel
                </button>
			</form>
		</div>
	);
}
