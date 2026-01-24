import React from 'react';
import Button from '../shared/Button';
import {useNavigate} from 'react-router-dom';

const Header = () => {
	const navigate = useNavigate();

	return (
		<div className='flex w-full h-[10%] bg-gray-300'>
			<header className='w-[85%] ml-auto bg-green-900 flex justify-between rounded-bl-[5rem]'>
				<div className='flex items-center justify-start gap-4 ml-12'>
					<Button text='Login' className='bg-gray-300 text-green-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200' onClick={() => {
						// TODO: Implement login functionality
					}} />
					<Button text='Register' className='bg-transparent border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-300 hover:text-green-900 transition-colors' onClick={() => {
						navigate('register');
					}} />
				</div>
				<div className='flex justify-end items-center text-4xl text-gray-300 p-2'>Start your own adventure.</div>
			</header>
		</div>
	);
};

export default Header;

{
	/* <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-gray-300"/>Home</li>  TODO check a tag usage
          </ul>
        </nav> */
}
