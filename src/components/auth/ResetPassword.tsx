import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/auth';
import { useToastStore } from '../../api/stores/useToastStore';

const ResetPasswordComponent = () => {
    const { token = '' } = useParams<{ token: string }>();
    const [password, setpassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToastStore();

    const validatePassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            showToast(
                'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.', 
                false
            );
            return;
        }
        if (password !== confirmPassword) {
            console.log(password, confirmPassword);
            showToast('Passwords do not match.', false);
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, password, confirmPassword);
            navigate('/login')
            showToast('Password reset successful!', true);
        } catch (err: any) {
            showToast(err?.response?.data?.message || 'Password reset failed.', false);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = 'w-full px-12 py-2 rounded-md border border-gray-300 ' +
    'focus:border-green-900 focus:ring-2 focus:ring-green-200 focus:outline-none text-gray-800 ' +
    'bg-white shadow-sm transition duration-150';
    const buttonClass = 'w-full py-2 rounded-md bg-green-900 hover:bg-green-900 text-white ' +
    'font-semibold transition duration-150 flex items-center justify-center';

    return (
        <div className='flex flex-col items-center w-full p-8'>
            <div className='w-[95%] ml-auto'>
                <h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>Reset Your Password</h1>
                <p className='text-gray-600 mb-6 text-center'>Enter your new password below.</p>
            </div>
            <div className='flex flex-col items-center w-[95%] ml-auto p-8 rounded-lg shadow-md'>
                
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <input
                                type='password'
                                className={inputClass}
                                placeholder='New Password'
                                value={password}
                                onChange={e => setpassword(e.target.value)}
                                required
                            />
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
                        </div>
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
                
            </div>
        </div>
    );
};

export default ResetPasswordComponent;
