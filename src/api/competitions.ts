import axiosInstance from '../router/axios';

export const createCompetition = async (name: string, type: string) => {
	const payload = {name, type};
	const response = await axiosInstance.post('/api/v1/competitions', payload);
	return response.data;
};

export const listCompetitions = async () => {
	const response = await axiosInstance.get('/api/v1/competitions');
	return response.data;
};
