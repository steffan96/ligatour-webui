import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Button from '../shared/Button';
import CreateComponent from '../leagues/CreateComponent';

export default function LandingLayout() {
	const navigate = useNavigate();
	const [selected, setSelected] = useState<'leagues' | 'tournaments'>('leagues');

	return (
		<div className='flex w-full p-8'>
			<div className='w-[85%] ml-auto'>
				<div className='ml-4'>
					<h1 className='text-4xl p-2'>Competition Manager</h1>
					<h4 className='text-lg p-2 ml-2'>Create and manage your leagues and tournaments</h4>
					<Button
						onClick={() => {
							setSelected('leagues');
							navigate('/my-competitions');
						}}
						text='Leagues'
						className={`rounded-l-full ${selected === 'leagues' ? 'opacity-100' : 'opacity-50'}`}>
					</Button>
					<Button
						onClick={() => {
							setSelected('tournaments');
							navigate('/my-competitions');
						}}
						text='Tournaments'
						className={`ml-0 rounded-r-full ${selected === 'tournaments' ? 'opacity-100' : 'opacity-50'}`}>
					</Button>
					<CreateComponent type={selected} />
				</div>
			</div>
		</div>
	);
}
