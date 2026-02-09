import React from 'react';
import { useState, useEffect } from 'react';
import { listCompetitions } from 'api/competitions';
import CompetitionCard from '../competitions/CompetitionCard';

export default function MyCompetitions() {
	const [competitions, setCompetitions] = useState<{ id: string, name: string }[]>([]);
	
		useEffect(() => {
			const fetchCompetitions = async () => {
				const data = await listCompetitions();
				setCompetitions(data || []);
			};
			fetchCompetitions();
		}, []);
	
	return (
		<div className='flex flex-col'>
			<h1 className='text-2xl font-bold ml-4'>My Competitions</h1>
			{competitions.map((competition) => (
				<CompetitionCard key={competition.id} name={competition.name} />
			))}
		</div>
	);
}
