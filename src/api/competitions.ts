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

export const getCompetition = async (id: number) => {
	const response = await axiosInstance.get(`/api/v1/competitions/${id}`);
	if (response && response.data) {
		return response.data;
	}
	return null;
};

export const updateCompetition = async (id: number, updates: { name?: string; type?: string }) => {
	const response = await axiosInstance.put(`/api/v1/competitions/${id}`, updates);
	if (response && response.data) {
		return response.data;
	}
	return null;
};

export const deleteCompetition = async (id: number) => {
	const response = await axiosInstance.delete(`/api/v1/competitions/${id}`);
	if (response && response.status === 204) {
		return true;
	}
	return false;
};