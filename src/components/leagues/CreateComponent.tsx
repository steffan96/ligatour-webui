import React from 'react';
import Button from '../shared/Button';
import CreateComponentHeader from './CreateComponentHeader';

export default function CreateComponent({type}: {type: 'leagues' | 'tournaments'}) {
	return (
		<>
			<div className='flex flex-row justify-between items-start mt-8'>
				<CreateComponentHeader
					title={type === 'leagues' ? 'Leagues' : 'Tournaments'}
					description={`Create and manage your ${type}`}
				/>
				<Button text={`+ Create ${type === 'leagues' ? 'League' : 'Tournament'}`} className='mt-4 ml-4 rounded-md' onClick={() => {
					// TODO: Implement create functionality
				}} />
			</div>
			<div className='ml-4 border-2 border-dotted border-black p-4'>
				<div className='flex flex-col justify-center items-center'>
					<h1 className='text-lg font-semibold mb-4'>{`No ${type} yet`}</h1>
					<p>{`Create your first ${type === 'leagues' ? 'league' : 'tournament'} to get started.`}</p>
					<Button text={`+ Create ${type === 'leagues' ? 'League' : 'Tournament'}`} className='mt-4 ml-4 rounded-md' onClick={() => {
						// TODO: Implement create functionality
					}} />
				</div>
			</div>
		</>
	);
}
