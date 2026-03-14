import axiosInstance from './../router/axios';

export const createTeam = async (name: string) => {
  const response = await axiosInstance.post('/api/v1/teams', { name });
  if (response && response.data) {
    return response.data;
  }
  return null;
};

export const getTeam = async (teamId: string) => {
  const response = await axiosInstance.get(`/api/v1/teams/${teamId}`);
  if (response && response.data) {
    return response.data;
  }
  return null;
};

export const listTeams = async () => {
  const response = await axiosInstance.get('/api/v1/teams');
  if (response && response.data) {
    return response.data;
  }
  return [];
};

export const updateTeam = async (teamId: string, name: string) => {
  const response = await axiosInstance.put(`/api/v1/teams/${teamId}`, { name });
  if (response && response.data) {
    return response.data;
  }
  return null;
};

export const deleteTeam = async (teamId: string) => {
  const response = await axiosInstance.delete(`/api/v1/teams/${teamId}`);
  if (response && response.data) {
    return response.data;
  }
  return null;
};

export const addPlayerToTeam = async (
  teamId: string,
  player: { first_name: string; last_name: string; email?: string }
) => {
  const response = await axiosInstance.post(`/api/v1/teams/add-player-to-team`, {
    ...player,
    team_id: Number(teamId),
  });
  if (response && response.data) {
    return response.data;
  }
  return null;
};
