import React from 'react';

const CompetitionCard = ({ name }: { name: string }) => (
  <div className='flex m-4 p-4 border-2 border-gray-400'>
    <div className='flex flex-col justify-center items-center'>
      <p className='text-lg font-semibold mb-8'>{name}</p>
    </div>
  </div>
);

export default CompetitionCard;
