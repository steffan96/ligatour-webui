export default function Button({text, className, onClick}: {text: string; className: string; onClick: () => void}) {
	return (
		<button onClick={onClick} className={`px-3 py-1 rounded-full text-sm ${className}`}>
			{text}
		</button>
	);
}
