import React from 'react';
import Button from '../shared/Button';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../api/auth';
import { useToastStore } from '../../api/stores/useToastStore';
import { useState } from 'react';

const Header = () => {
	const navigate = useNavigate();
	const { showToast } = useToastStore();
	const isUserLoggedIn = Boolean(localStorage.getItem('token') || localStorage.getItem('refreshToken'));
	const [activeButton, setActiveButton] = useState('home');

	const HomeButton = () => (
		<Button
			text="Home"
			className={activeButton === 'home' ? buttonStyles.active : buttonStyles.inactive}
			onClick={() => {
				navigate('/');
				setActiveButton('home');
			}}
		/>
	);

	const handleLogout = () => {
		logoutUser();
		showToast('Logout successful!', true);
	};

	const buttonStyles = {
	active: `bg-gray-300 text-green-900 px-6 py-2 rounded-full 
		font-semibold border-2 border-white`,
	inactive: `bg-transparent border-2 border-white text-white 
		px-6 py-2 rounded-full font-semibold
		hover:bg-gray-300 hover:text-green-900 transition-colors`,
	logout: `bg-transparent border-2 text-white 
		px-6 py-2 rounded-full font-semibold
		hover:bg-red-700 hover:text-white transition-colors`,
	};

	return (
		<div className='flex w-full h-[10%] bg-gray-300'>
			<header className='w-[85%] ml-auto bg-green-900 flex justify-between rounded-bl-[5rem]'>
				<div className='flex items-center justify-start gap-4 ml-12'>
					{!isUserLoggedIn ? (
						<>
							<HomeButton />
							<Button
								text="Login"
								className={activeButton === 'login' ? buttonStyles.active : buttonStyles.inactive}
								onClick={() => {
									navigate('login');
									setActiveButton('login');
								}}
							/>
							<Button
								text="Register"
								className={activeButton === 'register' ? buttonStyles.active : buttonStyles.inactive}
								onClick={() => {
									navigate('register');
									setActiveButton('register');
								}}
							/>
						</>
					) : (
						<>
						<HomeButton />
						<Button
						text="Admin"
						className={activeButton === 'admin' ? buttonStyles.active : buttonStyles.inactive}
						onClick={() => {
							navigate('/competitions');
							setActiveButton('admin');
						}}
						/>
						</>
					)}
				</div>
				<div className='flex justify-end items-center text-4xl text-gray-300 p-2'>
					{isUserLoggedIn ? (
					<Button
							text="Log out"
							className={buttonStyles.logout}
							onClick={handleLogout}
						/>
					) : (
						<div className='flex justify-end items-center text-4xl text-gray-300 p-2'>
							Start your own competition.
						</div>
					)}
				</div>
			</header>
		</div>
	);
};

export default Header;