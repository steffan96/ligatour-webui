import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {loginUser} from '../../api/auth';
import { useToastStore } from '../../api/stores/useToastStore';
import { InfoMessageCard } from '../shared/InfoMessageCard';

const LoginComponent = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { toast, showToast, hideToast } = useToastStore();

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateEmail(email)) {
			showToast('Invalid email format.', false);
			return;
		}

		if (!password) {
			showToast('Password is required.', false);
			return;
		} else if (password.length < 6) {
			showToast('Password must be at least 6 characters.', false);
			return;
		}

		setIsLoading(true);
		try {
			await loginUser(email, password);
			navigate('/');
			showToast('Login successful!', true);
		} catch (err: any) {
			showToast(err?.response?.data?.message || 'Login failed. Please check your credentials.', false);
		} finally {
			setIsLoading(false);
		}
	};

	const inputClass = 'w-full px-8 py-3 rounded-md border border-gray-300 focus:border-green-900 ' +
	'focus:ring-2 focus:ring-green-200 focus:outline-none text-gray-800 bg-white ' +
	'shadow-sm transition duration-150';
	
	const buttonClass = 'w-full py-2 rounded-md bg-green-900 hover:bg-green-900 text-white ' +
	'font-semibold transition duration-150 flex items-center justify-center';

	return (
		<div className='flex flex-col items-center w-full p-8'>
				{toast && (
				<InfoMessageCard message={toast.message} isSuccess={toast.isSuccess} onClose={hideToast} />
			)}
			<div className='w-[85%] ml-auto'>
				<h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>Welcome Back</h1>
				<p className='text-gray-600 mb-6 text-center'>Sign in to continue</p>
			</div>
			<div className='flex flex-col items-center w-[85%] ml-auto p-8 rounded-lg shadow-md'>
				<form onSubmit={handleSubmit} className='space-y-5'>
					<div>
						<input
							type='email'
							className={inputClass}
							placeholder='Email'
							value={email}
							onChange={e => {
								setEmail(e.target.value);
							}}
							required
						/>
					</div>
					<div>
						<input
							type='password'
							className={inputClass}
							placeholder='Password'
							value={password}
							onChange={e => {
								setPassword(e.target.value);
							}}
							required
						/>
					</div>

					<button
						type='submit'
						className={buttonClass}
						disabled={isLoading}
					>
						{isLoading && (
							<svg className='animate-spin h-5 w-5 mr-2 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
								<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
								<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
							</svg>
						)}
						{isLoading ? 'Logging in...' : 'Login'}
					</button>
				</form>
				<p className='text-gray-600 mt-6 text-center'>
					Don&apos;t have an account?{' '}
					<a href='/register' className='text-green-900 hover:underline font-medium'>Register here</a>
				</p>
				<p className='text-gray-500 text-sm mt-3 text-center'>
					<Link to='/forgot-password' className='text-green-900 hover:underline'>Forgot your password?</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginComponent;