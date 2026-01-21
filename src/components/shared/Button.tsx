import React from 'react';

export default function Button({text, className, onClick}: {text: string; className: string; onClick: () => void}) {
	return (
		<button onClick={onClick} className={`h-8 w-48 text-sm font-medium w-32  bg-green-800 text-gray-300 ${className}`}>
			{text}
		</button>
	);
}
