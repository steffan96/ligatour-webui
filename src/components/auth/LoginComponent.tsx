import React, {useState} from 'react';
import { loginUser } from '../../api/auth/auth';

const LoginComponent = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<any>({});
	const [isLoading, setIsLoading] = useState(false);

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: any = {};
		
		if (!validateEmail(email)) {
			newErrors.email = 'Invalid email address.';
		}

		if (!password) {
			newErrors.password = 'Password is required.';
		} else if (password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters.';
		}

		setErrors(newErrors);
		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			try {
				await loginUser(email, password);
				// You might want to redirect or handle successful login differently
				// For now, we'll just clear the form
				setEmail('');
				setPassword('');
			} catch (err: any) {
				setErrors({ api: err?.response?.data?.message || 'Login failed. Please check your credentials.' });
			} finally {
				setIsLoading(false);
			}
		}
	};

	const inputClass = 'w-full px-8 py-3 rounded-md border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none text-gray-800 bg-white shadow-sm transition duration-150';
	const buttonClass = 'w-full py-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition duration-150 flex items-center justify-center';

	return (
		<div className='flex flex-col items-center w-full p-8'>
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
								if (errors.email) setErrors({...errors, email: ''});
							}}
							required
						/>
						{errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
					</div>
					<div>
						<input
							type='password'
							className={inputClass}
							placeholder='Password'
							value={password}
							onChange={e => {
								setPassword(e.target.value);
								if (errors.password) setErrors({...errors, password: ''});
							}}
							required
						/>
						{errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
					</div>
					
					{errors.api && (
						<div className='text-red-500 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200'>
							{errors.api}
						</div>
					)}
					
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
					<a href='/register' className='text-green-700 hover:underline font-medium'>Register here</a>
				</p>
				<p className='text-gray-500 text-sm mt-3 text-center'>
					<a href='/forgot-password' className='text-green-600 hover:underline'>Forgot your password?</a>
				</p>
			</div>
		</div>
	);
};

export default LoginComponent;