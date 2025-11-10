import React from 'react';
const Header = () => (
	<div className='flex w-full h-[10%] bg-gray-300'>
		<div className='w-[15%] bg-stone-100'>
			<h1 className='text-lg text-gray-500 mt-1 p-4'>Menu</h1>
		</div>
		<header className='w-[85%] bg-green-900 flex justify-end rounded-bl-[5rem]'>
			<div className='flex items-center'>
				<div className='text-4xl text-gray-300 p-2'>LigaTour</div>
			</div>
		</header>
	</div>
);

export default Header;

{
	/* <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-gray-300"/>Home</li>  TODO check a tag usage
          </ul>
        </nav> */
}
