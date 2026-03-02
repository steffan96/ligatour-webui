import React, { useState } from 'react';
import { requestPasswordReset } from '../../api/auth';

const ForgotPasswordComponent = () => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

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
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                const data = await requestPasswordReset(email);
                if (!data) {
                    setErrors({ api: 'Failed to send reset email. Please try again.' });
                    return;
                }
                setSuccess(true);
            } catch (err: any) {
                setErrors({ api: err?.response?.data?.message || 'Failed to send reset email.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const inputClass = 'w-full px-12 py-2 rounded-md border border-gray-300 ' +
    'focus:border-green-900 focus:ring-2 focus:ring-green-200 focus:outline-none ' +
    'text-gray-800 bg-white shadow-sm transition duration-150';
    const buttonClass = 'w-full py-2 rounded-md bg-green-900 hover:bg-green-900 ' +
    'text-white font-semibold transition duration-150 flex items-center justify-center';

    return (
        <div className='flex flex-col items-center w-full p-8'>
            <div className='w-[95%] ml-auto'>
                <h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>Forgot Password</h1>
                <p className='text-gray-600 mb-6 text-center'>Enter your email to receive a password reset link.</p>
            </div>
            <div className='flex flex-col items-center w-[95%] ml-auto p-8 rounded-lg shadow-md'>
                {success ? (
                    <div className='text-green-900 text-center font-semibold'>Reset link sent! Check your email.</div>
                ) : (
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <input
                                type='email'
                                className={inputClass}
                                placeholder='Email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                            {errors.email && <p className='text-red-500 whitespace-pre text-xs mt-1'>{errors.email}</p>}
                        </div>
                        {errors.api && (
                            <div 
                            className='text-red-500 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200'>
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
                                    <circle 
                                        className='opacity-25' 
                                        cx='12' 
                                        cy='12' 
                                        r='10' 
                                        stroke='currentColor' 
                                        strokeWidth='4'>
                                    </circle>
                                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z'></path>
                                </svg>
                            )}
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordComponent;
