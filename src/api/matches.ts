import axiosInstance from '../router/axios';

export const listMatches = async (competitionId: number, round: number) => {
  try {
    const response = await axiosInstance.get(`/api/v1/matches/${competitionId}`, {
      params: { round },
    });
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to fetch matches.';
  }
};