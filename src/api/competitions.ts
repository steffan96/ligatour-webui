import axiosInstance from '../router/axios';

export const createCompetition = async (name: string, type: string) => {
	const payload = {name, type};
	const response = await axiosInstance.post('/api/competitions', payload);
	return response.data;
};
