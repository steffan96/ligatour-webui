import axiosInstance from '../router/axios';

export const registerUser = async (email: string, password: string, confirmPassword: string) => {
	const payload = {email, password, confirmPassword};
	const response = await axiosInstance.post('/api/auth/register', payload);
	return response.data;
};

export const loginUser = async (email: string, password: string) => {
	const response = await axiosInstance.post('/api/auth/login', { email, password });
	localStorage.setItem('token', response.data.token);
	localStorage.setItem('refreshToken', response.data.refresh_token);
	localStorage.setItem('userID', response.data.user.id);
};

export const logoutUser = async () => {
	localStorage.removeItem('token');
	localStorage.removeItem('refreshToken');
	localStorage.removeItem('userID');
	const userID = localStorage.getItem('userID');
	await axiosInstance.post('/api/auth/logout', { userID });
};

export const requestPasswordReset = async (email: string) => {
    const response = await axiosInstance.post('/api/auth/request-password-reset', { email });
    return response.data;
};

export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
    const payload = { token, password, confirmPassword };
    const response = await axiosInstance.post('/api/auth/reset-password', payload);
    return response.data;
};
