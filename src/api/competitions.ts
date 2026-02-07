import axiosInstance from '../router/axios';

export const createCompetition = async (name: string, type: string) => {
	const payload = {name, type};
	const response = await axiosInstance.post('/api/v1/competitions', payload);
	if (response && response.data) {
		return response.data;
	}
	return null;
};

export const listCompetitions = async () => {
	const response = await axiosInstance.get('/api/v1/competitions');
	if (response && response.data) {
		return response.data;
	}
	return [];
};
