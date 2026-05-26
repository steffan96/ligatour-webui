import axiosInstance from '../router/axios';

export const updateMatch = async (competitionId: number, roundId: number, matchId: number, winnerTeamId: number) => {
  try {
    const response = await axiosInstance.put(`/api/v1/matches/${competitionId}/${roundId}/${matchId}`, winnerTeamId);
    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }
    throw error.message || 'Failed to update match.';
  }
};

export const restartMatch = async (
  competitionId: number,
  roundId: number,
  matchId: number
) => {
  try {
    const response = await axiosInstance.put(
      `/api/v1/matches/${competitionId}/${roundId}/${matchId}/restart`
    );

    return response;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw error.response.data.message;
    }

    throw error.message || 'Failed to restart match.';
  }
};
