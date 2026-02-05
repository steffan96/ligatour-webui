import React from 'react';
import CreateComponent from '../competitions/CreateCompetition';

export default function LandingLayout() {
	return (
		<div className='flex w-full p-8'>
			<div className='w-[85%] ml-auto'>
				<div className='ml-4'>
					<h1 className='text-4xl p-2'>Competition Manager</h1>
					<h4 className='text-lg p-2 ml-2'>Create and manage your leagues and tournaments</h4>
					<CreateComponent />
				</div>
			</div>
		</div>
	);
}
