import React from 'react';

export default function Button({ text, className, onClick }: { text: string; className: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`text-sm font-medium w-32 ${className}`}>
      {text}
    </button>
  );
}
