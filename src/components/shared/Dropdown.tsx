export default function Dropdown() {
	const menuItems = [
		{id: 1, label: 'Round robin', key: 'round_robin'},
	];

	const handleItemClick = (action: string) => {
		console.log(`Action: ${action}`);
	};

	return (
		<div className='relative flex text-left'>
			<div className='w-56 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0'>
				{menuItems.map((item, index) => (
					<div key={item.id}>
						<button
							onClick={() => {
								handleItemClick(item.label);
							}}
							className='group flex w-full items-center gap-2 rounded-lg px-3 py-2.5 hover:bg-white/10 focus:bg-white/10 focus:outline-none transition-colors duration-150'
						>
							<span className='flex-1 text-left'>{item.label}</span>
						</button>
						{index === 1 && (
							<div className='my-1 h-px bg-white/5' />
						)}
					</div>
				))}
			</div>
		</div>
	);
}
