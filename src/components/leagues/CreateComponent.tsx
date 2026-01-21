import React from 'react';
import Button from '../shared/Button';
import CreateComponentHeader from './CreateComponentHeader';

export default function CreateComponent({type}: {type: 'leagues' | 'tournaments'}) {
	return (
		<>
			<div className='flex flex-row justify-between items-start mt-8'>
				<CreateComponentHeader
					title={type === 'leagues' ? 'Leagues' : 'Tournaments'}
					description={`Create and manage your ${type}s`}
				/>
				<Button text={`+ Create ${type === 'leagues' ? 'League' : 'Tournament'}`} className='mt-4 ml-4 rounded-md' onClick={() => {
					// TODO: Implement create functionality
				}} />
			</div>
			<div className=''>

			</div>
		</>
	);
}
