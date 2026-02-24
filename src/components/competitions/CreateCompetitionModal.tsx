import React, {useState} from 'react';
import { createCompetition } from '../../api/competitions';
import { useToastStore } from '../../api/stores/useToastStore';
import { useNavigate } from 'react-router-dom';
import { CompetitionTypeDisplay } from './constants';

export default function CreateModal({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void; }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [type, setType] = useState('');

    const { showToast } = useToastStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data = await createCompetition(name, type);
            if (!data) {
                showToast('Competition creation failed. Please try again.', false);
                return;
            }
            onClose?.();
            showToast('Competition created successfully!', true);
            navigate(`/competitions/${data.id}`);
        } catch (err: any) {
            showToast(err?.response?.data?.message || 'Competition creation failed.', false);
        }
    }

    const inputClass = 'w-full bg-gray-300 px-8 py-2 rounded-md' + 
    ' focus:outline-none text-gray-800 border-2 border-black';
    const buttonClass = 'w-32 h-12 px-2 py-1 rounded-md font-semibold text-xs text-white transition duration-150';

	return (
		<div className={`flex flex-col p-4 bg-gray-300 rounded-md shadow-md ${isOpen ? 'block' : 'hidden'} w-[50%] h-[75%]`}>
            <div className="flex flex-row items-center justify-between">
                <h1 className='font-semibold mb-2'>Create New Competition</h1>
                <button className="flex justify-end" onClick={onClose}>
                    &#10005;
                </button>
            </div>
			<form onSubmit={handleSubmit} className='space-y-4 flex flex-col h-full'>
				{/* Form elements go here */}
                <p>Name</p>
				 <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Premier Competition 2025"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
				<p>Type</p>
                <select
                    className={inputClass}
                    required
                    value={type}
                    onChange={e => setType(e.target.value)}
                >
                    <option value="">Select competition type</option>
                    {Object.entries(CompetitionTypeDisplay).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
				<div className='flex-grow'></div>
				<div className='flex flex-row justify-end space-x-4 mt-4'>
                    <button
                        type="button"
                        className={`${buttonClass} bg-red-900 hover:bg-red-800`}
                        onClick={onClose}
                    >Cancel</button>
                    <button
                        type="submit"
                        className={`${buttonClass} bg-green-900 hover:bg-green-800`}
                    >Create Competition</button>
                </div>
			</form>
		</div>
	);
}
