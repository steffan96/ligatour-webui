import React from 'react';

export default function CreateComponent({title, description}: {title: string; description: string}) {
	return (
		<div className='ml-4 w-[80%]'>
			<div className='mb-2'>
				<h1 className='text-lg font-semibold'>{title}</h1>
				<p className='text-sm opacity-70'>{description}</p>
			</div>
		</div>
	);
}
