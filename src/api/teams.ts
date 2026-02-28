import axiosInstance from './../router/axios';

export const listTeams = async () => {
	const response = await axiosInstance.get('/api/v1/teams');
	if (response && response.data) {
		return response.data;
	}
	return [];
};
