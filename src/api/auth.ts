import axiosInstance from '../router/axios';

export const registerUser = async (email: string, password: string, confirmPassword: string) => {
	const payload = {email, password, confirmPassword};
	const response = await axiosInstance.post('/api/auth/register', payload);
	return response.data;
};
