import React from 'react';

const CompetitionCard = ({ title }: { title: string }) => (
  <div className='flex ml-4 border-2 border-black p-4'>
    <div className='flex flex-col justify-center items-center'>
      <p className='text-lg font-semibold mb-8'>{title}</p>
    </div>
  </div>
);

export default CompetitionCard;
