import React, {useState} from 'react';
import useStore from '../../store/useStore';
import {createLeague} from '../../api/leagues';
import InfoMessage from './InfoMessage';

const leagueTypes = [
	{id: 1, label: 'Round robin', key: 'round_robin'},
	{id: 2, label: 'Group stage', key: 'group_stage'},
	{id: 3, label: 'Swiss', key: 'swiss'},
	{id: 4, label: 'Single elimination', key: 'single_elimination'},
	{id: 5, label: 'Double elimination', key: 'double_elimination'},
];

export default function Modal() {
	const closeModal = useStore(state => state.closeModal);
	const modalArguments = useStore(state => state.modalArgs);

	const [name, setName] = useState('');
	const [type, setType] = useState(leagueTypes[0].key);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | undefined>(null);
	const [messageType, setMessageType] = useState<'success' | 'error' | undefined>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);
		setMessageType(null);
		try {
			await createLeague(name, type);
			setMessage('League created successfully!');
			setMessageType('success');
			setTimeout(() => {
				closeModal();
			}, 1200);
		} catch (error: any) {
			setMessage(String(error.response.data.message));
			setMessageType('error');
		} finally {
			setLoading(false);
		}
	};

	if (!modalArguments) {
		return null;
	}

	return (
		<div className='fixed inset-0 flex items-center justify-center p-4 bg-black/50'>
			{message && (
				<InfoMessage message={message} type={messageType ?? undefined} />
			)}
			<div className='bg-green-900 rounded-lg relative w-[50%] h-[30%]'>
				<button
					onClick={closeModal}
					className='absolute top-3 right-3 text-white hover:text-gray-300 text-xl'
				>
					×
				</button>
				<div className='p-6'>
					<div className='text-center'>
						<h1 className='text-2xl text-gray-300 pb-2'>
							{modalArguments.title}
						</h1>
						<form onSubmit={handleSubmit}>
							<div className='space-y-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='flex flex-col items-start'>
										<label className='text-gray-200 mb-1'>Name</label>
										<input
											type='text'
											value={name}
											onChange={e => {
												setName(e.target.value);
											}}
											className='rounded px-2 py-1 w-full text-black'
											placeholder='Enter league name'
										/>
									</div>
									<div className='flex flex-col items-start'>
										<label className='text-gray-200 mb-1'>Type</label>
										<select
											value={type}
											onChange={e => {
												setType(e.target.value);
											}}
											className='rounded px-2 py-1 w-full text-black'
										>
											{leagueTypes.map(option => (
												<option key={option.key} value={option.key}>{option.label}</option>
											))}
										</select>
									</div>
								</div>
								<button
									type='submit'
									className='mt-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50'
									disabled={loading || !name}
								>
									{loading ? 'Submitting...' : 'Submit'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
