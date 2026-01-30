import React, {useState} from 'react';
import { registerUser } from '../../api/auth';

const RegisterComponent = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState<any>({});
	const [isLoading, setIsLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newErrors: any = {};
		if (!validateEmail(email)) {
			newErrors.email = 'Invalid email address.';
		}

		if (!validatePassword(password)) {
			newErrors.password = 'Password must be at least 8 characters, ' +
			'include uppercase, lowercase, number, and special character.';
		}

		if (password !== confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match.';
		}

		setErrors(newErrors);
		if (Object.keys(newErrors).length === 0) {
			setIsLoading(true);
			try {
				await registerUser(email, password, confirmPassword);
				setSuccess(true);
			} catch (err: any) {
				setErrors({ api: err?.response?.data?.message || 'Registration failed.' });
			} finally {
				setIsLoading(false);
			}
		}
	};

	const inputClass = 'w-full px-12 py-2 rounded-md border border-gray-300 ' + 
	'focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none' + 
	' text-gray-800 bg-white shadow-sm transition duration-150';
	const buttonClass = 'w-full py-2 rounded-md bg-green-600 hover:bg-green-700 ' + 
	'text-white font-semibold transition duration-150 flex items-center justify-center';

	return (
		<div className='flex flex-col items-center w-full p-8'>
			<div className='w-[85%] ml-auto'>
				<h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>Create an Account</h1>
				<p className='text-gray-600 mb-6 text-center'>Join us today and start competing!</p>
			</div>
			<div className='flex flex-col items-center w-[85%] ml-auto p-8 rounded-lg shadow-md'>
				{success ? (
					<div className='text-green-600 text-center font-semibold'>Registration successful!</div>
				) : (
					<form onSubmit={handleSubmit} className='space-y-4'>
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
								}}
								required
							/>
							{errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
						</div>
						<div>
							<input
								type='password'
								className={inputClass}
								placeholder='Confirm Password'
								value={confirmPassword}
								onChange={e => {
									setConfirmPassword(e.target.value);
								}}
								required
							/>
							{errors.confirmPassword && <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword}</p>}
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
							{isLoading ? 'Registering...' : 'Register'}
						</button>
					</form>
				)}
				<p className='text-gray-600 mt-6 text-center'>
          Already have an account?{' '}
					<a href='/login' className='text-green-700 hover:underline font-medium'>Login here</a>
				</p>
			</div>
		</div>
	);
};

export default RegisterComponent;
