import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';

const ResetPasswordComponent = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: any = {};
        if (!validatePassword(newPassword)) {
            newErrors.newPassword = 'Password must be at least 8 characters, include uppercase, ' +
            'lowercase, number, and special character.';
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                await resetPassword(token, newPassword, confirmPassword);
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            } catch (err: any) {
                setErrors({ api: err?.response?.data?.message || 'Password reset failed.' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const inputClass = 'w-full px-12 py-2 rounded-md border border-gray-300 ' +
    'focus:border-green-900 focus:ring-2 focus:ring-green-200 focus:outline-none text-gray-800 ' +
    'bg-white shadow-sm transition duration-150';
    const buttonClass = 'w-full py-2 rounded-md bg-green-900 hover:bg-green-900 text-white ' +
    'font-semibold transition duration-150 flex items-center justify-center';

    return (
        <div className='flex flex-col items-center w-full p-8'>
            <div className='w-[85%] ml-auto'>
                <h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>Reset Your Password</h1>
                <p className='text-gray-600 mb-6 text-center'>Enter your new password below.</p>
            </div>
            <div className='flex flex-col items-center w-[85%] ml-auto p-8 rounded-lg shadow-md'>
                {success ? (
                    <div 
                        className='text-green-900 text-center font-semibold'>
                        Password reset successful! Redirecting to login...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <input
                                type='password'
                                className={inputClass}
                                placeholder='New Password'
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                            />
                            {errors.newPassword && <p className='text-red-500 text-xs mt-1'>{errors.newPassword}</p>}
                        </div>
                        <div>
                            <input
                                type='password'
                                className={inputClass}
                                placeholder='Confirm New Password'
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                            />
                            {
                                errors.confirmPassword && 
                                <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword}</p>
                            }
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
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordComponent;
