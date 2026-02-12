import React from 'react';
import CreateComponent from '../competitions/CreateCompetition';

export default function LandingLayout() {
	return (
		<div className='flex w-full p-8'>
			<div className='w-[85%] ml-auto'>
			<h1 className="max-w-4xl mx-auto text-4xl md:text-5xl tracking-tight mb-6 mt-16">
				Laying the Foundation for{' '}
				<span className="text-green-900">League Play</span>
			</h1>
			<CreateComponent />
			</div>
		</div>
	);
}
